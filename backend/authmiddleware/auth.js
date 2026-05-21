import jwt from 'jsonwebtoken'

export const authUser = async (req, res, next) => {
  const token = req.cookies.accessToken  // ✅ cookies มี s

  if (!token) {
    return res.status(401).json({
      success: false,               // ✅ success + :
      message: "Access denied, No token!"
    })
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { user: { _id: decodedToken.userId } }
    next()  // ✅ แยกบรรทัด
  } catch (error) {
    next(error)
  }
}