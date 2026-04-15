// missions.js
const MISSIONS = [
  {
    id:1, title:'PHISHING DETECTION', time:60,
    dialogue:'Agent, analyze this suspicious email. Identify the phishing sender address.',
    scene:'email',
    content:`FROM: admin@secure-bank-login.com
TO: john.doe@company.com
SUBJECT: URGENT — Verify Your Account Now

Dear Customer,
Your account has been flagged for suspicious activity.
Click the link IMMEDIATELY to avoid suspension:
http://secure-bank-login.com/verify?token=xK9mP2

⚠ Failure to verify within 24 hours = account closure.
— Security Team, National Bank`,
    question:'Which email address is the phishing sender?',
    choices:[
      {text:'admin@secure-bank-login.com', correct:true},
      {text:'john.doe@company.com', correct:false},
      {text:'security@nationalbank.com', correct:false},
      {text:'noreply@bank-alerts.net', correct:false}
    ],
    hint:'Legitimate banks never use lookalike domains. Check the domain carefully.'
  },
  {
    id:2, title:'NETWORK BREACH', time:55,
    dialogue:'We have an active intrusion. Analyze the logs and identify the attacker IP address.',
    scene:'terminal',
    content:`[SYS]  03:12:44 — Connection from 192.168.1.1 (internal)
[SYS]  03:13:01 — Connection from 10.0.0.5 (internal)
[WARN] 03:14:22 — Failed login x47 from 45.67.89.12
[CRIT] 03:14:23 — ROOT ACCESS GRANTED — 45.67.89.12
[CRIT] 03:14:25 — /etc/passwd exfiltrated — 45.67.89.12
[WARN] 03:15:00 — Port scan detected from 45.67.89.12
[SYS]  03:16:10 — Connection from 172.16.0.3 (internal)`,
    question:'Which IP address is the attacker?',
    choices:[
      {text:'192.168.1.1', correct:false},
      {text:'45.67.89.12', correct:true},
      {text:'10.0.0.5', correct:false},
      {text:'172.16.0.3', correct:false}
    ],
    hint:'Look for repeated failed logins followed by a CRITICAL access event from the same IP.'
  },
  {
    id:3, title:'MALWARE ANALYSIS', time:50,
    dialogue:'System integrity compromised. Diagnose the threat type from the diagnostic report.',
    scene:'diagnostics',
    content:`SYSTEM DIAGNOSTIC REPORT
━━━━━━━━━━━━━━━━━━━━━━━━
CPU Usage:  ████████████ 94% [CRITICAL]
Memory:     ████████░░░░ 78%
Network:    Outbound traffic to TOR exit node

PROCESS ANOMALIES:
  svchost32.exe  — Injected into explorer.exe
  winlogon_.exe  — Keylogging signatures detected
  update_ms.exe  — Encrypting /Documents/* [ACTIVE]

VERDICT: Files being encrypted. Ransom note dropped.`,
    question:'What type of malware has infected this system?',
    choices:[
      {text:'Spyware', correct:false},
      {text:'Adware', correct:false},
      {text:'Ransomware', correct:true},
      {text:'Rootkit', correct:false}
    ],
    hint:'File encryption + ransom note = a very specific category of malware.'
  },
  {
    id:4, title:'PASSWORD SECURITY', time:45,
    dialogue:'User credentials leaked in a breach dump. Identify the weakest password.',
    scene:'database',
    content:`CREDENTIAL DATABASE — BREACH DUMP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
user_id | username     | password
--------|--------------|------------------
  1001  | alice_chen   | password123
  1002  | bob_martinez | Tr0ub4dor&3
  1003  | carol_smith  | X#9kL$mP2@qR
  1004  | dave_wilson  | hunter2

ANALYSIS: 2 accounts use dictionary-based passwords.`,
    question:'Which password is the weakest and most vulnerable?',
    choices:[
      {text:'Tr0ub4dor&3', correct:false},
      {text:'X#9kL$mP2@qR', correct:false},
      {text:'password123', correct:true},
      {text:'hunter2', correct:false}
    ],
    hint:'The weakest password is one found in any basic dictionary attack wordlist.'
  },
  {
    id:5, title:'BASE64 DECODE', time:50,
    dialogue:'Intercepted encoded payload. Decode the Base64 string to reveal the hidden threat.',
    scene:'hologram',
    content:`INTERCEPTED TRANSMISSION
━━━━━━━━━━━━━━━━━━━━━━━━
Encoding:  BASE64
Payload:   bWFsd2FyZQ==

DECODE HINT:
  atob("bWFsd2FyZQ==") = ?
  Each 4 Base64 chars = 3 ASCII bytes
  b=m, W=a, F=l, s=w, d=a, 2=r, FyZQ===e

Decoded string: _ _ _ _ _ _ _`,
    question:'What does the Base64 string "bWFsd2FyZQ==" decode to?',
    choices:[
      {text:'ransomware', correct:false},
      {text:'malware', correct:true},
      {text:'spyware', correct:false},
      {text:'firmware', correct:false}
    ],
    hint:'Try atob("bWFsd2FyZQ==") in your browser console.'
  },
  {
    id:6, title:'SQL INJECTION', time:45,
    dialogue:'Our login portal is under attack. Identify the SQL injection payload in the logs.',
    scene:'terminal',
    content:`WEB APPLICATION FIREWALL — REQUEST LOG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[REQ-001] username="alice"  password="mypassword"
[REQ-002] username="admin"  password="admin123"
[REQ-003] username="' OR '1'='1"  password="x"
[REQ-004] username="bob"    password="securepass99"

QUERY EXECUTED:
  SELECT * FROM users WHERE user='' OR '1'='1'
  RESULT: Authentication BYPASSED — Full DB access`,
    question:'Which input is the SQL injection attack?',
    choices:[
      {text:'"alice" / "mypassword"', correct:false},
      {text:'"admin" / "admin123"', correct:false},
      {text:`' OR '1'='1'`, correct:true},
      {text:'"bob" / "securepass99"', correct:false}
    ],
    hint:"SQL injection uses OR logic to make the WHERE clause always evaluate to true."
  },
  {
    id:7, title:'SOCIAL ENGINEERING', time:50,
    dialogue:'An employee received a suspicious call. Identify the social engineering tactic used.',
    scene:'email',
    content:`INCIDENT REPORT — SOCIAL ENGINEERING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Caller: "IT Support — John from HelpDesk"
Target: Sarah, Accounting Dept.

TRANSCRIPT:
  CALLER: "Hi Sarah, this is John from IT.
           We detected a virus on your machine.
           I need your Windows password to run
           a remote scan — it's urgent."
  SARAH:  "Oh no, should I be worried?"
  CALLER: "Yes, give me your credentials NOW."

Tactic used: _______________`,
    question:'What social engineering tactic was used in this attack?',
    choices:[
      {text:'Phishing Email', correct:false},
      {text:'Pretexting / Vishing', correct:true},
      {text:'Baiting', correct:false},
      {text:'Tailgating', correct:false}
    ],
    hint:'This attack uses a fabricated scenario (pretext) delivered over a phone call (vishing).'
  },
  {
    id:8, title:'ZERO-DAY THREAT', time:40,
    dialogue:'Unknown exploit detected in the wild. Classify this zero-day attack vector.',
    scene:'diagnostics',
    content:`THREAT INTELLIGENCE — ZERO-DAY REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CVE: PENDING  |  Severity: CRITICAL (CVSS 9.8)

ATTACK CHAIN:
  1. Malicious PDF sent via email attachment
  2. PDF reader parses crafted font table
  3. Buffer overflow in font rendering engine
  4. Shellcode executes with SYSTEM privileges
  5. Reverse shell → C2 server: 91.108.4.x

Patch Available: NO
Exploitation: ACTIVE IN THE WILD`,
    question:'How should this zero-day attack vector be classified?',
    choices:[
      {text:'DDoS Attack', correct:false},
      {text:'Man-in-the-Middle', correct:false},
      {text:'Remote Code Execution (RCE)', correct:true},
      {text:'DNS Spoofing', correct:false}
    ],
    hint:'Shellcode executing with SYSTEM privileges via buffer overflow = code execution remotely.'
  }
];

