window.onload = () => {
    document.getElementById("loginBox").style.display = "block";
};
let score = 0;
let step = 0;
let timeLeft = 60;
let user = "";

const output = document.getElementById("output");
const timer = document.getElementById("timer");

function print(text) {
    output.innerHTML += text + "<br>";
    output.scrollTop = output.scrollHeight;
}

function showOptions(options) {
    const div = document.createElement("div");

    options.forEach(opt => {
        const btn = document.createElement("button");
        btn.innerText = opt.text;
        btn.className = "option-btn";
        btn.onclick = () => handleAnswer(opt.value);
        div.appendChild(btn);
    });

    output.appendChild(div);
}

function startGame() {
    user = document.getElementById("username").value;

    if (!user) return alert("Enter name!");

    document.getElementById("loginBox").style.display = "none";
    document.getElementById("gameBox").style.display = "block";

    print("Welcome Agent: " + user);
    nextStep();
}

// TIMER
setInterval(() => {
    timeLeft--;
    timer.innerText = "Time: " + timeLeft;

    if (timeLeft <= 0) endGame();
}, 1000);

// GAME FLOW
function handleAnswer(ans) {

    if (step === 0 && ans === "2") score += 10;
    if (step === 1 && ans === "45.67.89.12") score += 10;
    if (step === 2 && ans === "malware") score += 10;
    if (step === 3 && ans === "password123") score += 10;
    if (step === 4 && ans === "base64") score += 10;

    step++;
    nextStep();
}

function nextStep() {

    if (step === 0) {
        print("Case 1: Phishing");
        showOptions([
            { text: "securebank.com", value: "1" },
            { text: "secure-bank-login.com", value: "2" }
        ]);
    }

    else if (step === 1) {
        print("Case 2: IP Trace");
        showOptions([
            { text: "192.168.1.10", value: "1" },
            { text: "45.67.89.12", value: "45.67.89.12" }
        ]);
    }

    else if (step === 2) {
        print("Case 3: Malware");
        showOptions([
            { text: "Virus", value: "virus" },
            { text: "Malware", value: "malware" }
        ]);
    }

    else if (step === 3) {
        print("Case 4: Password");
        showOptions([
            { text: "password123", value: "password123" },
            { text: "StrongPass", value: "strong" }
        ]);
    }

    else if (step === 4) {
        print("Case 5: Encoding");
        showOptions([
            { text: "Base64", value: "base64" },
            { text: "SHA256", value: "sha" }
        ]);
    }

    else {
        endGame();
    }
}

// END GAME + LEADERBOARD
function endGame() {
    print("Mission Complete!");
    print("Score: " + score);

    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push({ name: user, score: score });

    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

    print("Leaderboard:");
    leaderboard.forEach(p => {
        print(p.name + " : " + p.score);
    });
}

// RESTART
function restartGame() {
    location.reload();
}

// MATRIX EFFECT
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = "01";
const fontSize = 14;
const columns = canvas.width / fontSize;

const drops = Array(Math.floor(columns)).fill(1);

function draw() {
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#0f0";
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height) drops[i] = 0;
        drops[i]++;
    }
}

setInterval(draw, 33);
