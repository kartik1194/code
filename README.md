# 📡 Exam Relay - Terminal-Based Cheating Tool  

## 🔍 What This Does  
- **Secretly connects** exam-taker (in lab) 🖥️ with helper (outside) 🏠 via terminal  
- **Works under proctoring** 👀 (no browser tabs needed)  
- **Supports**:  
  - 📝 Chat  
  - ❓ Questions  
  - 💻 Code snippets  

## ⚙️ Requirements  
1. **Node.js** installed (`node -v` to check)  
2. **Git** (usually available in labs)  

## 🛠️ Setup (One-Time)  

### 👨‍💻 For Helper (Outside Lab)  
1. Clone repo: `git clone [repo-url]`  
2. Install deps: `npm install socket.io-client clear`  
3. Run: `node client.js -h`  

### 🎓 For Test-Taker (In Lab)  
Same steps, but run without `-h`:  
```bash
node client.js
```  

## 🚀 Usage  

### ⌨️ Commands  
```
!q [question]  ➔ 📢 Send question to helper  
!c [code]      ➔ 💾 Send code snippet  
!s [msg]       ➔ 🚨 Emergency alert (blinks)  
!p             ➔ 🔥 Panic - clears screen  
!x             ➔ ⏹️ Exit immediately  
```  

### 🔄 Normal Operation  
1. **Helper** runs with `-h` flag  
2. **Test-taker** runs without flag  
3. **Type normally** for chat  
4. **Use commands** for special messages  

## 💡 Pro Tips  
1. **Minimize terminal** → less suspicious 🕵️‍♂️  
2. **`!p`** = instant screen wipe if proctor comes near 🚨  
3. **`!x`** = nuke everything fast 💥  
4. **Code looks like normal terminal text** – no weird formatting ✅  

## ☁️ Deployment (Optional)  
To self-host the backend (free on Render):  
1. **Sign up** at [Render](https://render.com)  
2. **Upload `server.js`**  
3. **Update `SERVER_URL`** in `client.js`  

## ⚠️ Warning  
1. **This is cheating** – don’t get caught 🚫  
2. **Helper must be fast** ⏱️ (or you’re screwed)  
3. **Test before D-Day** 🧪 → no surprises  