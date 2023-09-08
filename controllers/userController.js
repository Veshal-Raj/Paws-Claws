const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const otpGenerator = require('otp-generator')

// ======================== Render user login page ======================= //
const loginpage = async (req,res)=>{
    try {
      //res.redirect('/')
        res.render('users/login',{url:req.protocol+"://"+req.headers.host})
    } catch (error) {
        console.error(error);
    }
}

// ======================== Render signup page ============================ //
const signupPage =async (req,res)=>{
    try {
        res.render('users/signup',{url:req.protocol+"://"+req.headers.host})
    } catch (error) {
        console.error(error);
    }
}

// ========================= Register User ================================= //
const registerUser=  async (req,res)=>{
    try {
        console.log("stage 0")
        let { fullname, email, phone, password } = req.body
        console.log("checking after stage 0")
        fullname = fullname.trim()
        console.log("Checking before stage 1");
        email = email.trim()
        phone = phone.trim()
        password = password.trim()
        if(fullname == "" || email == "" || phone == "" || password == ""){
            res.json({
                status: "FAILED",
                message: "Empty input fileds!"
            })
        }
        console.log("stage 1")
        console.log(password)
        // Hash the password
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log("stage 2")


        // Generate OTP
        const otp = otpGenerator.generate(6, {digits:true, alphabets:false, upperCaseAlphabets:false, lowerCaseAlphabets:false, specialChars:false })
        console.log("stage 3")
        // Store data in session
        req.session.registrationData = { fullname, email, phone, hashedPassword, otp }
        
        // Set a timeout to clear the OTP from the session after 2 minutes
        setTimeout(()=>{
            delete req.session.registrationData.otp
        }, 2*60*1000) // 2 minutes in milliseconds


        console.log("session data stored:", req.session.registrationData)
        console.log("stage 4")
        // Send OTP via email (configure nodemailer with your email service)
        // first i made transporter as const but it shows error like block scope variable for transporter not allowed so i used var
        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: 'veshalbrototype@gmail.com',
              pass: 'wshmnfigmukcwhqy',
            },
          });
        console.log("stage 5")
          const mailOptions = {
            from: 'veshalbrototype@gmail.com',
            to: email,
            subject: 'OTP Verification',
            text: `Your OTP for registration: ${otp}`,
          };
        console.log("stage 6")
        
          await transporter.sendMail(mailOptions);

        console.log("stage 7")
        // Instead of rendering the otp page, i am redirecting to the /otp
        res.redirect('/otp')
          // Render the OTP verification page
        // res.render('users/otp',{url:req.protocol+"://"+req.headers.host}); // Adjust the view name as needed
        console.log("stage 8")
        // const user = new User({ fullname, email, phone, password})
        // await user.save()
        // res.status(201).send('User registered successfully')
    } catch (error) {
        res.status(400).send('Registration failed')
    }
}

// ======================== Render OTP page ================================ //
const otpPage =async (req,res)=>{
    try {
        res.render('users/otp',{url:req.protocol+"://"+req.headers.host})
    } catch (error) {
        console.error(error);
    }
}

// ======================== OTP Verification =============================== //
const verifyOTP= async (req,res)=>{
    try {
        // console.log(req.body)
        
        const enteredOTP = req.body.digit1+req.body.digit2+req.body.digit3+req.body.digit4+req.body.digit5+req.body.digit6
        
        // Get the stored OTP from the session
        const storedOTP = req.session.registrationData.otp

        console.log('Entered otp:', enteredOTP)
        console.log('Stored otp:',storedOTP )


        //Compare the entered OTP with the stored OTP
        if (enteredOTP === storedOTP){
            // Retrieve user data from session            
            const { fullname, email, phone, hashedPassword } = req.session.registrationData

            // Create a new user document and save it to the database
            const user = new User({ fullname, email, phone, password: hashedPassword })
            await user.save()

            // Clear the registration data from the session
            delete req.session.registrationData

            // Redirect to the login page
            res.redirect('/')
        } else {
            // OTP verification failed
            res.status(400).send('OTP verification failed')
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error')
    }
}

// ========================= Resend Otp ===================================== //
const resendOTP = async (req,res)=>{
    try {
        console.log(req.session.registrationData)
        // Check if req.session.registrationData exists and contains the email proprely
        if (!req.session.registrationData || !req.session.registrationData.email){
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
        console.log(req.session.registrationData)
        // Get the user's email from the session (assuming it's strored there)
        const email = req.session.registrationData.email

        // Send the new OTP via email
        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'veshalbrototype@gmail.com',
                pass: 'wshmnfigmukcwhqy',
            }
        }) 

        var mailOptions = {
            from: 'veshalbrototype@gmail.com',
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
        console.error(error);
        res.status(500).send('Error sending OTP')
    }
}


// ========================= Render Forgot Password Page ==================== //
const forgotpasswordPage = async (req,res)=>{
    try {
        res.render('users/forgotpassword',{url:req.protocol+"://"+req.headers.host})
    } catch (error) {
        console.error(error);
    }
}


// ========================== Render Reset Password Page ====================== //
const resetpassword= async (req,res)=>{
    try {
        res.render('users/resetPassword',{url:req.protocol+"://"+req.headers.host})
    } catch (error) {
        console.error(error);
    }
}

// ========================= User Login ====================================== //
const userlogin =async (req,res)=>{
    const { email, password } = req.body
    try {
        // Find the user by email in the database
        const user = await User.findOne({ email })
        console.log(user,password)
        // Check if the user exists
        if(!user) {
            return res.status(401).json({ message: 'User not found' })
        }
        // console.log(typeof password)
        // Compare the provided with the hashed password in the database
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log("hashed password: ",hashedPassword)
        const isPasswordValid = await bcrypt.compare(hashedPassword, user.password);
        // const isPasswordValid = await bcrypt.compare(password, user.password);

        
        console.log('Stored Password (Hashed):', user.password);
        console.log('Password Comparison Result:', isPasswordValid);
        
        if(!isPasswordValid) {
            return res.status(401).json({ message: 'Incorrect password' })
        }

        // User is authenticated, you can set up a session or generate a token here
        // For example, you can set a user ID in the session
        req.session.userId =user._id

        // Redirect to a dashboard or send a sucess message
        res.send('Everything working perfectly!')
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

module.exports={
    loginpage,
    signupPage,
    otpPage,
    forgotpasswordPage,
    resetpassword,
    registerUser,
    verifyOTP,
    resendOTP,
    userlogin
}