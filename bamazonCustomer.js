var mysql = require("mysql");
var inquirer = require("inquirer");
var isNumber = require('is-number');
var Table = require('cli-table');
var arraySum = require('array-sum');

var currentTotal = [];

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  user: "root",

  password: "rootpassword",
  database: "bamazon_DB"
});

connection.connect(function(err) {
  if (err) throw err;
  afterConnection();
});

function afterConnection() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log("")
    console.log("***~***~***~***~***~***")
	console.log("Welcome to Bamazon!")
	console.log("***~***~***~***~***~***")
	console.log("")

	console.log("Here are all the items we have on sale:")
	console.log("")

	var table = new Table({
    head: ['ITEM ID', 'NAME', 'PRICE'],
 	style: {
 		compact: false,
 		"text-align": "center"
 	}
	});
     for (var i = 0; i < res.length; i++) {
	    table.push([res[i].item_id, res[i].product_name, `$${res[i].price}`]);    
	    }
	console.log(table.toString());
    runBamazon();
  });
}

function runBamazon () {
  inquirer
    .prompt([
    {
      name: "promptid",
      type: "input",
      message: "What is the item ID of the item you'd like to buy?",
    },
    {
      name: "quantity",
      type: "input",
      message: "And how many would you like to purchase?",
      validate: function (value) {
      	var pass = isNumber(value) === true;
	      	if (pass === true) {
	      		return true;
	      	}
	      	else {
	      		return "Please enter a valid number."
	      	}
    	}
	    }]).then(function(res) {
	    	
	    	var productPurchased = {
	    		Item_ID: res.promptid,
	    		Quantity: res.quantity
	    	}
	    	
	    	connection.query("SELECT * FROM products WHERE item_id = ?", [productPurchased.Item_ID], function(err, res) {

		    		if (productPurchased.Quantity > res[0].stock_quantity) {
		    			console.log(`Sorry, we are low on stock for ${res[0].product_name}. Here is the amount we currently have: ${res[0].stock_quantity}`)
		    			runBamazon();
	    			} else if (productPurchased.Quantity <= res[0].stock_quantity) {
	    				connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [res[0].stock_quantity - productPurchased.Quantity, productPurchased.Item_ID], function (err, answer) {
	    				var subtotal = productPurchased.Quantity * res[0].price;
	    				currentTotal.push(subtotal);
	    				console.log("Your purchase has been added to your cart.")
	    				continueShopping();
	    				

	    			})
	    		}

		})
	})
}

//CONTINUE SHOPPING FUNCTION
function continueShopping () {
	inquirer
    .prompt([
    {
      name: "continueshopping",
      type: "confirm",
      message: "Would you like to continue shopping?",
    }]).then(function(res) {
    	if (res.continueshopping) {
    		runBamazon();
    	} else {
    		endOfSale();
    	}
    })
}

// END OF SALE FUNCTION
function endOfSale() {
 var finalSale = arraySum(currentTotal);
 console.log(`
 Your total is: $${finalSale} 
 Thank you for shopping with Bamazon!
 `)
connection.end()
}