// ── CTF CHALLENGES ──────────────────────────────────
MISSIONS.push({
  id:9, title:'CTF #1 — ROT13 CIPHER', time:60,
  dialogue:'Intercepted message encoded with ROT13. Decode it to find the flag.',
  scene:'terminal',
  content:`INTERCEPTED MESSAGE\n━━━━━━━━━━━━━━━━━━━\nEncoded:  PGS{ebg13_vf_rnfl}\n\nROT13 TABLE (A↔N, B↔O, C↔P ...):\n  P → C\n  T → G (wait, P→C, G→T, S→F)\n  { stays {\n  e → r, b → o, g → t\n  1 → 1, 3 → 3\n  _ stays _\n  v → i, f → s\n  _ stays _\n  r → e, n → a, f → s, l → y`,
  question:'What is the decoded CTF flag?',
  choices:[
    {text:'CTF{rot13_is_easy}', correct:true},
    {text:'CTF{decode_me_now}', correct:false},
    {text:'CTF{caesar_cipher}', correct:false},
    {text:'CTF{base64_rocks}',  correct:false}
  ],
  hint:'ROT13 shifts every letter by 13. P→C, G→T, S→F, e→r, b→o, g→t, v→i, f→s.'
});

MISSIONS.push({
  id:10, title:'CTF #2 — HIDDEN IN HTML', time:55,
  dialogue:'A suspicious webpage was captured. Find the hidden flag in the source code.',
  scene:'terminal',
  content:`PAGE SOURCE — suspicious-site.com\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n<html>\n<head><title>Nothing here</title></head>\n<body>\n  <h1>Welcome</h1>\n  <p>This page is empty.</p>\n  <!-- flag: CTF{hidden_in_comments} -->\n  <div style="color:white;background:white;">\n    not the flag\n  </div>\n</body>\n</html>`,
  question:'Where is the CTF flag hidden and what is it?',
  choices:[
    {text:'CTF{hidden_in_comments}', correct:true},
    {text:'CTF{white_on_white}',     correct:false},
    {text:'CTF{nothing_here}',       correct:false},
    {text:'CTF{welcome_page}',       correct:false}
  ],
  hint:'Always check HTML comments <!-- --> when hunting for flags in web challenges.'
});

