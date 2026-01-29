/* ===== MATRIX BACKGROUND ===== */
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

const chars = "01█▓▒░<>/\\{}[]$#@!*&";
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

// Use requestAnimationFrame for better performance
function drawMatrix() {
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "#00ff99";
    ctx.font = fontSize + "px monospace";
    
    drops.forEach((y, i) => {
        const text = chars[Math.floor(Math.random()*chars.length)];
        ctx.fillText(text, i*fontSize, y);
        drops[i] = y > canvas.height && Math.random() > 0.98 ? 0 : y + fontSize;
    });
    
    requestAnimationFrame(drawMatrix);
}

drawMatrix();

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    // Recalculate columns and reset drops
    const newColumns = canvas.width / fontSize;
    drops.length = Math.floor(newColumns);
    for (let i = 0; i < drops.length; i++) {
        if (drops[i] === undefined) {
            drops[i] = 1;
        }
    }
});

/* ===== NAVIGATION ===== */
function showSection(id){
    document.querySelectorAll(".section").forEach(s => s.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");
    if(id==="quiz") initPuzzle();
    
    // Update active nav item
    document.querySelectorAll('.navbar li').forEach(item => {
        item.classList.remove('active');
    });
    
    // Find the matching nav item and add active class
    document.querySelectorAll('.navbar li').forEach(item => {
        if (item.textContent.toLowerCase().includes(id) || 
            (id === 'home' && item.textContent.toLowerCase().includes('home'))) {
            item.classList.add('active');
        }
    });
}

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Only process if not in an input field
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    switch(e.key) {
        case '1':
            showSection('home');
            break;
        case '2':
            showSection('quiz');
            break;
        case '3':
            showSection('leaderboard');
            break;
        case '4':
            showSection('about');
            break;
        case 'Escape':
            showSection('home');
            break;
    }
});

/* ===== HOME TITLE ANIMATION ===== */
const title = "WELCOME TO CYBERIQ";
let titleIndex = 0;
function animateTitle(){
    if(titleIndex <= title.length){
        document.getElementById("animated-title").textContent = title.slice(0,titleIndex);
        titleIndex++;
        setTimeout(animateTitle,120);
    }
}
animateTitle();

/* ===== PUZZLE LOGIC ===== */
let puzzleState = "excited";
let difficulty = "easy";
let currentQ = 0;
let timerInterval;
let correctAnswers = 0;
let wrongAnswers = 0;

const difficulties = {
    easy: [
        {q:"HTTPS uses which port?", o:["21","80","443","25"], a:2},
        {q:"VPN hides your?", o:["MAC","IP Address","CPU","Disk"], a:1},
        {q:"Strong password is?", o:["123456","Name123","Random+Long","abc"], a:2},
        {q:"Firewall purpose?", o:["Storage","Security","Gaming","Design"], a:1},
        {q:"SQL Injection targets?", o:["CPU","Database","RAM","OS"], a:1},
        {q:"SSH port?", o:["22","80","443","21"], a:0},
        {q:"Two-factor authentication?", o:["Security","Speed","Storage","Design"], a:0},
        {q:"Encrypted email protects?", o:["Spam","Data","CPU","Disk"], a:1},
        {q:"Strongest encryption?", o:["AES","DES","MD5","SHA1"], a:0},
        {q:"Phishing is?", o:["Attack","Defense","Password","Firewall"], a:0}
    ],
    medium: [
        {q:"What does XSS stand for?", o:["Cross Site Script","Cross Security Script","Extra Secure System","Cross Socket Security"], a:0},
        {q:"Port scanning tool?", o:["Nmap","Wireshark","Chrome","Linux"], a:0},
        {q:"SSL provides?", o:["Authentication","Encryption","Integrity","All"], a:3},
        {q:"Brute force attack targets?", o:["Password","IP","Port","CPU"], a:0},
        {q:"Keylogger purpose?", o:["Spy","Encrypt","Scan","Firewall"], a:0},
        {q:"DNS attack type?", o:["Spoofing","Phishing","Bruteforce","Backdoor"], a:0},
        {q:"Ransomware encrypts?", o:["Files","CPU","RAM","Disk"], a:0},
        {q:"Firewall blocks?", o:["Unauthorized access","Speed","Storage","Design"], a:0},
        {q:"SSH keys used for?", o:["Auth","Password","CPU","Disk"], a:0},
        {q:"Phishing usually via?", o:["Email","Password","Firewall","CPU"], a:0}
    ]
};

