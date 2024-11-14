// Initialize Firebase (use the same config as in the user web page)
const firebaseConfig = {
  apiKey: "AIzaSyBhd3_KEAOyJnbIp-vNd5YoVUiyOiaZuoQ",
  authDomain: "beta-deweysworld.firebaseapp.com",
  databaseURL: "https://beta-deweysworld-default-rtdb.firebaseio.com",
  projectId: "beta-deweysworld",
  storageBucket: "beta-deweysworld.appspot.com",
  messagingSenderId: "851425328095",
  appId: "1:851425328095:web:d3ccd702d04abe9f7fe26a",
  measurementId: "G-V3Q2GSB2RW"
  };
  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();
  var timestampa =new Date().getTime();
  var currentURL = window.location.href;
function initializeUser() {
    const user = firebase.auth().currentUser;
    if (user) {
        const uid = user.uid;
    }
}

  console.log(timestampa);
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      const uid = user.uid;
      if (uid !== "RoK83IuiSzMk5S77rUNjfrbWy9Q2") { // Check user UID
        console.log(user);
        $("#body").find(".btn_sign_out").css("display", "");
        $("#body").find(".adminfun").css("display", "");
        $("#body").find(".orderlistad").css("display", "");
        $("#body").find(".menulistad").css("display", "");
      } else {
        $("#body").find(".btn_sign_out").css("display", "none");
        $("#body").find(".adminfun").css("display", "none");
        $("#body").find(".orderlistad").css("display", "none");
        $("#body").find(".menulistad").css("display", "none");
        window.location.href = "../../account.html";
      }
    } else {
      window.location.href = "../../account.html";
    }
  });  
  firebase.app().database(); // Wait until Firebase is initialized
  $("#body").find(".btn_sign_out").on("click",function(){
    //คำสั่ง ออกจการะบบ ของ firebase
    firebase.auth().signOut().then(function() {
        
    });

});
function addMenuon() {
  $("#body").find(".menuza").css("display","");
  $("#body").find(".addMenuoff").css("display","");
  $("#body").find(".addMenuon").css("display","none");
}
function addMenuoff() {
  $("#body").find(".menuza").css("display","none");
  $("#body").find(".addMenuoff").css("display","none");
  $("#body").find(".addMenuon").css("display","");
}
  function addMenuItem() {
    const itemName = document.getElementById('itemName').value;
    const itemPrice = parseFloat(document.getElementById('itemPrice').value);
    const itemOptions = document.getElementById('itemOptions').value.split(',').map(option => option.trim());
    const itemImage = document.getElementById('itemImage').value; // Added line for image
  
    // Extract custom option prices
    const customOptionPricesInput = document.getElementById('customOptionPrices');
    const customOptionPrices = customOptionPricesInput.value.split(',').map(price => parseFloat(price.trim()));
  
    // Assuming you have a menu structure in Firebase under /shop/menu
    const menuRef = database.ref('/shop/menu');
    const menuItemRef = menuRef.child(itemName);
  
    // Construct the menu item object
    const menuItem = {
      name: itemName,
      price: itemPrice,
      options: itemOptions,
      image: itemImage // Added line for image
    };
  
    // Include custom option prices if provided
    if (customOptionPrices.length === itemOptions.length) {
      menuItem.optionPrices = {};
      itemOptions.forEach((option, index) => {
        menuItem.optionPrices[option] = customOptionPrices[index];
      });
    }
  
    // Save the menu item to Firebase
    menuItemRef.set(menuItem)
    .then(() => {
      // Display success message
      Swal.fire({
        icon: 'success',
        title: 'Menu Item Added',
        text: 'The menu item has been added successfully.',
      });
    })
    .catch((error) => {
      // Display error message
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Failed to add menu item. ${error.message}`,
      });
    });
  
    // Clear input fields after adding the menu item
    document.getElementById('itemName').value = '';
    document.getElementById('itemPrice').value = '';
    document.getElementById('itemOptions').value = '';
    customOptionPricesInput.value = '';
    document.getElementById('itemImage').value = ''; // Added line for image
  }

  function displayOrdersForAdmin(orders) {
    const orderList = document.getElementById('orderList');
    orderList.innerHTML = ''; // Clear previous orders to avoid duplication

    // Convert orders object to an array for sorting
    const ordersArray = Object.entries(orders);

    // Sort orders based on the selected option
    const sortOption = document.getElementById('sortOption').value;
    ordersArray.sort((a, b) => {
        if (sortOption === 'timestamp') {
            return a[1].timestamp - b[1].timestamp;
        } else if (sortOption === 'status') {
            return a[1].status.localeCompare(b[1].status);
        }
        return 0;
    });

    // Display sorted orders
    for (const [orderId, order] of ordersArray) {
        if (order.boost !== 'wait') { // Check if order.items is defined
            const listItem = document.createElement('li');
            const currentTime = new Date().getTime();
            listItem.innerHTML =`
            <strong>Order ID:</strong> ${orderId}<br>
            <strong>Link:</strong> ${order.name ? order.name : 'N/A'}
            <br>
            <strong>Name:</strong> ${order.uname ? order.uname : 'N/A'}                
            <br>
            <strong>Timestamp:</strong> ${new Date(order.id).toLocaleString()} <!-- Display timestamp -->
            <br>
            ${order.slipurl ? `<img src="${order.slipurl}" alt="Slip Image" style="max-width: 200px; max-height: 200px;">` : ''}<br><br>
            <button onclick="updateOrderPayment('${orderId}', '${currentTime}')">Unpaid</button>
            <button onclick="updateOrderPayment('${orderId}', 0)">Paid</button>
            <button onclick="updateOrderStatus('${orderId}', 'yes')">Checked</button>
            <hr>
            `;

            orderList.appendChild(listItem);
        }
    }
}

// Function to remove an order by updating the status to 'Cancel'
function removeOrder(orderId) {
    const orderRef = database.ref('/listcheck').child(orderId);
    orderRef.update({
            status: 'Cancel'
        })
        .then(() => {
            Swal.fire({
                icon: 'success',
                title: 'Order Removed',
                text: 'The order has been canceled successfully.',
            });
        })
        .catch((error) => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Failed to cancel the order. ${error.message}`,
            });
        });
}

// Function to sort and display orders
function sortAndDisplayOrders() {
    const ordersRef = database.ref('/listcheck');

    ordersRef.once('value', (snapshot) => {
        const orders = snapshot.val();
        displayOrdersForAdmin(orders);
    });
}


// Fetch and display orders when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Assuming you have a reference to the 'orders' path in Firebase
    const ordersRef = database.ref('/listcheck');

    ordersRef.on('value', (snapshot) => {
        const orders = snapshot.val();
        displayOrdersForAdmin(orders);
    });
});
  
  // Function to update the status of an order
  function updateOrderStatus(orderId, newStatus) {
    const orderRef = database.ref('/listcheck').child(orderId);
    const statusChangeTimestamp = new Date().getTime();
    console.log(statusChangeTimestamp);
    orderRef.update({ 
      boost: newStatus,
      lastCheckedTime: "0"});
  
    // Display success message
    Swal.fire({
      icon: 'success',
      title: 'Order Status Updated',
      text: `Order status set to ${newStatus}.`,
    });
  }
  // Function to update the status of an order
  function updateOrderPayment(orderId, newPayStatus) {
    const orderRef = database.ref('/listcheck').child(orderId);
    orderRef.update({ lastCheckedTime: newPayStatus });
  
    // Display success message
    Swal.fire({
      icon: 'success',
      title: 'Order Payment Status Updated',
      text: `Order payment status set to ${newPayStatus}.`,
    });
  }