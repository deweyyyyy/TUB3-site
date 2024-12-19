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
        const songcounteuei = 3 - songCount; // Calculate 3 minus the song count

        document.getElementById('songCount').innerText = `คุณเพิ่มเพลงไป ${songCount} เพลง เพิ่มได้อีก ${songcounteuei} เพลง`;
        document.getElementById('loadfe').style.display = 'none'; // Hide the form
        
        // Get the form element
        const form = document.getElementById('checklistForm');
        const limit = document.getElementById('limitalert');

        // Check if the song count is greater than 3
        if (songCount >= 300) {
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
const database = firebase.database();
const checklistForm = document.getElementById('checklistForm');
const checklist = document.getElementById('checklist');

function showDetailFields() {
    const option = document.getElementById('option').value;
    
    // Hide all detail sections first
    document.getElementById('ร้องDetails').style.display = 'none';
    document.getElementById('ฟังDetails').style.display = 'none';
    document.getElementById('otherDetails').style.display = 'none';
    
    // Show relevant detail section based on the selected option
    if (option === 'ร้อง') {
        document.getElementById('ร้องDetails').style.display = 'block';
    } else if (option === 'ฟัง') {
        document.getElementById('ฟังDetails').style.display = 'block';
    } else if (option === 'อื่นๆ') {
        document.getElementById('otherDetails').style.display = 'block';
    }
}

function Itemza() {
    const name = document.getElementById('name').value;
    const option = document.getElementById('option').value;
    let detail = '';

    // Get the corresponding details based on the option selected
    if (option === 'ร้อง') {
        detail = document.getElementById('ร้องOption').value;
    } else if (option === 'ฟัง') {
        detail = document.getElementById('ฟังOption').value;
    } else if (option === 'อื่นๆ') {
        detail = document.getElementById('otherDetail').value;
    }

    // Validate the form
    if (name !== '' && option !== '') {
        ItemAdd(name, option, detail); // Pass name, option, and detail to the ItemAdd function
    } else {
        Swal.fire({
            title: 'เพิ่มไม่สำเร็จ',
            text: 'กรุณากรอกข้อมูลให้ครบถ้วน',
            icon: 'error',
            timer: 1000,
            showConfirmButton: false,
            timerProgressBar: true
        });
    }
}

function ItemAdd(name, option, detail) {
    const user = firebase.auth().currentUser;
    const detaill = option + ', ' + detail;
    const checklistForm = document.getElementById('checklistForm');
    if (user) {
        const umail = user.email;
        const uname = user.displayName;
        const uid = user.uid;
        const id = generateUniqueId();
        const currentTime = new Date().getTime();

        // Save data to Firebase under the specific ID
        database.ref(`/listcheck/${id}`).set({
            id,
            name,
            uid,
            uname,
            umail,
            lastCheckedTime: currentTime,
            detaill
        });

        // Clear form
        checklistForm.reset();
        showDetailFields();
        Swal.fire({
            title: 'เพิ่มสำเร็จ',
            icon: 'success',
            timer: 1000,
            showConfirmButton: false,
            timerProgressBar: true
        });
        fetchChecklist(); // Fetch and display the updated checklist
    } else {
        console.error('User not authenticated');
    }
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