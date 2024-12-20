const mysql = require('mysql2');
//Create a connection to the database 
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '@Mangopet190!',
    database: 'mydb'
});

//Connect to the database 

connection.connect((err) => {
    if (err) throw err;
    console.log("Successfully connected to MySQL!");
})

var services = function(app){
    app.post('/write-record', function(req, res){
       
        var data = {
            name: req.body.name,
            proDesc: req.body.proDesc,
            price: req.body.price,
            quantity: req.body.quantity

        };
        console.log(JSON.stringify(data));
        connection.query("INSERT INTO products SET ?", data, function(err){
            if(err){
                return res.status (201).send(JSON.stringify({msg: "Error" + err}));
            } else{
                return res.status (200).send(JSON.stringify({msg: "SUCCESS"}));

            }

        });
    });

    app.post('/write-account', function(req, res){
       
        var data = {
            email_address: req.body.email_address,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            password: req.body.password

        };
        console.log(JSON.stringify(data));
        connection.query("INSERT INTO accounts SET ?", data, function(err){
            if(err){
                return res.status (201).send(JSON.stringify({msg: "Error" + err}));
            } else{
                return res.status (200).send(JSON.stringify({msg: "SUCCESS"}));

            }

        });
    });

    app.get('/get-account', function(req, res) {
        // var data = {
           var  email_address = req.query.email_address;
           var  password = req.query.password;

           console.log(email_address);
           console.log(password);
        // }
        // console.log(JSON.stringify(data));
        // const { email_address, password} = req.body;

        // if(email_address === 'email_address' && password === 'password' ){
        //     res.json({success: true});
        // } else{
        //     res.json({success: false, message: 'Incorrect username or password'});
        // }
        connection.query("SELECT idAccounts, type FROM accounts WHERE email_address = ? AND password = ?", [email_address, password], function(err, rows) {
            if(err) {
                return res.status(201).send(JSON.stringify({msg:"Error: " + err}));
            } else {
              console.log("Look up account");
              // connection.end();
              return res.status(201).send(JSON.stringify({msg:"SUCCESS", accounts:rows}));
            }
        });    
  });

    app.get('/get-product', function(req, res){
        var  productName = req.query.productName;

        connection.query("SELECT * FROM products WHERE name = ?", [productName], function(err,rows){
            if(err){
                return res.status(201).send(JSON.stringify({msg:"Error: " + err}));
            }else{
                console.log("Displayed product")
                return res.status(201).send(JSON.stringify({msg:"SUCCESS", products:rows}));

            }
        })
    });

    app.get('/get-orderId', function(req, res){
        var  userId = req.query.userId;

        connection.query("SELECT idOrders FROM orders WHERE Accounts_idAccounts = ? AND orderStatus = 0 ", [userId], function(err,rows){
            if(err){
                return res.status(201).send(JSON.stringify({msg:"Error: " + err}));
            }else{
                console.log("Got cart")
                return res.status(201).send(JSON.stringify({msg:"SUCCESS", orders:rows}));

            }
        })
    });


    app.post('/createCart', function(req, res){
        var  userId = req.body.userId;
        console.log(userId);
        connection.query("INSERT INTO orders (Accounts_idAccounts) VALUES (?)", [userId], function(err,result){
            if(err){
                return res.status(201).send(JSON.stringify({msg:"Error: " + err}));
            }else{
                console.log("Displayed product")
                return res.status(201).send(JSON.stringify({msg:"SUCCESS", orderId:result.insertId}));

            }
        })
    });

    app.post('/addToCart', function(req, res){

          var item_price = req.body.item_price;
          var Products_idProducts = req.body.productId;
          var Orders_idOrders= req.body.orderId;
          var quantity = 1;
        


        console.log(req.body.orderId);
        connection.query("INSERT INTO order_items(item_price, Products_idProducts, Orders_idOrders, quantity) VALUES (?,?,?,?)", [item_price, Products_idProducts, Orders_idOrders, quantity ], function(err, result){
            if(err){
                return res.status(201).send(JSON.stringify({msg:"Error: " + err}));
            }else{
                console.log("Added to cart");
                return res.status(201).send(JSON.stringify({msg:"SUCCESS"}));

            }
        })
    });

    app.get('/get-cart', function(req, res){
        var  orderId = req.query.orderId;

        connection.query("SELECT item_price, oi.quantity, idOrder_items, name FROM order_items oi JOIN products p ON p.idProducts = oi.Products_idProducts WHERE Orders_idOrders = ?", [orderId], function(err,rows){
            if(err){
                return res.status(201).send(JSON.stringify({msg:"Error: " + err}));
            }else{
                console.log("Got cart " + JSON.stringify(rows));
                return res.status(201).send(JSON.stringify({msg:"SUCCESS", orders:rows}));

            }
        })
    });

    app.put('/update-cart', function(req, res){
        var idOrder_items = req.body.idOrder_items;
        var quantity = req.body.quantity;

        connection.query("UPDATE order_items SET quantity = ? WHERE idOrder_items = ?", [quantity, idOrder_items], function(err,rows){
            if(err){
                return res.status(201).send(JSON.stringify({msg:"Error: " + err}));
            }else{
                console.log("Updated cart " + JSON.stringify(rows));
                return res.status(201).send(JSON.stringify({msg:"SUCCESS"}));

            }
        })
    });

    app.put('/purchase', function(req, res){
        var orderId = req.body.orderId;

        connection.query("UPDATE orders SET orderStatus = 1 WHERE idOrders = ?;", [orderId], function(err,rows){
            if(err){
                return res.status(201).send(JSON.stringify({msg:"Error: " + err}));
            }else{
                console.log("Purchase complete! " + JSON.stringify(rows));
                return res.status(201).send(JSON.stringify({msg:"SUCCESS"}));

            }
        })
    });



};


module.exports = services;


//Insert record to account table
// const account = {first_name: 'Stephanie', last_name: 'Gonzalez', email_address:'sgonzalezmoral1@my.brookdalecc.edu', password: 'password'};
// connection.query('INSERT INTO accounts SET ?', account, (err, result) => {
//     if(err) throw err;
//     console.log("Account insert successful!");
// })