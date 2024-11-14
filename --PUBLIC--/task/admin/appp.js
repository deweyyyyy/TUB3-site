// app.js
const selectedDateInput = document.getElementById('selectedDate');
const workForm = document.getElementById('workForm');
const subjectListContainer = document.getElementById('subjectList');

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAx7uPGRjJvpNYD0twbk8_hg_BCEG1A36g",
    authDomain: "tub3skku.firebaseapp.com",
    databaseURL: "https://tub3skku-default-rtdb.firebaseio.com",
    projectId: "tub3skku",
    storageBucket: "tub3skku.appspot.com",
    messagingSenderId: "944059952794",
    appId: "1:944059952794:web:b34765015204fdee8d3923"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const subjects = {
    "Sunday": [""],
    "Monday": [
      "LAB", "อังกฤษ พื้น", "อังกฤษ เพิ่ม", "คณิต พื้น", "แฮนด์บอล", "ไทย พื้น", "แนะแนว"
    ],
    "Tuesday": [
      "เศรษฐศาสตร์", "อังกฤษ เพิ่ม", "STEM", "งานประดิษฐ์", "ชุมนุม", "สังคม"
    ],
    "Wednesday": [
      "คณิต เพิ่ม", "อังกฤษ เพิ่ม", "สังคม", "เศรษฐศาสตร์", "พลานามัย", "ลูกเสือ", "Coding"
    ],
    "Thursday": [
      "ไทยเพื่อกิจธุระ", "วิทย์ พื้น", "ทัศนศิลป์", "ไทย พื้น", "จีน/ญี่ปุ่น", "อังกฤษ พื้น"
    ],
    "Friday": [
      "วิทย์ พื้น", "สังคม", "อังกฤษ พื้น", "คณิต พื้น", "อังกฤษ เพิ่ม", "คณิต เพิ่ม"
    ],
    "Saturday": [""]
  }
  

let selectedDay; // Declare selectedDay as a global variable

selectedDateInput.addEventListener('change', updateSubjectList);

function updateSubjectList() {
    const selectedDate = new Date(selectedDateInput.value);
    const dayIndex = selectedDate.getDay(); // Sunday is 0, Monday is 1, and so on

    selectedDay = Object.keys(subjects)[dayIndex];
    const subjectOptions = subjects[selectedDay] || [];

    const subjectListHTML = subjectOptions.map(subject => `
        <div>
            <label for="${subject}">${subject}:</label>
            <input type="text" id="${subject}" name="${subject}" placeholder="Work details...">
            <label for="${subject}Deadline">Deadline:</label>
            <input type="date" id="${subject}Deadline" name="${subject}Deadline"><br><br><br><br>
        </div>
    `).join('');

    subjectListContainer.innerHTML = subjectListHTML;
}
function saveWorkList() {
    const selectedDate = new Date(selectedDateInput.value);
    const formattedDate = formatDate(selectedDate); // Format the date to use as the key

    const workDetails = {};

    subjects[selectedDay].forEach(subjectCode => {
        const subjectName = subjects[selectedDay][subjectCode] || subjectCode;

        const workDescription = document.getElementById(subjectCode).value;
        const deadline = document.getElementById(`${subjectCode}Deadline`).value;

        // Check if work details are not empty before saving
        if (workDescription.trim() !== '' || deadline.trim() !== '') {
            workDetails[subjectCode] = {
                name: subjectName,
                workDescription: workDescription,
                deadline: deadline,
                asdate: formattedDate
            };
        }
    });

    // Check if there is any non-empty work detail before saving
    if (Object.keys(workDetails).length === 0) {
        console.log('No non-empty work details to save.');
        Swal.fire({
            icon: 'error',
            title: 'ไม่สามารถบันทึกรายการว่างเปล่าได้',
        });
        return;
    }

    // Save the workDetails object to Firebase Realtime Database
    database.ref(`workLists/work/${formattedDate}`).update(workDetails)
    .then(() => {
        console.log('Work Details for', formattedDate, 'successfully saved to Firebase!');
        return Swal.fire({
            icon: 'success',
            title: 'บันทึกสำเร็จ',
            confirmButtonText: 'OK'
        });
    })
    .then((result) => {
        if (result.isConfirmed) {
            // Reload the page
            location.reload();
        }
    })
    
        .catch(error => {
            console.error('Error saving work list: ', error);
            Swal.fire({
                icon: 'error',
                title: 'ไม่นะ มีบางอย่างผิดพลาด',
            });
        });
}

// Function to format the date as 'YYYY-MM-DD'
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}