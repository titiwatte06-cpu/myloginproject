import jwt from 'jsonwebtoken'

export const authUser = async (req, res, next) => {
  const token = req.cookies.accessToken || req.headers.authorization?.split('Bearer ')[1] // ✅ cookies มี s

  if (!token) {
    return res.status(401).json({
      success: false,               // ✅ success + :
      message: "Access denied, No token!"
    })
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
    req.user = decodedToken
    next()  // ✅ แยกบรรทัด
  } catch (error) {
    next(error)
  }
}