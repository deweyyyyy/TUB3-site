// app-guest.js
const dateSelector = document.getElementById('dateSelector');
const workDetailsContainer = document.getElementById('workDetailsContainer');
const nextDeadlineDetails = document.getElementById('nextDeadlineDetails');

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

dateSelector.addEventListener('change', loadWorkDetails);

// Fetch and populate the date selector
fetchDates();

function fetchDates() {
    const dates = [];

    // Fetch the dates from the database (assuming they are stored as keys)
    database.ref('workLists').once('value')
        .then(snapshot => {
            snapshot.forEach(dateSnapshot => {
                const date = dateSnapshot.key;
                dates.push(date);
            });

            // Populate the date selector
            dates.reverse(); // Display most recent dates first
            dates.forEach(date => {
                const option = document.createElement('option');
                option.value = date;
                option.textContent = date;
                dateSelector.appendChild(option);
            });

            // Trigger the initial loading of work details
            loadWorkDetails();
        })
        .catch(error => {
            console.error('Error fetching dates: ', error);
        });
}

function loadWorkDetails() {
    const selectedDate = dateSelector.value;

    // Fetch the work details for the selected date
    database.ref(`workLists/${selectedDate}`).once('value')
        .then(snapshot => {
            const workDetails = snapshot.val();

            // Display the work details
            displayWorkDetails(workDetails);

            // Display the next deadline
            displayNextDeadline();
        })
        .catch(error => {
            console.error('Error fetching work details: ', error);
        });
}

function displayWorkDetails(workDetails) {
    // Clear previous work details
    workDetailsContainer.innerHTML = '';

    if (!workDetails) {
        workDetailsContainer.textContent = 'ไม่พบข้อมูลในวันที่เลือก';
        return;
    }

    // Display the work details
    for (const subject in workDetails) {
        const details = workDetails[subject];
        const workDetailsHTML = `
            <div>
                <p><strong>วิชา:</strong> ${details.name}</p>
                <p><strong>รายละเอียด:</strong> ${details.workDescription}</p>
                <p><strong>กำหนดส่ง:</strong> ${details.deadline}</p><br><br>
            </div>
        `;
        workDetailsContainer.innerHTML += workDetailsHTML;
    }
}
function displayNextDeadline() {
    // Fetch all work details to find the next deadlines
    database.ref('workLists').once('value')
        .then(snapshot => {
            const allWorkDetails = [];

            snapshot.forEach(dateSnapshot => {
                const workDetails = dateSnapshot.val();
                if (workDetails) {
                    allWorkDetails.push(...Object.values(workDetails));
                }
            });

            // Filter work details to include only those with deadlines not passed
            const now = new Date();
            now.setHours(0, 0, 0, 0); // Set time components to midnight
            
            const upcomingDeadlines = allWorkDetails.filter(details => {
                const deadlineDate = new Date(details.deadline);
                deadlineDate.setHours(0, 0, 0, 0); // Set time components to midnight
            
                return deadlineDate >= now;
            });

            // Sort upcomingDeadlines by the deadline date
            upcomingDeadlines.sort((a, b) => {
                const deadlineDateA = new Date(a.deadline);
                const deadlineDateB = new Date(b.deadline);

                return deadlineDateA - deadlineDateB;
            });

            // Display the upcoming deadlines details
            nextDeadlineDetails.innerHTML = '';

            if (upcomingDeadlines.length > 0) {
                upcomingDeadlines.forEach(details => {
                    const deadlineDate = new Date(details.deadline);
                    deadlineDate.setHours(0, 0, 0, 0); // Set time components to midnight

                    const timeDiff = deadlineDate.getTime() - now.getTime();
                    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

                    let cssClass = '';
                    if (daysDiff === 0) {
                        cssClass = 'soon1';
                    } else if (daysDiff === 1) {
                        cssClass = 'soon2';
                    } else if (daysDiff === 2) {
                        cssClass = 'soon3';
                    } else if (daysDiff === 3) {
                        cssClass = 'soon4';
                    } else if (daysDiff === 5) {
                        cssClass = 'soon5';
                    } else if (daysDiff === 7) {
                        cssClass = 'soon7';
                    }
                    else {
                        cssClass = 'message';
                    }
                    const deadlineDiv = document.createElement('div');
                    deadlineDiv.classList.add('message', cssClass);
                    deadlineDiv.id = `deadline-${details.name.replace(/\s/g, '')}`;
        
                    const subjectParagraph = document.createElement('p');
                    subjectParagraph.innerHTML = `<strong>วิชา:</strong> ${details.name}`;
                    deadlineDiv.appendChild(subjectParagraph);
        
                    const descriptionParagraph = document.createElement('p');
                    descriptionParagraph.classList.add('description');
                    descriptionParagraph.innerHTML = `<strong>รายละเอียด:</strong> ${details.workDescription}`;
                    deadlineDiv.appendChild(descriptionParagraph);
        
                    const deadlineParagraph = document.createElement('p');
                    deadlineParagraph.innerHTML = `<strong>กำหนดส่ง:</strong> ${details.deadline}`;
                    deadlineDiv.appendChild(deadlineParagraph);
        
                    nextDeadlineDetails.appendChild(deadlineDiv);
        
                    // Check if the description width exceeds 300 pixels and add "Show Full Description" button
                    if (descriptionParagraph.offsetWidth >= 300) {
                        const showFullDescriptionButton = document.createElement('button');
                        showFullDescriptionButton.textContent = 'รายละเอียดงานเพิ่มเติม';
                        showFullDescriptionButton.addEventListener('click', function () {
                            showFullDescription(details);
                        });
                        deadlineDiv.appendChild(showFullDescriptionButton);
                    }
                });
            } else {
                nextDeadlineDetails.textContent = 'ไม่พบข้อมูลที่จะมีกำหนดส่งเร็วๆนี้';
            }
        })
        .catch(error => {
            console.error('Error fetching upcoming deadlines: ', error);
        });
}
function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}

const taskRef = database.ref(`workLists/${assignedDate}/${taskName}`);

taskRef.once('value')
    .then(snapshot => {
        const taskDetails = snapshot.val();
        if (taskDetails) {
            // After assigning, show the full description
            showFullDescription(taskDetails, assignedDate);
        } else {
            console.error('Task details not found.');
        }
    })
    .catch(error => {
        console.error('Error fetching task details: ', error);
    });

// Function to display full details using SweetAlert
function showFullDescription(details, assignedDate) {
    Swal.fire({
        title: "รายละเอียดงาน",
        html: `
            <p><strong>รายวิชา:</strong> ${details.name}</p>
            <p><strong>รายละเอียด:</strong> ${details.workDescription}</p>
            <p><strong>กำหนดส่ง:</strong> ${details.deadline}</p>
           <!-- <p><strong>สั่งเมื่อ:</strong>  ${assignedDate}</p> -->
        `,
        icon: 'info',
        confirmButtonText: 'OK'
    });
}