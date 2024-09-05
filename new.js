const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


// Your other middleware and routes go here

const app = express();
app.use(express.static('client'));
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
async function connectToDatabase() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/myDB', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error(error);
    }
}

connectToDatabase();

// Define item schema
const ItemSchema = new mongoose.Schema({
    numItems: Number,
    itemName: String,
    singleItemPrice: Number,
    totalAmount: Number,
    email: String,
    paymentMethod: String,
    address: String
});

const Item = mongoose.model('Item', ItemSchema);

app.post('/saveItem', async (req, res) => {
    try {
        const newItem = new Item({
            numItems: req.body.numItems,
            itemName: req.body.itemName,
            singleItemPrice: req.body.singleItemPrice,
            totalAmount: req.body.totalAmount,
            email: req.body.email,
            paymentMethod: req.body.paymentMethod,
            address: req.body.address
        });

        await newItem.save();
        res.send('Order placed Succefully! Thanks for Working with Us.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error in Order Placing.');
    }

});
// Assuming you've already set up your Express app and connected to MongoDB

// ... Your previous code ...

// Define a route to serve the delete form
app.get('/deleteItemForm', (req, res) => {
    res.sendFile(__dirname + '/deleteForm.html');
});

// Define a route to handle the deletion
app.post('/deleteItem', async (req, res) => {
    try {
        const email = req.body.email;
        const itemName = req.body.itemName;

        // Use Mongoose's findOneAndRemove to delete the item
        const deletedItem = await Item.findOneAndRemove({ email, itemName });

        if (deletedItem) {
            res.send('Your Order was canceled successfully! Contact our helpline if there is any Issue was found.');
        } else {
            res.status(404).send('Item not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting order');
    }
});
// Your other middleware and routes go here




app.post('/updateItem', async (req, res) => {
    const email = req.body.email;

    const isValidEmail = validateEmail(email);

    if (!isValidEmail) {
        return res.status(400).send('Invalid email address');
    }

    try {
        const updatedItem = await Item.findOneAndUpdate(
            { email: email, itemName: req.body.itemName },
            {
                paymentMethod: req.body.paymentMethod,
                address: req.body.address
            },
            { new: true }
        );

        if (updatedItem) {
            return res.send('Your Order was UPdated! Contact our helpline if you find any Issues.');
        } else {
            return res.status(404).send('Item not found');
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error updating in Order.');
    }
});

function validateEmail(email) {
    // Regular expression for a basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


// ... (previous code)

// Define a route to get purchases by email
app.get('/viewPurchases/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const purchases = await Item.find({ email: email });
        res.json(purchases);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching purchases');
    }
});


// Add this route to app.js

app.get('/adminLogin/:username/:password', (req, res) => {
    const { username, password } = req.params;

    // Replace 'your_username' and 'your_password' with actual credentials
    if (username === 'Vivek' && password === 'Vivek3579') {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// Update your code in app.js for fetching all orders:

app.get('/viewAllOrders', (req, res) => {
    Item.find()
        .then(orders => {
            res.json(orders);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error fetching orders');
        });
});



app.listen(3579, () => {
    console.log('Server is listening on port 3579');
});
