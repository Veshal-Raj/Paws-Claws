const express = require('express')
const path = require('path');
const userRouter = require('./routers/userRoute')
const adminRouter = require('./routers/adminRoute')
const app = express()


// Default Use
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname,'public')))


//  View Engine Setup

app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')




//  Error handler
// app.use((req,res,next)=>{
//     res.send('<h1 style ="color:red;">Requested Url was not found!</h1>')
// })

app.use((err, req, res, next) => {
    if (res.headersSent) {
        next('Already Header Sent. There was a problem.');
    } else {
        if (err.message) {
            res.status(500).send(err.message);
        } else {
            res.send('There was an error!');
        }
    }
});


app.use('/',userRouter)
app.use('/admin',adminRouter)



const port = process.env.PORT || 3000
app.listen(port,()=>{
    console.log(`Server is running at port ${port}`)
})