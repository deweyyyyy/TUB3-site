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
const database = firebase.database();
const analytics = firebase.analytics();
// Function to fetch and display user songs count
function fetchAndDisplayUserSongs() {
    const userList = document.getElementById('userList');

    // Fetch songs from the /listcheck node
    const songsRef = database.ref('/listcheck');
    songsRef.once('value', function(snapshot) {
        console.log("Snapshot:", snapshot.val()); // Log the entire snapshot for inspection

        const userSongsCount = {}; // Object to store song counts for each user
        // Count songs for each user
        snapshot.forEach(function(songSnapshot) {
            const userId = songSnapshot.child('uid').val();
            const username = songSnapshot.child('uname').val();
            const usermail = songSnapshot.child('umail').val();

            // Add username and email to the userSongsCount object
            if (!userSongsCount[userId]) {
                userSongsCount[userId] = {
                    count: 0,
                    username: username,
                    usermail: usermail
                };
            }
            userSongsCount[userId].count++;
        });

        // Convert userSongsCount object to array for sorting
        const userSongsCountArray = Object.keys(userSongsCount).map(userId => ({
            userId: userId,
            username: userSongsCount[userId].username,
            usermail: userSongsCount[userId].usermail,
            count: userSongsCount[userId].count
        }));

        // Sort the array by song count (descending order)
        userSongsCountArray.sort((a, b) => b.count - a.count);

        // Display user info along with song count
        userSongsCountArray.forEach(function(user) {
            const userId = user.userId;
            const username = user.username;
            const usermail = user.usermail;
            const songCount = user.count;

            // Create HTML to display user info and song count
            const userInfoHTML = `
                <div class="user-info">
                    <p>User: ${username} (${usermail})</p>
                    <p>Songs Added: ${songCount}</p>
                </div>
            `;
            userList.innerHTML += userInfoHTML;
        });
    });
}

// Call fetchAndDisplayUserSongs when the page loads
fetchAndDisplayUserSongs();
