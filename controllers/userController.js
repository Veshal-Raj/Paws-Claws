const User = require('../models/userModel')
const mongodb = require('mongodb')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const otpGenerator = require('otp-generator')
const { render } = require('ejs')
const dotenv = require('dotenv').config()






// ======================== Render user login page ======================= //
const loginpage = (req, res) => {
    try {
        res.render('users/userLogin');
    } catch (error) {
        console.error(error);
        res.render('error');
    }
};


// ======================== Render signup page ============================ //
const signupPage = async (req, res) => {
    try {
        res.render('users/signup')
    } catch (error) {
        console.error(error);
        res.render('error')

    }
}

// ========================= Register User ================================= //
const registerUser = async (req, res) => {
    try {

        let { fullname, email, phone, password } = req.body


        // password = password.trim()
        if (fullname == "" || email == "" || phone == "" || password == "") {
            res.json({
                status: "FAILED",
                message: "Empty input fileds!"
            })
        }


        // Hash the password

        const hashedPassword = await bcrypt.hash(password, 10);



        // Generate OTP
        const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false })
        console.log(otp)
        // Store data in session
        req.session.registrationData = { fullname, email, phone, hashedPassword, otp }

        // Set a timeout to clear the OTP from the session after 2 minutes
        setTimeout(() => {
            delete req.session.registrationData.otp
        }, 2 * 60 * 1000) // 2 minutes in milliseconds



        // Send OTP via email (configure nodemailer with your email service)
        // first i made transporter as const but it shows error like block scope variable for transporter not allowed so i used var
        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.NAME,
                pass: process.env.PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.NAME,
            to: email,
            subject: 'OTP Verification',
            text: `Your OTP for registration: ${otp}`,
        };


        await transporter.sendMail(mailOptions);

       
        // Instead of rendering the otp page, i am redirecting to the /otp
        res.redirect('/otp')
        // Render the OTP verification page


    } catch (error) {
        res.render('error')
        console.error(error);
    }
}

// ======================== Render OTP page ================================ //
const otpPage = async (req, res) => {
    try {
        let errorMessage = '';
        res.render('users/otp',{errorMessage})
    } catch (error) {
        res.render('error')
        console.error(error);

    }
}

// ======================== OTP Verification =============================== //
const verifyOTP = async (req, res) => {
    try {


        const enteredOTP = req.body.otp;
        console.log('entered otp',enteredOTP)
        // Get the stored OTP from the session
        const storedOTP = req.session.registrationData.otp
        console.log('storedotp', storedOTP)




        //Compare the entered OTP with the stored OTP
        if (enteredOTP === storedOTP) {
            // Retrieve user data from session            
            const { fullname, email, phone, hashedPassword } = req.session.registrationData

            // Create a new user document and save it to the database
            const user = new User.User({ fullname, email, phone, password: hashedPassword })
            await user.save()

            // Clear the registration data from the session
            delete req.session.registrationData

            // Redirect to the login page
            res.redirect('/')
        } else {
            // OTP verification failed
            res.render('users/otp', { errorMessage: 'OTP verification failed' });
        }
    } catch (error) {
        res.render('error')
        console.error(error);
    }
}

// ========================= Resend Otp ===================================== //
const resendOTP = async (req, res) => {
    try {

        // Check if req.session.registrationData exists and contains the email proprely
        if (!req.session.registrationData || !req.session.registrationData.email) {
            return res.status(400).send('Session data is missing or incomplete ')

        }

        // Generate a new OTP
        const newOTP = otpGenerator.generate(6, {
            digits: true,
            alphabets: false,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        })
        console.log(newOTP)
        // Get the user's email from the session (assuming it's strored there)
        const email = req.session.registrationData.email

        // Send the new OTP via email
        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'process.env.NAME',
                pass: 'process.env.PASSWORD',
            }
        })

        var mailOptions = {
            from: 'process.env.NAME',
            to: email,
            subject: 'OTP Verification',
            text: `Your new OTP for registration: ${newOTP}`
        }

        await transporter.sendMail(mailOptions)

        // Update the session with the new OTP
        req.session.registrationData.otp = newOTP

        // Instead of rendering the otp page, i am redirecting to the /otp
        res.redirect('/otp')

    } catch (error) {
        res.render('error')
        console.error(error);

    }
}