/* ELEMENTS */
const quizHeader = document.getElementById("quiz-header");
const quizOptions = document.getElementById("quiz-options");
const questionEl = document.getElementById("question");
const optionsEl = document.querySelector(".options");
const resultEl = document.getElementById("result");
const timerBar = document.getElementById("timer-bar");
const timerContainer = document.querySelector(".timer-bar-container");

/* INITIALIZE PUZZLE */
function initPuzzle(){
    puzzleState = "excited";
    quizHeader.textContent = "Are you excited to try a cybersecurity logic puzzle challenge today?";
    quizOptions.innerHTML = `<button onclick="handleExcitement(true)">Yes</button>
                             <button onclick="handleExcitement(false)">No</button>`;
    questionEl.textContent = "";
    optionsEl.innerHTML = "";
    resultEl.textContent = "";
    timerContainer.classList.add("hidden");
    correctAnswers = 0;
    wrongAnswers = 0;
    // Clear any existing timer
    clearInterval(timerInterval);
}

/* HANDLE EXCITEMENT */
function handleExcitement(val){
    puzzleState = "difficulty";
    quizHeader.textContent = "Choose difficulty level:";
    quizOptions.innerHTML = `<button onclick="chooseDifficulty('easy')">Easy</button>
                             <button onclick="chooseDifficulty('medium')">Medium</button>`;
}

/* CHOOSE DIFFICULTY */
function chooseDifficulty(level){
    difficulty = level;
    puzzleState = "question";
    currentQ = 0;
    quizOptions.innerHTML = "";
    startQuestion();
}

/* START QUESTION */
function startQuestion(){
    const q = difficulties[difficulty][currentQ];
    quizHeader.textContent = `Question ${currentQ+1}/${difficulties[difficulty].length}`;
    questionEl.textContent = q.q;
    optionsEl.innerHTML = "";
    q.o.sort(()=>Math.random()-0.5).forEach((opt,i)=>{
        const btn = document.createElement("button");
        btn.textContent = opt;
        btn.onclick = ()=>checkAnswer(i);
        optionsEl.appendChild(btn);
    });
    resultEl.textContent = "";
    startTimerBar();
}

/* TIMER BAR */
function startTimerBar(){
    let timeLeft = 12;
    timerContainer.classList.remove("hidden");
    timerBar.style.width = "100%";
    clearInterval(timerInterval);
    timerInterval = setInterval(()=>{
        timeLeft -= 0.1;
        timerBar.style.width = (timeLeft/12*100)+"%";
        if(timeLeft<=0){
            clearInterval(timerInterval);
            checkAnswer(-1);
        }
    },100);
}

/* CHECK ANSWER */
function checkAnswer(selected){
    clearInterval(timerInterval);
    const q = difficulties[difficulty][currentQ];
    if(selected===q.a){
        resultEl.textContent="✔ ACCESS GRANTED";
        resultEl.className = "success"; // Add success class
        correctAnswers++;
    } else {
        resultEl.textContent="✖ ACCESS DENIED";
        resultEl.className = "error"; // Add error class
        wrongAnswers++;
    }
    currentQ++;
    if(currentQ<difficulties[difficulty].length){
        setTimeout(startQuestion,800);
    } else {
        setTimeout(showScoreSummary,800);
    }
}

