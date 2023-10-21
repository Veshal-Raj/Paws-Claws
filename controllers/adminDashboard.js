const User = require('../models/userModel')
const Order = require('../models/ordersModel')
const Category = require('../models/categoriesModel')
const Subcategory = require('../models/subcategoriesModel')
const Product = require('../models/productsModel')
const { Parser } = require('json2csv')



// ================== Render Dashboard ==================== //
const dashboard = async (req, res) => {
    try {
        const order = await Order.find()
        const user = await User.User.find()
        const categories = await Category.Category.find({ isDisabled: false });
        const subcategory = await Subcategory.find({ isDisabled: false })
        const product = await Product.find({ isAvailable: true })

        // Calculate the total amount of all orders
        const totalAmount = order.reduce((total, order) => total + order.totalAmount, 0);


        // Calculate the profit (80% of total amount)
        const profit = totalAmount * 0.8;

        console.log('order : ',typeof(order))
        // console.log(order)
        console.log('category : ',typeof(categories))
        console.log(categories)
        console.log('subcategory: ', typeof(subcategory))
        console.log('product : ', typeof(product))


        
        res.render('admin/dashboard',{ order, user, totalAmount, profit, categories, subcategory, product})

    } catch (error) {
        res.render('error')
        console.error(error);
    }
}


const ChartPaymentMethod = async (req,res) => {
    try {
        const walletPayment=await Order.countDocuments({paymentMethod:'Wallet'})
        const onlinePayment=await Order.countDocuments({paymentMethod:'Online Payment'})
        const cashOnDelivery=await Order.countDocuments({paymentMethod:'COD'})
        res.json({walletPayment,onlinePayment,cashOnDelivery})

    } catch (error) {
        console.error(error)
        res.status(500).send('Internal server error') 
 
    }
}


const ChartRevenueBasedOnMonth = async (req,res) => {
    try {
        console.log('hello')
        const orders = await Order.find({ status: 'Delivered' });
        console.log('orders ', orders)
       const revenueData = orders.reduce((acc, order) => {
        const orderDate = new Date(order.orderDate);
        const year = orderDate.getFullYear();
        const month = orderDate.getMonth();
        if (!acc[year]) {
            acc[year] = {};
          }
          if (!acc[year][month]) {
            acc[year][month] = 0;
          }
          acc[year][month] += order.totalAmount;
          return acc;
        }, {});
        console.log('revune data', revenueData)
        res.json(revenueData);        

    } catch (error) {
        
    }
}


// ================================== Sales report ======================================== //

const salesreport = async (req, res) => {
    try {
        console.log('hello')
        const { fromDate, toDate } = req.query;
        // const fromDate = req.query.fromDate
        // const toDate = req.query.toDate
        // const sample = req.query.sample
        // console.log(sample)
        console.log(req.query)
        let order = await Order.find();  // Use let here to allow reassignment
        console.log('order;',order)
        if (fromDate && toDate) {
            // Convert fromDate and toDate to Date objects
            const fromDateObj = new Date(fromDate);
            const toDateObj = new Date(toDate);

            // Filter orders based on date range
            order = order.filter((order) => {
                return order.orderDate >= fromDateObj && order.orderDate <= toDateObj;
            });
        }
        console.log('order after filtering ',order)
        // Calculate the total amount of all filtered orders
        const totalAmount = order.reduce((total, order) => total + order.totalAmount, 0);
        console.log('total amount ',totalAmount)
        // Calculate the profit (80% of total amount)
        const profit = totalAmount * 0.8;
        console.log('profit ', profit)

        if (req.xhr) {
            // It's an AJAX request (e.g., CSV generation)
            // Return the data as JSON
            res.json({ order, totalAmount, profit });
        } else {
            // It's a regular page visit
            res.render('admin/salesReport', { order, totalAmount, profit });
        }

     
    } catch (error) {
         // Handle errors here
         if (req.xhr) {
            // AJAX request
            res.status(500).json({ error: "Internal server error" });
        } else {
            // Regular page visit
            res.render('error');
        }
    }
}


// ================================= Sales Report Download ============================= //
const salesreportDownload = async (req, res) => {
    try {
        console.log('hello')
        const { fromDate, toDate } = req.query;
        // const fromDate = req.query.fromDate
        // const toDate = req.query.toDate
        // const sample = req.query.sample
        // console.log(sample)
        console.log(req.query)
        let order = await Order.find();  // Use let here to allow reassignment
        console.log('order;',order)
        if (fromDate && toDate) {
            // Convert fromDate and toDate to Date objects
            const fromDateObj = new Date(fromDate);
            const toDateObj = new Date(toDate);

            // Filter orders based on date range
            order = order.filter((order) => {
                return order.orderDate >= fromDateObj && order.orderDate <= toDateObj;
            });
        }
        console.log('order after filtering ',order)
        // Calculate the total amount of all filtered orders
        const totalAmount = order.reduce((total, order) => total + order.totalAmount, 0);
        console.log('total amount ',totalAmount)
        // Calculate the profit (80% of total amount)
        const profit = totalAmount * 0.8;
        console.log('profit ', profit)

        // if (req.xhr) {
        //     // It's an AJAX request (e.g., CSV generation)
        //     // Return the data as JSON
        // } else {
        //     // It's a regular page visit
        //     res.render('admin/salesReport', { order, totalAmount, profit });
        // }
        
        res.json({ order, totalAmount, profit });
     
    } catch (error) {
         // Handle errors here
         if (req.xhr) {
            // AJAX request
            res.status(500).json({ error: "Internal server error" });
        } else {
            // Regular page visit
            res.render('error');
        }
    }
}



module.exports = {
    dashboard,
    ChartPaymentMethod,
    ChartRevenueBasedOnMonth,
    salesreport,
    salesreportDownload 
}