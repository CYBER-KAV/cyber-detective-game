let score = 0;
let step = 0;
let timeLeft = 60;
let user = "";

const output = document.getElementById("output");
const timer = document.getElementById("timer");

// START GAME
function startGame() {
    user = document.getElementById("username").value;

    if (!user) {
        alert("Enter name!");
        return;
    }

    document.getElementById("loginBox").style.display = "none";
    document.getElementById("gameBox").style.display = "block";

    print("Welcome Agent: " + user);
    nextStep();
}

// PRINT FUNCTION
function print(text) {
    output.innerHTML += text + "<br>";
    output.scrollTop = output.scrollHeight;
}

// OPTIONS
function showOptions(options) {
    const div = document.createElement("div");

    options.forEach(opt => {
        const btn = document.createElement("button");
        btn.innerText = opt.text;
        btn.onclick = () => handleAnswer(opt.value);
        div.appendChild(btn);
    });

    output.appendChild(div);
}

// TIMER
setInterval(() => {
    timeLeft--;
    timer.innerText = "Time: " + timeLeft;

    if (timeLeft <= 0) {
        endGame();
    }
}, 1000);

// ANSWER HANDLER
function handleAnswer(ans) {

    if (step === 0 && ans === "2") score += 10;
    if (step === 1 && ans === "45.67.89.12") score += 10;
    if (step === 2 && ans === "malware") score += 10;
    if (step === 3 && ans === "password123") score += 10;

    step++;
    nextStep();
}

// GAME FLOW
function nextStep() {

    if (step === 0) {
        print("\nCase 1: Phishing Attack");
        showOptions([
            { text: "admin@securebank.com", value: "1" },
            { text: "admin@secure-bank-login.com", value: "2" }
        ]);
    }

    else if (step === 1) {
        print("\nCase 2: Trace attacker IP");
        showOptions([
            { text: "192.168.1.10", value: "1" },
            { text: "45.67.89.12", value: "45.67.89.12" }
        ]);
    }

    else if (step === 2) {
        print("\nCase 3: System infected");
        showOptions([
            { text: "Virus", value: "virus" },
            { text: "Malware", value: "malware" }
        ]);
    }

    else if (step === 3) {
        print("\nCase 4: Weak password");
        showOptions([
            { text: "password123", value: "password123" },
            { text: "StrongPass!9", value: "strong" }
        ]);
    }

    else {
        endGame();
    }
}

// END GAME
function endGame() {
    print("\nMISSION COMPLETE");
    print("Score: " + score + "/40");

    if (score === 40) print("💀 ELITE HACKER");
    else if (score >= 20) print("🧠 ANALYST");
    else print("⚠️ BEGINNER");
}

// RESTART
function restartGame() {
    location.reload();
}
