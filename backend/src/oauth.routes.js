import express from 'express'
import { randomUUID } from 'crypto'
import User from '../data/user.model.js'
import { readCookie, setAuthCookie, signAuthToken } from './auth-utils.js'

const router = express.Router()

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000'

const providers = {
  google: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    profileUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
    scope: 'openid email profile',
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  },
  facebook: {
    authUrl: 'https://www.facebook.com/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/oauth/access_token',
    profileUrl: 'https://graph.facebook.com/me?fields=id,name,email',
    scope: 'email,public_profile',
    clientId: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET
  },
  github: {
    authUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    profileUrl: 'https://api.github.com/user',
    emailUrl: 'https://api.github.com/user/emails',
    scope: 'read:user user:email',
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET
  }
}

function redirectUri(provider) {
  return `${backendUrl}/auth/${provider}/callback`
}

function getProvider(provider, res) {
  const config = providers[provider]

  if (!config) {
    res.status(404).json({ message: 'OAuth provider not supported' })
    return null
  }

  if (!config.clientId || !config.clientSecret) {
    res.status(500).json({ message: `${provider} OAuth is not configured` })
    return null
  }

  return config
}

async function exchangeCodeForToken(provider, config, code) {
  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    redirect_uri: redirectUri(provider),
    grant_type: 'authorization_code'
  })

  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  })

  return response.json()
}

async function getProfile(provider, config, accessToken) {
  const response = await fetch(config.profileUrl, {
    headers: { Authorization: `Bearer ${accessToken}` }
  })
  const profile = await response.json()

  if (provider !== 'github' || profile.email) {
    return profile
  }

  const emailResponse = await fetch(config.emailUrl, {
    headers: { Authorization: `Bearer ${accessToken}` }
  })
  const emails = await emailResponse.json()
  const primaryEmail = Array.isArray(emails)
    ? emails.find((item) => item.primary && item.verified) || emails.find((item) => item.verified)
    : null

  return { ...profile, email: primaryEmail?.email }
}

function normalizeProfile(provider, profile) {
  return {
    providerId: String(profile.id || profile.sub || ''),
    email: profile.email,
    name: profile.name || profile.login || ''
  }
}

router.get('/auth/:provider', (req, res) => {
  const { provider } = req.params
  const config = getProvider(provider, res)
  if (!config) return

  const state = randomUUID()
  const url = new URL(config.authUrl)
  url.searchParams.set('client_id', config.clientId)
  url.searchParams.set('redirect_uri', redirectUri(provider))
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', config.scope)
  url.searchParams.set('state', state)

  res.cookie('oauthState', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 10 * 60 * 1000
  })

  return res.redirect(url.toString())
})

router.get('/auth/:provider/callback', async (req, res) => {
  try {
    const { provider } = req.params
    const { code, state } = req.query
    const config = getProvider(provider, res)
    if (!config) return

    if (!code || !state || state !== readCookie(req, 'oauthState')) {
      return res.redirect(`${frontendUrl}/?oauth=failed`)
    }

    const tokenData = await exchangeCodeForToken(provider, config, code)
    if (!tokenData.access_token) {
      return res.redirect(`${frontendUrl}/?oauth=failed`)
    }

    const profile = normalizeProfile(provider, await getProfile(provider, config, tokenData.access_token))
    if (!profile.email) {
      return res.redirect(`${frontendUrl}/?oauth=no-email`)
    }

    const providerKey = `oauthProviders.${provider}`
    const user = await User.findOneAndUpdate(
      { email: profile.email },
      {
        $set: {
          email: profile.email,
          name: profile.name,
          authProvider: provider,
          [providerKey]: profile.providerId
        },
        $setOnInsert: { password: '' }
      },
      { new: true, upsert: true }
    )

    const token = signAuthToken(user)
    setAuthCookie(res, token)

    return res.redirect(`${frontendUrl}/?oauth=success&token=${token}`)
  } catch (err) {
    console.log(err)
    return res.redirect(`${frontendUrl}/?oauth=failed`)
  }
})

export default router
