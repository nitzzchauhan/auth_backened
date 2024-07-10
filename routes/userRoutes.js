import express from 'express'
import UserController from "./../controllers/userControllers.js"
import checkUserAuth from './../middleware/auth-middleware.js'
import validator from './../middleware/validator.js'
const router = express.Router()


//protection by middle


router.use("/changepassword", checkUserAuth)
router.use("/logged", checkUserAuth)
router.use("/login", validator)





// public routes
router.post('/register', UserController.userRegistration)
router.post('/login',UserController.userLogin)
router.post('/send-reset-password-email',UserController.sendUserPasswordResetEmail)
router.post('/reset-password/:id/:token',UserController.userPasswordReset )




// private routes
router.post('/changepassword',UserController.changeUserPassword)
router.get('/logged',UserController.loggedUser)


export default router