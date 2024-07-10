import userModel from './../models/userModel.js'
import bcrypt, { hash } from "bcrypt"
import jwt from "jsonwebtoken"
import transporter from '../emailconfig/emailConfig.js'


class UserController {

    static userRegistration = async (req, res) => {

        // user registration
        const { name, email, password, confirm_pass, tc } = req.body;
        const user = await userModel.findOne({ email: email })
        if (user) {
            res.send({ "status": "failed", "message": "Email Already Exists" })
        }
        else {
            if (name && email && password && confirm_pass && tc) {

                if (password === confirm_pass) {
                    try {
                        const salt = await bcrypt.genSalt(10);
                        const hashPassword = await bcrypt.hash(password, salt);
                        const doc = new userModel({
                            name,
                            email,
                            password: hashPassword,
                            tc
                        })
                        await doc.save();
                        const saved_user = await userModel.findOne({ email: email })
                        // generate token
                        const token = jwt.sign({ UserID: saved_user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })

                        res.status(201).send({ "status": "success", "message": "User Registered Successfully", "token": token })
                    }
                    catch (error) {
                        console.log(error)
                        res.send({ "status": "failed", "message": "unable to register" })
                    }
                }

                else {
                    res.send({ "status": "failed", "message": "Password and Confirm Password does not match" })
                }

            }
            else {
                res.send({ "status": "failed", "message": "All fields are required" })
            }
        }
    }
    // userlogin function
    static userLogin = async (req, res) => {
        try {

            const { email, password } = req.body
            if (email && password) {
                const user = await userModel.findOne({ email: email })
                if (user != null) {

                    const isMatch = await bcrypt.compare(password, user.password)
                    if ((user.email === email) && isMatch) {
                        const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })

                        res.send({ "status": "success", "message": "Login Successful", "token": token })


                    }
                    else {
                        res.send({ "status": "failed", "message": "Email and Password is not valid" })
                    }

                }
                else {
                    res.send({ "status": "failed", "message": "User not registered" })
                }
            }
            else {
                res.send({ "status": "failed", "message": "All fields are required" })
            }





        }
        catch (error) {
            res.send({ "status": "failed", "message": "unable to login" })
        }
    }

    static changeUserPassword = async (req, res) => {
        const { password, password_confirmation } = req.body
        if (password && password_confirmation) {

            if (password !== password_confirmation) {

                res.send({ "status": "failed", "message": "New password and Confirm new Password do not match" })
            }

            else {

                const salt = await bcrypt.genSalt(10)
                const hashPassword = await bcrypt.hash(password, salt)

                const user = await userModel.findByIdAndUpdate(req.user._id, { $set: { password: hashPassword } })
                res.send({ "status": "success", "message": "Password changed successfully" })

            }

        }
        else {
            res.send({ "status": "failed", "message": "All fields are required" })
        }




    }

    // userpasword reset
    static userPasswordReset = async (req, res) => {

        const { password, password_confirmation } = req.body
        const { id, token } = req.params
        const user = await userModel.findById(id)
        // console.log(user.id)
        // console.log(process.env.JWT_SECRET_KEY)

        // const verify_token = jwt.verify(token, process.env.JWT_SECRET_KEY)
        // console.log(verify_token)


        try {

            const verify = jwt.verify(token, process.env.JWT_SECRET_KEY)
            // console.log(verify)
            // jwt.verify(token,new_secret)
            if (password && password_confirmation) {
                if (password !== password_confirmation) {
                    res.send({ "status": "failed", "message": "New password and Confirm new Password do not match" })
                }
                else {
                    // $2b$10$M1yxWWd74PR15V/S5.CVFOEQaaCE8A//65dDbcvigahizzXRohi96
                    // $2b$10$NKxWQ78pQeEHr9dZnJhwdO3WuBjN3/pWN3u5.IRFhWOkJYwJLmDRi

                    // $2b$10$M1yxWWd74PR15V/S5.CVFOEQaaCE8A//65dDbcvigahizzXRohi96

                    const salt = await bcrypt.genSalt(10)
                    const newHashPassword = await bcrypt.hash(password, salt)
                    console.log(newHashPassword)
                    // const doc = new userModel({

                    //     password: newHashPassword,

                    // })
                    // await doc.save()
                    const updatedUser = await userModel.findByIdAndUpdate(
                        id,
                        { "password": newHashPassword }, // Fields to update
                        { new: true, runValidators: true } // Options
                    );

                    console.log(updatedUser)



                    // await userModel.findByIdAndUpdate(user._id,{$set:{password: newHashPassword}})
                    res.send({ "status": "success", "message": "Password Changed Successfully" })

                }
            }
            else {
                res.send({ "status": "failed", "message": "All Fields are Required" })
            }
        }
        catch (error) {
            res.send({ "status": "failed", "message": "invalid TOKEN", "error": error })
        }
    }


    static loggedUser = async (req, res) => {
        res.send({ "user": req.user })
    }


    // send reset password
    static sendUserPasswordResetEmail = async (req, res) => {
        const { email } = req.body
        if (email) {

            const user = await userModel.findOne({ email: email })
            if (user) {
                const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "15m" })
                const link = `http://127.0.0.1:3000/api/user/reset-password/${user._id}/${token}`
                //  send email

           


                    const info = async () => {
                        await transporter.sendMail(
                            {
                                from: process.env.EMAIL_FROM,
                                to: user.email,
                                subject: "Nitin --- Reset Password",
                                html: `<a href=${link}>Click here to reset your password</a>`
                            }
                        )
                    
                }

                info()
                res.send({ "status": "success", "message": "Password reset link sent to your email", "info": info })

            }
            else {
                res.send({ "status": "failed", "message": "Email is not registered" })
            }
        }
        else {
            res.send({ "status": "failed", "message": "Email is required" })
        }




    }

















}





export default UserController