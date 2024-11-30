<?php

// Include the database configuration
@include 'config.php';

// Check if the order button was clicked
if (isset($_POST['order_btn'])) {
    // Capture form data
    $name = $_POST['name'];
    $number = $_POST['number'];
    $email = $_POST['email'];
    $method = $_POST['method'];
    $flat = $_POST['flat'];
    $street = $_POST['street'];
    $city = $_POST['city'];
    $state = $_POST['state'];
    $country = $_POST['country'];
    $pin_code = $_POST['pin_code'];

    // Initialize variables to store total price and product details
    $price_total = 0;
    $product_details = [];
    
    // Query to fetch items from cart
    $cart_query = mysqli_query($conn, "SELECT * FROM `cart`");
    
    if (mysqli_num_rows($cart_query) > 0) {
        // Calculate total price and prepare product details
        while ($product_item = mysqli_fetch_assoc($cart_query)) {
            $product_name = $product_item['name'] . ' (' . $product_item['quantity'] . ')';
            $product_price = $product_item['price'] * $product_item['quantity'];
            $price_total += $product_price;
            $product_details[] = $product_name;
        }
    }

    // Convert product details array to a single string
    $product_details_string = implode(', ', $product_details);

    // Query to insert order details into the `order` table, including product details
    $detail_query = mysqli_query($conn, "INSERT INTO `order` (name, number, email, method, flat, street, city, state, country, pin_code, total_price, product_details) 
        VALUES ('$name', '$number', '$email', '$method', '$flat', '$street', '$city', '$state', '$country', '$pin_code', '$price_total', '$product_details_string')") or die('Query failed');

    // Check if the query was successful
    if ($detail_query) {
        // Output order confirmation message
        echo "
        <div class='order-message-container'>
            <div class='message-container'>
                <h3>Thank you for shopping!</h3>
                <div class='order-detail'>
                    <span>$product_details_string</span>
                    <span class='total'> Total: \${$price_total}/- </span>
                </div>
                <div class='customer-details'>
                    <p>Your name: <span>$name</span></p>
                    <p>Your number: <span>$number</span></p>
                    <p>Your email: <span>$email</span></p>
                    <p>Your address: <span>$flat, $street, $city, $state, $country - $pin_code</span></p>
                    <p>Your payment mode: <span>$method</span></p>
                    <p>(*Pay when product arrives*)</p>
                </div>
                <a href='products.php' class='btn'>Continue Shopping</a>
            </div>
        </div>";
    } else {
        // Handle query failure
        echo "An error occurred while processing your order. Please try again later.";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8">
   <meta http-equiv="X-UA-Compatible" content="IE=edge">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Checkout</title>

   <!-- Font Awesome CDN link -->
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

   <!-- Custom CSS file link -->
   <link rel="stylesheet" href="css/style.css">

</head>
<body>

<?php include 'header.php'; ?>

<div class="container">

<section class="checkout-form">

   <h1 class="heading">Complete Your Order</h1>

   <form action="" method="post">

      <!-- Display order details -->
      <div class="display-order">
         <?php
            // Fetch items from cart
            $select_cart = mysqli_query($conn, "SELECT * FROM `cart`");
            $total = 0;
            $grand_total = 0;
            
            if (mysqli_num_rows($select_cart) > 0) {
                while ($fetch_cart = mysqli_fetch_assoc($select_cart)) {
                    $total_price = number_format($fetch_cart['price'] * $fetch_cart['quantity']);
                    $grand_total = $total += $total_price;
                    echo "<span>{$fetch_cart['name']} ({$fetch_cart['quantity']})</span>";
                }
            } else {
                echo "<div class='display-order'><span>Your cart is empty!</span></div>";
            }
         ?>
         <span class="grand-total">Grand Total: $<?= $grand_total; ?>/-</span>
      </div>

      <!-- Input form fields -->
      <div class="flex">
         <div class="inputBox">
            <span>Your Name</span>
            <input type="text" placeholder="Enter your name" name="name" required>
         </div>
         <div class="inputBox">
            <span>Your Number</span>
            <input type="number" placeholder="Enter your number" name="number" required>
         </div>
         <div class="inputBox">
            <span>Your Email</span>
            <input type="email" placeholder="Enter your email" name="email" required>
         </div>
         <div class="inputBox">
            <span>Payment Method</span>
            <select name="method" required>
               <option value="cash on delivery" selected>Cash on Delivery</option>
               <option value="credit card">Credit Card</option>
               <option value="paypal">PayPal</option>
            </select>
         </div>
         <div class="inputBox">
            <span>Address Line 1</span>
            <input type="text" placeholder="e.g. flat no." name="flat" required>
         </div>
         <div class="inputBox">
            <span>Address Line 2</span>
            <input type="text" placeholder="e.g. street name" name="street" required>
         </div>
         <div class="inputBox">
            <span>City</span>
            <input type="text" placeholder="e.g. Mumbai" name="city" required>
         </div>
         <div class="inputBox">
            <span>State</span>
            <input type="text" placeholder="e.g. Maharashtra" name="state" required>
         </div>
         <div class="inputBox">
            <span>Country</span>
            <input type="text" placeholder="e.g. India" name="country" required>
         </div>
         <div class="inputBox">
            <span>Pin Code</span>
            <input type="text" placeholder="e.g. 123456" name="pin_code" required>
         </div>
      </div>
      <input type="submit" value="Order Now" name="order_btn" class="btn">
   </form>

</section>

</div>

<!-- Custom JS file link -->
<script src="js/script.js"></script>

</body>
</html>