MISSIONS.push({
  id:11, title:'CTF #3 — BINARY TO TEXT', time:60,
  dialogue:'A binary-encoded message was found. Convert it to ASCII to reveal the flag.',
  scene:'hologram',
  content:`BINARY TRANSMISSION\n━━━━━━━━━━━━━━━━━━━\n01000011 = 67  = C\n01010100 = 84  = T\n01000110 = 70  = F\n01111011 = 123 = {\n01100010 = 98  = b\n01101001 = 105 = i\n01101110 = 110 = n\n01100001 = 97  = a\n01110010 = 114 = r\n01111001 = 121 = y\n01111101 = 125 = }`,
  question:'What does the binary message decode to?',
  choices:[
    {text:'CTF{binary}',  correct:true},
    {text:'CTF{base64}',  correct:false},
    {text:'CTF{decode}',  correct:false},
    {text:'CTF{hacker}',  correct:false}
  ],
  hint:'Convert each 8-bit group to decimal then to ASCII character. 01100010=98=b, 01101001=105=i...'
});

MISSIONS.push({
  id:12, title:'CTF #4 — CAESAR CIPHER', time:55,
  dialogue:'Text encrypted with Caesar cipher shift 3. Decrypt to find the flag.',
  scene:'terminal',
  content:`ENCRYPTED FLAG\n━━━━━━━━━━━━━━\nCipher: FWI{fdhvdu_flskhu}\nShift:  3 (subtract 3 from each letter)\n\nDECRYPT GUIDE:\n  F-3 = C\n  W-3 = T\n  I-3 = F\n  { stays {\n  f-3 = c, d-3 = a, h-3 = e\n  v-3 = s, d-3 = a, u-3 = r\n  _ stays _\n  f-3 = c, l-3 = i, s-3 = p\n  k-3 = h, h-3 = e, u-3 = r`,
  question:'What is the decrypted Caesar cipher flag?',
  choices:[
    {text:'CTF{caesar_cipher}', correct:true},
    {text:'CTF{shift_three}',   correct:false},
    {text:'CTF{rot13_easy}',    correct:false},
    {text:'CTF{encrypt_me}',    correct:false}
  ],
  hint:'Subtract 3 from each letter. F→C, W→T, I→F = CTF. Apply same to the rest.'
});

MISSIONS.push({
  id:13, title:'CTF #5 — PORT RECON', time:50,
  dialogue:'You ran nmap on a target. Identify which open port the HTTP web server is on.',
  scene:'diagnostics',
  content:`NMAP SCAN REPORT\n━━━━━━━━━━━━━━━━\nHost: 10.10.10.5  Status: UP\n\nPORT     STATE   SERVICE\n21/tcp   open    ftp\n22/tcp   open    ssh\n80/tcp   open    http   ← Apache 2.4\n443/tcp  closed  https\n3306/tcp open    mysql\n8080/tcp open    http-proxy\n\nFLAG FORMAT: CTF{port_NUMBER}`,
  question:'What is the CTF flag for the HTTP web server port?',
  choices:[
    {text:'CTF{port_80}',   correct:true},
    {text:'CTF{port_22}',   correct:false},
    {text:'CTF{port_3306}', correct:false},
    {text:'CTF{port_8080}', correct:false}
  ],
  hint:'Standard HTTP runs on port 80. The scan shows Apache 2.4 on 80/tcp open.'
});

MISSIONS.push({
  id:14, title:'CTF #6 — MD5 HASH CRACK', time:60,
  dialogue:'A password hash was recovered. Match it to the correct plaintext password.',
  scene:'database',
  content:`HASH CRACKING CHALLENGE\n━━━━━━━━━━━━━━━━━━━━━━━\nAlgorithm: MD5\nTarget:    5f4dcc3b5aa765d61d8327deb882cf99\n\nRAINBOW TABLE (common passwords):\n  hello    → 5d41402abc4b2a76b9719d911017c592\n  admin    → 21232f297a57a5a743894a0e4a801fc3\n  password → 5f4dcc3b5aa765d61d8327deb882cf99\n  123456   → e10adc3949ba59abbe56e057f20f883e\n\nMatch target hash to find plaintext.\nFLAG: CTF{plaintext}`,
  question:'What plaintext password matches the MD5 hash?',
  choices:[
    {text:'CTF{password}', correct:true},
    {text:'CTF{admin}',    correct:false},
    {text:'CTF{hello}',    correct:false},
    {text:'CTF{123456}',   correct:false}
  ],
  hint:'Compare the target hash with the rainbow table. 5f4dcc3b... matches "password".'
});

window.MISSIONS = MISSIONS;
