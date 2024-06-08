const names = [
    "ปลื้ม", "กันต์", "ขวัญ", "ฟา", "ใบข้าว", "โนเบล", "อิงฟ้า", "มีนา",
    "จันทร์เจ้า", "ผักกาดแก้ว", "ปริ้น", "ดิว", "เคอิจิ", "จุ้ย", "ผักโขม",
    "แก้มหอม", "ข้าวหอม", "เทียนหอม", "ปิม", "ปั้น", "วันใส", "โจญ่า", 
    "น้ำอุ่น", "ภูผา", "ออม", "มดยิ้ม", "กรณ์", "โอพิ้งค์", "ฟีนิกซ์",
    "ปาย", "มน", "เคอร์ฟิว", "นนท์", "บลู", "อริศ"
];

const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spin-button');
let startAngle = 0;
let arc = Math.PI / (names.length / 2);
let spinTimeout = null;

WebFont.load({
    google: {
        families: ['Noto Sans Thai']
    },
    active: function() {
        drawWheel();
    }
});

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "20px 'Noto Sans Thai', sans-serif"; // Set font to Noto Sans Thai
    for (let i = 0; i < names.length; i++) {
        const angle = startAngle + i * arc;
        ctx.fillStyle = getColor(i, names.length);
        ctx.beginPath();
        ctx.arc(250, 250, 200, angle, angle + arc, false);
        ctx.lineTo(250, 250);
        ctx.fill();

        ctx.save();
        ctx.fillStyle = "black";
        ctx.translate(250, 250);
        ctx.rotate(angle + arc / 2);
        ctx.textAlign = "right";
        ctx.fillText(names[i], 190, 10);
        ctx.restore();
    }
}

function getColor(index, total) {
    const hue = index * (360 / total);
    return `hsl(${hue}, 100%, 50%)`;
}

let startTime = 0;

function rotateWheel(selectedIndex) {
    const targetIndex = selectedIndex % names.length; // Ensure the index is within the range of names
    const targetAngle = 2 * Math.PI * (1 - targetIndex / names.length);

    const fullRotationTime = 4567; // Time required for one full rotation in milliseconds

    let currentSpinSpeed = 10; // Initial spin speed

    startTime = Date.now(); // Record the start time

    function rotate() {
        const spinAngle = currentSpinSpeed; // Use current spin speed
        startAngle += (spinAngle * Math.PI / 180);

        // Ensure startAngle does not exceed targetAngle
        if (startAngle >= targetAngle) {
            
        }

        drawWheel();

        // Check if reached the target angle or exceeded max spin time
        if (startAngle === targetAngle || Date.now() - startTime >= fullRotationTime) {
            clearTimeout(spinTimeout);
            const degrees = startAngle * 180 / Math.PI + 90;
            const arcd = arc * 180 / Math.PI;
            const index = Math.floor((360 - degrees % 360) / arcd);
            if (index === targetIndex) {
                Swal.fire({
                    title: 'Congratulations!',
                    text: `You got: ${names[targetIndex]}`,
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            } else {
                // Gradually slow down as it approaches the target angle
                currentSpinSpeed -= 0.5;
                spinTimeout = setTimeout(rotate, 10);
            }
        } else {
            spinTimeout = setTimeout(rotate, 10);
            
        }
    }

    rotate();
}


function easeOut(t, b, c, d) {
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
}

spinButton.addEventListener('click', () => {
    // Randomly select a name
    const randomIndex = Math.floor(Math.random() * names.length);
   // const selectedName = names[randomIndex];
    
    // Log the selected name to the console
 //   console.log("Selected Name:", selectedName);
    
    // Spin to the selected name
    rotateWheel(randomIndex);
});
