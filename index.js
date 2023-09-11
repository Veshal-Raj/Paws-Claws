const express = require('express')
const path = require('path');
const userRouter = require('./routers/userRoute')
const adminRouter = require('./routers/adminRoute')
const config = require('./config/config')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const mongodb = require('mongodb')
const session = require('express-session');
mongoose.connect('mongodb://localhost:27017/PawsAndClaws',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=>{
    console.log('Database is connected successfully!')
})
.catch((error)=>{
    console.error('Database connection error:', error);
})
const app = express()

app.use(cookieParser())

app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
}))

// adminRouter.use(session({
//     secret: config.sessionSecret,
//     resave: true,
//     saveUninitialized: true
// }))

// ===================== Default Use ============================== //

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))

// ==================== Cache Controlling========================= //


app.use((req,res,next)=>{
    res.set("Cache-control","no-store,no-cache")
    next()
})

// =========================== View Engine Setup ================== //

app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')


// ========================== Routers ============================= //
app.use('/',userRouter)
app.use('/admin',adminRouter)


// =========================== Server ============================= //
const port = process.env.PORT || 4000
app.listen(port,()=>{
    console.log(`Server is running at port ${port}`)
})