// ========================= Render Forgot Password Page ==================== //
const forgotpasswordPage = async (req, res) => {
    try {
        res.render('users/forgotpassword')
    } catch (error) {
        res.render('error')
        console.error(error);

    }
}


// ======================== Forgot password ============================= //
const forgotpasswordOTP = async (req, res) => {
    try {


        // Generate OTP
        const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false })
        console.log(otp)

        // Store data in session
        req.session.forgotpasswordOTP = otp
        req.session.save()
      
        
        
    } catch (error) {
        res.render('error')
        console.error(error)
    }
}


// ============================== confirmforgotpasswordotp ======================== //
const confirmforgotpasswordotp = async (req, res) => {
    try {
        const enteredOTP = req.body.digit1 + req.body.digit2 + req.body.digit3 + req.body.digit4 + req.body.digit5 + req.body.digit6
        console.log("reached", req.session.forgotpasswordOTP)
        const storedOtp = req.session.forgotpasswordOTP
        if (storedOtp === enteredOTP) {

            return res.render('users/newPassword')
        } else {

            res.render('enterOtp')
        }
    } catch (error) {
        res.render('error')
        console.error(error);
    }
}

// ================================== newPasswordUpdate =========================================== //
const newPasswordUpdate = async (req, res) => {
    try {
        
        const { email, newPassword, repeatPassword } = req.body

        // Check if the email exists in the database
        const user = await User.User.findOne({ email })

        if (!user) {
            return res.render('somethingwentwrong')
        }

        if (newPassword === repeatPassword) {
            // Hash the password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update the user's password  in the database
            user.password = hashedPassword
            await user.save()
            return res.redirect('/login')
        } else {
            return res.render('somethingwentwrong')
        }
    } catch (error) {
        res.render('error')
        console.error(error);
    }
}



// ========================== Render Reset Password Page ====================== //
const resetpassword = async (req, res) => {
    try {
        res.render('users/resetPassword')
    } catch (error) {
        res.render('error')
        console.error(error);

    }
}

// ========================= User Login ====================================== //
const userlogin = async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password


        // Find the user by email in the database

        const user = await User.User.findOne({ email })

        // Check if the user exists
        if (!user) {
            return res.render('users/userLogin', { alert: 'User not found!' })

        }

        const isPasswordValid = await bcrypt.compare(password, user.password);


        if (!isPasswordValid) {
            return res.render('users/userLogin', { alert: 'Incorrect Password' })


        }

        // Check if the user is blocked
        if (!user.isVerified) {
            return res.render('users/userLogin', { alert: 'User is blocked. Please contact support.' });
        }



        // User is authenticated, you can set up a session or generate a token here
        // For example, set a user ID in the session
        req.session.userId = user._id

        // Redirect to a dashboard or send a sucess message
        res.redirect('/home')
    } catch (error) {
        res.render('error')
        console.error(error);
    }
}


// ========================= Home ========================================== //
const home = async (req, res) => {
    try {
        if (req.session.userId) {
           
           
            res.render('users/home', {
                userId: req.session.userId
            })
        } else {
            res.render('users/home')
        }
    } catch (error) {
        res.render('error')
        console.error(error);
    }
}

// ======================== Sign OUt ========================================== //
const userSignout = async (req, res) => {
    try {
        req.session.destroy()
        console.log('session is destroyed')
        res.redirect('/')
    } catch (error) {
        res.render('error')
        console.error(error);
    }
}



module.exports = {
    loginpage,
    signupPage,
    otpPage,
    forgotpasswordPage,
    resetpassword,
    registerUser,
    verifyOTP,
    resendOTP,
    userlogin,
    home,
    userSignout,
    forgotpasswordOTP,
    confirmforgotpasswordotp,
    newPasswordUpdate

}