let user = "";
let score = 0;
let step = 0;
let time = 60;

const output = document.getElementById("output");
const optionsDiv = document.getElementById("options");
const timer = document.getElementById("timer");


function showScreen(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}


function startGame() {
    user = document.getElementById("username").value;

    if (!user) {
        alert("Enter codename");
        return;
    }

    showScreen("gameScreen");
    print("Welcome Agent: " + user);
    nextStep();
}


function print(text) {
    output.innerHTML += text + "<br>";
    output.scrollTop = output.scrollHeight;
}


function showOptions(arr) {
    optionsDiv.innerHTML = "";

    arr.forEach(opt => {
        let btn = document.createElement("button");
        btn.innerText = opt.text;
        btn.onclick = () => checkAnswer(opt.value);
        optionsDiv.appendChild(btn);
    });
}


function checkAnswer(ans) {

    if (step === 0 && ans === "2") score += 10;
    if (step === 1 && ans === "ip") score += 10;
    if (step === 2 && ans === "malware") score += 10;
    if (step === 3 && ans === "weak") score += 10;

    step++;
    nextStep();
}

function nextStep() {

    if (step === 0) {
        print("Case 1: Identify phishing email");
        showOptions([
            { text: "securebank.com", value: "1" },
            { text: "secure-bank-login.com", value: "2" }
        ]);
    }

    else if (step === 1) {
        print("Case 2: Find attacker IP");
        showOptions([
            { text: "192.168.1.10", value: "safe" },
            { text: "45.67.89.12", value: "ip" }
        ]);
    }

    else if (step === 2) {
        print("Case 3: System infected");
        showOptions([
            { text: "Virus", value: "virus" },
            { text: "Malware", value: "malware" }
        ]);
    }

    else if (step === 3) {
        print("Case 4: Weak password");
        showOptions([
            { text: "password123", value: "weak" },
            { text: "Strong@123", value: "strong" }
        ]);
    }

    else {
        endGame();
    }
}

function endGame() {
    print("Mission Complete!");
    print("Score: " + score + "/40");

    if (score === 40) print("💀 ELITE HACKER");
    else if (score >= 20) print("🧠 ANALYST");
    else print("⚠️ BEGINNER");

    optionsDiv.innerHTML = "";
}


setInterval(() => {
    if (time > 0) {
        time--;
        timer.innerText = time + "s";
    } else {
        endGame();
    }
}, 1000);


function restartGame() {
    location.reload();
}
