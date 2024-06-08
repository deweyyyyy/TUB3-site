// Initialize Firebase (use the same config as in user.js)
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

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');

    if (orderId) {
        initializeRealtimeUpdates(orderId);
    } else {
        document.getElementById('orderDetails').innerHTML = '<p>Invalid order link.</p>';
    }
});

function initializeRealtimeUpdates(orderId) {
firebase.auth().onAuthStateChanged(function(user) {
        
    if (user)//user
    {
  } 
  else // เมื่อผู้ใช้ไม่ได้อยู่ใน สถานะ login
  {
    window.location.href = "./login.html";
  }
}); 
function initializeUser() {
    const user = firebase.auth().currentUser;
    if (user) {
        const uid = user.uid;
        fetchAndDisplaySongCount(uid); // Fetch and display the song count for the user
    }
}

    try {
        const orderDetailsDiv = document.getElementById('orderDetails');

        database.ref(`/listcheck/${orderId}`).on('value', snapshot => {
            const orderData = snapshot.val();

            if (orderData) {
                document.getElementById('orderId').textContent = orderData.id;
                document.getElementById('orderTotalPrice').textContent = "2";

                const wrapper = document.querySelector(".orderDetails");
                const generateBtn = wrapper.querySelector(".wait");
                const qrImg = wrapper.querySelector(".qr-code img");
                
                let preValue;
                
                generateBtn.addEventListener("click", () => {
                    let qrValue = "2";
                    if (!qrValue || preValue === qrValue) return;
                    preValue = qrValue;
                    generateBtn.innerText = "กำลังสร้างคิวอาร์โค้ด...";
                    qrImg.src = `https://promptpay.io/0953640245/${qrValue}`;
                    qrImg.addEventListener("load", () => {
                        generateBtn.innerText = "สร้างคิวอาร์โค้ด";
                
                        // Create an image input
                        const imageInput = document.createElement("input");
                        imageInput.type = "file";
                        imageInput.accept = "image/*";
                        imageInput.style.display = "none"; // Hide the input
                
                        // Create a label for styling purposes
                        const label = document.createElement("label");
                        label.innerHTML = 'คลิกด้านล่างเพื่ออัปโหลดสลิป';
                        label.htmlFor = "files";
                        label.style.cursor = "pointer";
                
                        // Show the "Upload" button
                        const uploadButton = document.createElement("button");
                        uploadButton.id = "send";
                        uploadButton.innerText = "คลิกที่นี่เพื่ออัปโหลดสลิป";
                        uploadButton.style.cursor = "pointer"; // Set cursor style
                        uploadButton.style.marginRight = "10px"; // Add margin for better spacing
                
                        // Append elements to the orderDetailsDiv
                        orderDetailsDiv.appendChild(imageInput);
                        orderDetailsDiv.appendChild(label);
                        orderDetailsDiv.appendChild(uploadButton);
                
                        // Trigger the file input programmatically when the "Upload" button is clicked
                        uploadButton.addEventListener("click", () => {
                            imageInput.click();
                        });
                
                        imageInput.addEventListener("change", (event) => {
                            const file = event.target.files[0];
                            if (orderData.slipurl) {
                                // Display the slip image
                                const slipImage = document.createElement('img');
                                slipImage.src = orderData.slipurl;
                                slipImage.alt = 'Slip Image';
                                slipImage.style.maxWidth = '200px';
                                slipImage.style.maxHeight = '200px';
            
                                orderDetailsDiv.appendChild(slipImage);
                            }
                            if (file) {
                                const storageRef = firebase.storage().ref();
                                const imageRef = storageRef.child(`slip_images/${orderData.id}/${file.name}`);
                
                                const uploadTask = imageRef.put(file);
                
                                // Show loading message while uploading
                                Swal.fire({
                                    title: 'กำลังอัปโหลด...',
                                    allowOutsideClick: false,
                                    showConfirmButton: false, // Set this to false to remove the OK button
                                    onBeforeOpen: () => {
                                        Swal.showLoading();
                                    },
                                });
                                
                
                                // Listen for state changes, errors, and completion of the upload
                                uploadTask.on(
                                    "state_changed",
                                    (snapshot) => {
                                        // Handle progress (percentage)
                                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                        console.log(`Upload is ${progress}% done`);
                                    },
                                    (error) => {
                                        console.error("Error uploading image:", error);
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'Upload Error',
                                            text: 'There was an error uploading the image. Please try again.',
                                        });
                                    },
                                    () => {
                                        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                                            const user = firebase.auth().currentUser;

                                            if (user) {
                                                const uname = user.uid;
                                                console.log(uname);
                                            } else {
                                                // Handle the case where the user is not authenticated
                                                console.error('User not authenticated');
                                                return;
                                            }
                                            orderData.slipurl = downloadURL;
                                            orderData.payment = "รอการตรวจสอบ";
                                            orderData.boost = "yes";
                                            const orderRef = database.ref(`/listcheck/${orderId}`);
                                            orderRef.update({ 
                                                payment: "รอการตรวจสอบ",
                                                slipurl: downloadURL,
                                                boost: "wait",
                                                lastCheckedTime: "5555",
                                                boostby: user.displayName,
                                                boostemail: user.email,
                                                boostuid: user.uid
                                            });                                            
                
                                            // Close loading message
                                            Swal.close();
                
                                            // Show success message
                                            Swal.fire({
                                                icon: 'success',
                                                title: 'อัปโหลดสำเร็จ',
                                                text: 'สลิปได้รับการอัปโหลดเรียบร้อยแล้ว!',
                                            }).then(() => {
                                                // Redirect to ./track.html
                                                window.location.href = './list.html?boost='+orderId;
                                            });
                                        });
                                    }
                                );
                            }
                        });
                    });
                });
                
                     
            } else {
                orderDetailsDiv.innerHTML = '<p>Invalid order ID.</p>';
                throw new Error('Invalid order ID');
            }
        });
    } catch (error) {
        console.error(error);
        // Handle the error, e.g., display an error message
    }
}
