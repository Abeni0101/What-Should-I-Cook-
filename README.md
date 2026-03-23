
# 🍳 What Should I Cook?
### *The Interactive Decision Engine for the Famished.*

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=soft&color=auto&height=200&section=header&text=Chef%20Decision%20Engine&fontSize=60&animation=fadeIn" width="100%" />

[![Status](https://img.shields.io/badge/Status-Live_Production-7aa2f7?style=for-the-badge)]()
[![JS](https://img.shields.io/badge/Logic-ESM_Modular-ff6b2b?style=for-the-badge)]()
[![UX](https://img.shields.io/badge/UX-Interactive_Voice-bb9af7?style=for-the-badge)]()

</div>

---

## ⚡ The Vision
Most recipe apps are static lists. This project reimagines meal discovery as a **high-performance interactive experience**. By combining a custom "Cook-Score" algorithm with a physics-based drag-and-drop interface, it solves decision fatigue for hungry users.

---

## 🛠 Engineering Deep Dive

### 🧪 The Cook-Score™ Algorithm
The engine doesn't just search; it evaluates.
* **Weighted Logic:** It calculates a match percentage by comparing `usedIngredientCount` against `missedIngredientCount`.
* **Ranked Priority:** Results are automatically sorted so the recipes requiring the fewest extra trips to the store appear at the top.

### 🥘 Drag-and-Drop Interactive Pantry
Built for a "Creative UI" feel, the app features a custom drag-and-drop system.
* **Seamless Interaction:** Users can drag items like "Chicken" or "Pasta" directly into a digital cooking pot.
* **State Management:** The drop zone provides real-time visual feedback and triggers automatic state updates in the main application logic.

### 🔊 Accessibility & Pro Tooling
* **Voice-Guided Cooking:** A built-in Text-to-Speech (TTS) engine reads cooking steps aloud, allowing for hands-free kitchen operation.
* **Dynamic Servings Scaler:** A real-time recalculation engine. Adjust the serving size, and every ingredient amount updates instantly using original data attributes to maintain mathematical precision.
* **Smart Caching:** Integrated `sessionStorage` caching minimizes API latency and preserves credit limits by storing recipe data locally during a session.

---

## 📡 System Architecture
The project follows a strict **Modular ESM (ECMAScript Modules)** pattern to ensure clean separation of concerns:

| Module | Responsibility |
| :--- | :--- |
| **`api.js`** | Data orchestration and session-based caching. |
| **`ui.js`** | The rendering engine for complex Modals, Toast notifications, and TTS. |
| **`recipes.js`** | Computational logic for scoring and "Lazy Mode" randomization. |
| **`drag.js`** | Isolated event listeners for the drag-and-drop pantry system. |
| **`style.css`** | Glassmorphism design system and 60fps animations. |

---

## 🌌 Interactive Features
* **Lazy Mode:** A "Decision Engine" feature that picks a single high-match recipe for the user when they can't decide.
* **Glassmorphism UI:** A modern aesthetic using `backdrop-filter` and soft gradients for a premium feel.
* **Real-time Toasts:** Instant feedback for every user action, from adding ingredients to API errors.

---

## 🚀 Installation & Setup
1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Abeni0101/What-Should-I-Cook.git](https://github.com/Abeni0101/What-Should-I-Cook.git)
   ```
2. **Configure API Key:**
   Replace the `API_KEY` in `api.js` with your own from the Spoonacular Dashboard.
3. **Launch:**
   Open `index.html` via Live Server for the full ESM experience.

---

## 🧭 Philosophy
> **"Code is the medium, but experience is the message."**

This project was built to demonstrate that even a "simple" recipe app can be an elite piece of software through **performance optimization**, **accessible design**, and **modular architecture**.

---

## 🌐 Connect
**Abenezer Birhanu** - *Creative UI Engineer*

<p align="left">
<a href="https://github.com/Abeni0101"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" /></a>
<a href="mailto:abeni08656@gmail.com"><img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" /></a>
</p>

<img src="https://komarev.com/ghpvc/?username=Abeni0101&label=UPLINK_ESTABLISHED&color=7aa2f7&style=flat-square" align="right" />
<br />
