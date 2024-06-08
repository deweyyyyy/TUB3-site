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
// Initialize Firebase (reuse the same config)
firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics();
const database = firebase.database();
let itemCount = 0;

firebase.auth().onAuthStateChanged(function(user) {
        
    if (user)//user
    {
  } 
  else // เมื่อผู้ใช้ไม่ได้อยู่ใน สถานะ login
  {
  }
}); 
function initializeUser() {
    const user = firebase.auth().currentUser;
    if (user) {
        const uid = user.uid;
    }
}


// Fetch and display done items
function fetchDoneItems() {
    const doneItemsContainer = document.getElementById('doneItemsList');
    const itemCountDisplay = document.getElementById('itemCount');

    // Clear the existing list
    doneItemsContainer.innerHTML = '';

    // Query Firebase to get items with done: true
    database.ref('/listcheck').orderByChild('done').equalTo(true).on('value', function(snapshot) {
        doneItemsContainer.innerHTML = ''; // Clear the container
        let items = [];
        snapshot.forEach(itemSnapshot => {
            items.push({ key: itemSnapshot.key, value: itemSnapshot.val() }); // Push both key and value
        });

        // Sort the items by lastCheckedTime
        items.sort((a, b) => a.value.lastCheckedTime - b.value.lastCheckedTime);


        let itemCount = 0;
        items.forEach((itemObject, index) => { // Iterate over the item objects
            const item = itemObject.value; // Extract the item value
            const key = itemObject.key; // Extract the item key

            itemCount++;

            // Create item container
            const itemContainer = document.createElement('div');
            itemContainer.classList.add('item');

            // Display the queue number
            const queueNumber = document.createElement('span');
            queueNumber.textContent = itemCount;
            queueNumber.classList.add('queue-number');
            itemContainer.appendChild(queueNumber);

            // Display the item details
            const itemDetails = document.createElement('div');
            itemDetails.classList.add('item-details');
            const formattedDate = new Date(item.lastCheckedTime).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
            itemDetails.innerHTML = `ID: ${item.id}${item.boost === 'yes' ? ' <i class="fa-brands fa-space-awesome" style="color: #00c490;"></i> Boosted by '+item.boostby : ''}${item.boost === 'wait' ? ' <i class="fa-brands fa-space-awesome" style="color: #00c490;"></i> รอตรวจสอบการบูสต์เพลง': ''}<br>เพิ่มโดย: ${item.uname} (${item.umail})${item.umail === 'tanagorn.work@gmail.com' ? ' <i class="fa-brands fa-dev" style="color: #00c490;"></i>' : ''}${item.umail === 'dewey@deweyworld.online' ? ' <i class="fa-brands fa-dev" style="color: #00c490;"></i>' : ''}<br> ชื่อ/ลิงก์: ${item.name}<br> อัปเดตล่าสุด: ${formattedDate}<br>`;

            // Create buttons
            const buttonsContainer = document.createElement('div');
            buttonsContainer.classList.add('buttons');

            const copyButton = document.createElement('button');
            copyButton.innerHTML = '<i class="fa-solid fa-copy"></i>';
            copyButton.classList.add('copy');
            copyButton.addEventListener('click', function() {
                copyToClipboard(item.name);
            });
            buttonsContainer.appendChild(copyButton);

            const openLinkButton = document.createElement('button');
            openLinkButton.innerHTML = '<i class="fa-solid fa-arrow-up-right-from-square"></i> เปิด';
            openLinkButton.classList.add('open');
            openLinkButton.addEventListener('click', function() {
                window.open(item.name);
                Swal.fire({
                    title: 'กำลังเปิดลิงก์',
                    icon: 'success',
                    timer: 1000,
                    showConfirmButton: false,
                    timerProgressBar: true
                });
            });
            buttonsContainer.appendChild(openLinkButton);

            const removeButton = document.createElement('button');
            removeButton.innerHTML = '<i class="fa-solid fa-trash"></i> ลบ';
            removeButton.classList.add('remove');
            removeButton.addEventListener('click', function() {
                removeItem(key); // Use the key directly
            });
            
            const paymentButton = document.createElement('button');
            paymentButton.innerHTML = '<i class="fa-solid fa-rocket"></i> บูสต์ ฿2';
            paymentButton.classList.add('payment-button');
        
            paymentButton.addEventListener('click', function() {
                // Redirect to ./payment.html with item.id as a query parameter
                if (itemCount > 0) {
                    window.location.href = `./payment.html?id=${item.id}`;
                } else {
                    console.error('No items available for payment.');
                }
            });
            if(item.lastCheckedTime=="0") {
                itemContainer.classList.add('boost');
                paymentButton.style.display = 'none';
            }
            const user = firebase.auth().currentUser;
            if (user && item.uid === user.uid) {
                const editButton = document.createElement('button');
                editButton.innerHTML = '<i class="fa-solid fa-edit"></i> แก้ไข';
                editButton.classList.add('edit');
                editButton.addEventListener('click', function() {
                    // Prompt the user for the new YouTube link
                    Swal.fire({
                        title: 'What is your new YouTube link?',
                        input: 'text',
                        inputAttributes: {
                            autocapitalize: 'off'
                        },
                        showCancelButton: true,
                        confirmButtonText: 'Update',
                        showLoaderOnConfirm: true,
                        preConfirm: (newLink) => {
                            // Update the item's name with the new link
                            return database.ref('/listcheck').child(key).update({ name: newLink })
                                .then(() => {
                                    // Optionally, you can provide feedback to the user
                                    Swal.fire({
                                        title: 'Updated!',
                                        text: 'Your YouTube link has been updated.',
                                        icon: 'success'
                                    });
                                })
                                .catch((error) => {
                                    console.error('Error updating YouTube link:', error);
                                    // Optionally, you can provide feedback to the user
                                    Swal.fire({
                                        title: 'Error',
                                        text: 'An error occurred while updating your YouTube link.',
                                        icon: 'error'
                                    });
                                });
                        },
                        allowOutsideClick: () => !Swal.isLoading()
                    });
                });
                buttonsContainer.appendChild(editButton);
            }


            buttonsContainer.appendChild(paymentButton);
            
            buttonsContainer.appendChild(removeButton);
            itemDetails.appendChild(buttonsContainer);
            itemContainer.appendChild(itemDetails);
            doneItemsContainer.appendChild(itemContainer);

            // Display the total number of songs
            itemCountDisplay.textContent = `ขณะนี้มีทั้งสิ้น ${itemCount} เพลง`;
        });
    });
}

