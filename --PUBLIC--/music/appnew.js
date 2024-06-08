// Initialize Firebase
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

// Function to fetch and display the song count for the logged-in user
function fetchAndDisplaySongCount(uid) {
    const userRef = database.ref(`/listcheck`);
    userRef.orderByChild("uid").equalTo(uid).on('value', function(snapshot) {
        const songCount = snapshot.numChildren(); // Count the number of items
        document.getElementById('songCount').innerText = `คุณเพิ่มเพลงไป ${songCount} เพลง`;
        
        // Get the form element
        const form = document.getElementById('checklistForm');
        const limit = document.getElementById('limitalert');

        // Check if the song count is greater than 5
        if (songCount >= 5) {
            form.style.display = 'none'; // Hide the form
            limit.style.display = 'block'; // Hide the form
        } else {
            form.style.display = 'block'; // Show the form
            limit.style.display = 'none'; // Hide the form
        }
    });
}


// Call this function after the user has been authenticated
function initializeUser() {
    const user = firebase.auth().currentUser;
    if (user) {
        const uid = user.uid;
        fetchAndDisplaySongCount(uid); // Fetch and display the song count for the user
    }
}

firebase.auth().onAuthStateChanged(initializeUser);
const analytics = firebase.analytics();
const database = firebase.database();
const checklistForm = document.getElementById('checklistForm');
const checklist = document.getElementById('checklist');

function addItem() {
    const name = document.getElementById('name').value;
    const user = firebase.auth().currentUser;

// Check if the user is authenticated
if (user) {
    const uname = user.uid;
    console.log(uname);
} else {
    // Handle the case where the user is not authenticated
    console.error('User not authenticated');
    return;
}

    const umail = user.email;
    const uname = user.displayName;
    const uid = user.uid;
    // Generate a unique ID for the checklist item
    const id = generateUniqueId();
    const currentTime = new Date().getTime();
    // Save data to Firebase under the specific ID
    database.ref(`/listcheck/${id}`).set({
        id,
        name,
        uid,
        uname,
        umail,
        lastCheckedTime: currentTime
    });

    // Clear form
    checklistForm.reset();
    Swal.fire({
        title: 'เพิ่มสำเร็จ',
        icon: 'success',
        timer: 1000,
        showConfirmButton: false,
        timerProgressBar: true
    })
    // Fetch and display checklist
    fetchChecklist();
}

function generateUniqueId() {
    // Function to generate a unique ID (you can customize this as needed)
    return new Date().getTime();
}

function fetchChecklist() {
    database.ref('/listcheck').once('value').then(snapshot => {
        checklist.innerHTML = '';
        snapshot.forEach(item => {
            const data = item.val();
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${data.name} - ${data.detail} (${data.id})</span>
            `;
            checklist.appendChild(listItem);
        });
    });
}

function markDone(key) {
    database.ref(`/listcheck/${key}`).update({ done: true });

    Swal.fire({
        icon: 'success',
        title: 'Item marked as done!',
        showConfirmButton: false,
        timer: 1500
    });

    // Fetch and display updated checklist
    fetchChecklist();
}

// Initial fetch when the page loads
fetchChecklist();
firebase.auth().onAuthStateChanged(function(user) {
        
    if (user)//user
    {
  } 
  else // เมื่อผู้ใช้ไม่ได้อยู่ใน สถานะ login
  {
    window.location.href = "./login.html";
  }
}); 