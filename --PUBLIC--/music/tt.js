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

// youtubeUtils.js
async function getYouTubeTitle(videoId) {
    const apiUrl = `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.title;
    } catch (error) {
        console.error('Error fetching video title:', error);
        return `YouTu.be/${videoId}`; // Fallback title
    }
}

async function embedYouTubeLinkInText(text) {
   // const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S*\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[?&][^ ]*)?/g;
    //let match;
    let updatedText = text;

    //while ((match = youtubeRegex.exec(text)) !== null) {
      //  const videoId = match[1];
        //const videoTitle = await getYouTubeTitle(videoId);
        //const youtubeLinkElement = `
          //  <a class="youtube-link" href="https://www.youtube.com/watch?v=${videoId}" target="_blank" rel="noopener noreferrer">
            //    <i class="fab fa-youtube youtube-icon"></i>
              //  <span class="youtube-title">${videoTitle}</span>
            //</a>
        //`;
     //   updatedText = updatedText.replace(match[0], youtubeLinkElement);
 //   }

    return updatedText;
}

async function applyYouTubeEmbed(text) {
    const messageDiv = document.createElement('div');
    messageDiv.innerHTML = await embedYouTubeLinkInText(text);
    document.getElementById('messages-container').appendChild(messageDiv);
}

function fetchDoneItems() {
    const doneItemsContainer = document.getElementById('doneItemsList');
    const itemCountDisplay = document.getElementById('itemCount');

    // Clear the existing list initially
    doneItemsContainer.innerHTML = '';

    // Listen for changes in Firebase to get items with done: true
    database.ref('/listcheck/').orderByChild('done').on('value', (snapshot) => {
        doneItemsContainer.innerHTML = ''; // Clear the container
        let items = [];

        snapshot.forEach(itemSnapshot => {
            items.push({ key: itemSnapshot.key, value: itemSnapshot.val() }); // Push both key and value
        });

        console.log(items);
        // Sort the items by lastCheckedTime first
        items.sort((a, b) => a.value.lastCheckedTime - b.value.lastCheckedTime);

        // After sorting by lastCheckedTime, you can then sort by itemCount if needed.
        items.sort((a, b) => a.value.itemCount - b.value.itemCount);  // Optional: if itemCount needs to be considered

        let itemCount = 0; // Initialize itemCount here
        const itemPromises = items.map(itemObject => {
            const item = itemObject.value; // Extract the item value
            const key = itemObject.key; // Extract the item key
            
            // Increment the itemCount here to ensure correct numbering
            itemCount++;


            // Create item container
            const itemContainer = document.createElement('div');
            itemContainer.classList.add('item');

            // Display the queue number
            const queueNumber = document.createElement('span');
            queueNumber.textContent = itemCount;
            queueNumber.classList.add('queue-number');
            itemContainer.appendChild(queueNumber);

            // Fetch YouTube video name text
            return embedYouTubeLinkInText(item.name).then(youtubeText => {
                // Display the item details
                const itemDetails = document.createElement('div');
                itemDetails.classList.add('item-details');
                const formattedDate = new Date(item.lastCheckedTime).toLocaleString('en-GB', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    second: '2-digit' 
                });

                itemDetails.innerHTML = `<strong>ID:</strong> ${item.id}${item.boost === 'yes' ? ' <i class="fa-brands fa-space-awesome" style="color: #00c490;"></i> Boosted by '+item.boostby : ''}${item.boost === 'wait' ? ' <i class="fa-brands fa-space-awesome" style="color: #00c490;"></i> รอตรวจสอบการบูสต์เพลง': ''}<br>
                <strong>เพิ่มโดย:</strong> ${item.uname} (${item.umail})${item.umail === 'tanagorn.work@gmail.com' ? ' <i class="fa-brands fa-dev" style="color: #00c490;"></i>' : ''}${item.umail === 'dewey@deweysworld.app' ? ' <i class="fa-brands fa-dev" style="color: #00c490;"></i>' : ''}<br>
                <strong>ชื่อ/ลิงก์:</strong> ${youtubeText}<br>
                <strong>อัปเดตล่าสุด:</strong> ${formattedDate}<br>`;

                // Create buttons (Copy, Watch, Open Link, Remove, Payment, Edit)
                const buttonsContainer = document.createElement('div');
                buttonsContainer.classList.add('buttons');

                const copyButton = document.createElement('button');
                copyButton.innerHTML = '<i class="fa-solid fa-copy"></i>';
                copyButton.classList.add('copy');
                copyButton.addEventListener('click', function() {
                    copyToClipboard(item.name);
                });
                buttonsContainer.appendChild(copyButton);

                const watchButton = document.createElement('button');
                watchButton.innerHTML = '<i class="fa-solid fa-eye"></i>';
                watchButton.classList.add('watch');
                watchButton.addEventListener('click', function() {
                    const youtubeLink = item.name;

                    // Extract the video ID from the YouTube link
                    const videoIdMatch = youtubeLink.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)|youtu\.be\/([^&]+)/);
                    const videoId = videoIdMatch ? (videoIdMatch[1] || videoIdMatch[2]) : null;

                    if (videoId) {
                        Swal.fire({
                            title: 'YouTube Video Player',
                            html: `<iframe width="100%" height="333" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`,
                            showCloseButton: true,
                            showConfirmButton: false,
                            width: 900,
                            height:1600,
                            padding: '5px',
                        });
                    } else {
                        Swal.fire({
                            title: 'Invalid Link',
                            text: 'The link provided is not a valid YouTube link.',
                            icon: 'error'
                        });
                    }
                });
                buttonsContainer.appendChild(watchButton);

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

                if(item.lastCheckedTime === "0") {
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
                            title: 'ลิงก์วิดีโอ YouTube ที่ต้องการเปลี่ยนเป็นคือ?',
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
                                            title: 'อัปเดตแย้วงับ!',
                                            text: 'Your YouTube link has been updated.',
                                            icon: 'success'
                                        });
                                        fetchDoneItems()
                                    })
                                    .catch((error) => {
                                        console.error('Error updating YouTube link:', error);
                                        // Optionally, you can provide feedback to the user
                                        Swal.fire({
                                            title: 'Error',
                                            text: 'An error occurred while updating your YouTube link.',
                                            icon: 'error'
                                        });
                                        fetchDoneItems()
                                    });
                            },
                            allowOutsideClick: () => !Swal.isLoading()
                        });
                    });
                    buttonsContainer.appendChild(editButton);
                }

                if(item.lastCheckedTime === 0) {
                    itemContainer.classList.add('boost');
                    paymentButton.style.display = 'none';
                }

                buttonsContainer.appendChild(paymentButton);
                buttonsContainer.appendChild(removeButton);
                itemDetails.appendChild(buttonsContainer);
                itemContainer.appendChild(itemDetails);
                doneItemsContainer.appendChild(itemContainer);
            });
        });

        // Ensure all items are processed
        Promise.all(itemPromises).then(() => {
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
    // Select the item based on the queue number directly
    const itemToScroll = document.querySelector(`.item:nth-child(${queueNumber})`);

    if (itemToScroll) {
        // Smooth scroll to the item
        itemToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Highlight the item
        itemToScroll.classList.add('highlight');

        // Remove the highlight after 3 seconds
        setTimeout(() => {
            itemToScroll.classList.remove('highlight');
        }, 5000);
    } else {
        console.error('Item not found for queue number:', queueNumber);
    }
}


function removeItem(key) {
    // Ask for confirmation before removing the item
    Swal.fire({
        title: 'คุณแน่ใจหรือไม่ที่จะลบมัน?',
        text: "การกระทำนี้ไม่สามารถย้อนกลับหรือกู้คืนได้",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ใช่, ลบเลย!',
        cancelButtonText: 'ยกเลิก, ไม่ลบ! (แนะนำ)'
    }).then((result) => {
        if (result.isConfirmed) {
            // Reference to the item to be removed
            const itemRef = database.ref('/listcheck').child(key);

            // Remove the item
            itemRef.remove()
                .then(function() {
                    console.log("Item removed successfully");
                    // Provide feedback to the user
                    Swal.fire({
                        title: 'ลบสำเร็จ',
                        text: 'ลบรายการอย่างถาวรสำเร็จ!',
                        icon: 'success',
                        timer: 1000,
                        showConfirmButton: false,
                        timerProgressBar: true
                    });
                    fetchDoneItems()
                })
                .catch(function(error) {
                    console.error("Error removing item: ", error);
                    // Provide feedback to the user
                    Swal.fire({
                        title: 'ลบไม่สำเร็จ',
                        text: 'เกิดข้อผิดพลาดในการลบรายการ',
                        icon: 'error',
                        timer: 1000,
                        showConfirmButton: false,
                        timerProgressBar: true
                    });
                    fetchDoneItems()
                });
        }
    });
}


// Add a listener for real-time updates
database.ref('/listcheck').on('child_changed', function(snapshot) {
    const doneItemsContainer = document.getElementById('doneItemsList');
    doneItemsContainer.innerHTML = ''; // Clear the container
    console.log('Real-time update:', snapshot.val());
    fetchDoneItems();
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