function generateRandomAnimation() {
    const animations = [
        'animate__bounce',
        'animate__flash',
        'animate__pulse',
        'animate__rubberBand',
        'animate__shakeX',
        'animate__shakeY',
        'animate__slideInDown',
        'animate__slideInLeft',
        'animate__slideInRight',
        'animate__slideInUp',
        // Add more animation classes from Animate.css as needed
    ];

    const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
    const button = document.querySelector('button');
    
    // Add random animation class to the button
    button.classList.add('animate__animated', randomAnimation);

    // Remove animation class after 3 seconds
    setTimeout(() => {
        button.classList.remove('animate__animated', randomAnimation);
    }, 3000);
}

function generateRandomQueue() {
    if (itemCount > 0) {
        const randomQueue = Math.floor(Math.random() * itemCount) + 1; // Generate a random queue number
        scrollToQueue(randomQueue);
    } else {
        console.error('Item count is not available or is zero.');
    }
}

function generateRandomPopup() {
    const itemCount = document.querySelectorAll('.item').length; // Get the total number of items
    if (itemCount === 0) {
        console.error('No items available.');
        return;
    }

    const randomQueue = Math.floor(Math.random() * itemCount) + 1; // Generate a random queue number
    const popupMessage = `Go to Queue Number: ${randomQueue}`;

    Swal.fire({
        title: popupMessage,
        icon: 'info',
        timer: 1000,
        showConfirmButton: false,
        timerProgressBar: true,
        didOpen: () => {
            scrollToQueue(randomQueue); // Scroll to the randomly generated queue number
        }
    });
}
// Function to scroll to a specific queue number and highlight it
function scrollToQueue(queueNumber) {
    const itemToScrollr = document.querySelector(`.item:nth-child(${queueNumber-1})`);
    const itemToScroll = document.querySelector(`.item:nth-child(${queueNumber})`);
    if (itemToScrollr) {
        // Smooth scroll to the item
        itemToScrollr.scrollIntoView({ behavior: 'smooth' });

        // Highlight the queue number
        itemToScroll.classList.add('highlight');

        // Remove the highlight after 3 seconds
        setTimeout(() => {
            itemToScroll.classList.remove('highlight');
        }, 5000);
    } else {
        console.error('Item not found for queue number:', queueNumber);
    }
}


// Function to remove an item from the database
function removeItem(key) {
    // Reference to the item to be removed
    const itemRef = database.ref('/listcheck').child(key);

    // Remove the item
    itemRef.remove()
        .then(function() {
            console.log("Item removed successfully");
            // Optionally, provide feedback to the user
            Swal.fire({
                title: 'ลบสำเร็จ',
                icon: 'success',
                timer: 1000,
                showConfirmButton: false,
                timerProgressBar: true
            });
        })
        .catch(function(error) {
            console.error("Error removing item: ", error);
            // Optionally, provide feedback to the user
            Swal.fire({
                title: 'ลบไม่สำเร็จ',
                text: 'An error occurred while removing the item.',
                icon: 'error',
                timer: 1000,
                showConfirmButton: false,
                timerProgressBar: true
            });
        });
}

// Add a listener for real-time updates
database.ref('/listcheck').on('child_changed', function(snapshot) {
    const doneItemsContainer = document.getElementById('doneItemsList');
    let itemCount = 0;
    doneItemsContainer.innerHTML = ''; // Clear the container
    console.log('Real-time update:', snapshot.val());
});

// Call the function to fetch and display done items when the page loads
fetchDoneItems();
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    // Optionally, provide some feedback to the user
    Swal.fire({
        title: 'คัดลอก "'+text+'" แล้ว',
        icon: 'success',
        timer: 1000,
        showConfirmButton: false,
        timerProgressBar: true
    })
}