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
const analytics = firebase.analytics();
const database = firebase.database();
const checklistForm = document.getElementById('checklistForm');
const checklist = document.getElementById('checklist');

function addItem() {
    const name = document.getElementById('name').value;
    const umail = "prayut@hi.com";
    const uname = "ตู่";
    const uid = "eiei";
    // Generate a unique ID for the checklist item
    const id = generateUniqueId();
    const currentTimme = new Date().getTime();
    const currentTime = currentTimme-1710006234850;
    // Save data to Firebase under the specific ID
    database.ref(`/listcheck/${id}`).set({
        id,
        name,
        uid,
        uname,
        umail,
        done: true,
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
    const currentTimme = new Date().getTime();
    const currentTime = currentTimme-1710006234850;
    // Function to generate a unique ID (you can customize this as needed)
    return currentTime;
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
  }
}); 