/* SHOW SCORE SUMMARY */
function showScoreSummary(){
    puzzleState = "summary";
    quizHeader.textContent="Puzzle Test Complete";
    // Calculate percentage score
    const totalQuestions = difficulties[difficulty].length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    questionEl.textContent = `Correct: ${correctAnswers} | Wrong: ${wrongAnswers} | Score: ${correctAnswers}/${totalQuestions} (${percentage}%)`;
    optionsEl.innerHTML = `<button onclick="endGame()">Submit Score & View Leaderboard</button><button onclick="initPuzzle()">Restart Puzzle</button>`;
    resultEl.textContent = "";
    timerContainer.classList.add("hidden");
    // Don't reset counters here, they're needed for endGame
}

function endGame(){
  const name=prompt("Enter your name:");
  if(name && name.trim() !== '') {
    // Load leaderboard from localStorage
    loadLeaderboard();
    
    // Calculate score percentage (correct answers out of total questions)
    const totalQuestions = difficulties[difficulty].length;
    // Store both raw score and percentage for display
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    const userEntry = {name: name.trim(), score: correctAnswers, total: totalQuestions, percentage: percentage};
    window.leaderboard.push(userEntry);
    
    // Sort by score descending, then by percentage descending, then by timestamp ascending for ties
    window.leaderboard.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.percentage !== a.percentage) return b.percentage - a.percentage;
      return new Date(a.timestamp || Date.now()) - new Date(b.timestamp || Date.now());
    });
    
    // Add timestamp for tie-breaking
    window.leaderboard.forEach(entry => {
      if (!entry.timestamp) entry.timestamp = new Date().toISOString();
    });
    
    // Limit to top 10
    window.leaderboard = window.leaderboard.slice(0, 10);
    
    // Save to localStorage
    saveLeaderboard();
    
    // Find user's rank and show achievement message
    const userRank = window.leaderboard.findIndex(entry => entry.name === name.trim()) + 1;
    let achievementMessage = '';
    if(userRank === 1) {
      achievementMessage = `🎉 Congratulations! You're #1 on the leaderboard! You've beaten Neon!`;
    } else if(userRank <= 3 && userRank > 1) {
      achievementMessage = `🏆 Great job! You're ranked #${userRank}!`;
    } else {
      achievementMessage = `👍 You're ranked #${userRank} on the leaderboard!`;
    }
    
    // Show achievement message
    alert(achievementMessage);
    
    renderLeaderboard();
  }
  showSection('leaderboard');
}

/* LEADERBOARD */
function renderLeaderboard(){
  // Load leaderboard from localStorage
  loadLeaderboard();
  
  const list=document.getElementById("leaderboardList");
  list.innerHTML="";
  
  if(window.leaderboard.length === 0) {
    const tr=document.createElement("tr");
    tr.innerHTML=`<td colspan="3">No entries yet. Be the first to complete a quiz!</td>`;
    list.appendChild(tr);
  } else {
    window.leaderboard.forEach((p,i)=>{
      const tr=document.createElement("tr");
      // Display score as fraction if available, otherwise as percentage
      const scoreDisplay = p.total ? `${p.score}/${p.total}` : `${p.score}%`;
      tr.innerHTML=`<td>${i+1}</td><td>${p.name}</td><td>${scoreDisplay}</td>`;
      list.appendChild(tr);
    });
  }
}

// Load leaderboard from localStorage
function loadLeaderboard() {
  const savedLeaderboard = localStorage.getItem('cyberiq_leaderboard');
  if(savedLeaderboard) {
    window.leaderboard = JSON.parse(savedLeaderboard);
  } else {
    // Initialize with sample data if no data exists
    window.leaderboard = [
      {name: 'Neon', score: 10, total: 10, percentage: 100}, // 10/10 = 100%
      {name: 'Null', score: 8, total: 10, percentage: 80},   // 8/10 = 80%
      {name: 'Romio', score: 2, total: 10, percentage: 20}  // 2/10 = 20%
    ];
    saveLeaderboard();
  }
}

// Save leaderboard to localStorage
function saveLeaderboard() {
  localStorage.setItem('cyberiq_leaderboard', JSON.stringify(window.leaderboard));
}