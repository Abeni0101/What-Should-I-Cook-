import { SUBSTITUTIONS } from './recipes.js';

export function renderResults(recipes) {
    const container = document.getElementById('recipe-results');
    
    if (!recipes || recipes.length === 0) {
        container.innerHTML = '<div class="empty-state">No recipes found. Try broadening your search! 🕵️‍♂️</div>';
        return;
    }
    container.innerHTML = recipes.map((recipe, index) => {
    // Spoonacular returns price in cents (e.g., 250 = $2.50)
    const priceInDollars = recipe.pricePerServing ? (recipe.pricePerServing / 100).toFixed(2) : null;
    const isBudget = recipe.pricePerServing && recipe.pricePerServing < 300; // Under $3.00
    
    return `
        <div class="recipe-card" data-id="${recipe.id}" style="animation-delay: ${index * 0.05}s">
            <div class="card-inner">
                <div class="card-front">
                    ${isBudget ? `<div style="position:absolute; top:10px; left:10px; background:#48bb78; color:white; padding:4px 8px; border-radius:8px; font-size:0.8rem; font-weight:bold; z-index:2;">💰 Under $3/Serving</div>` : ''}
                    <img src="${recipe.image}" alt="${recipe.title}">
                    <div class="card-content">
                        <h3>${recipe.title}</h3>
                        ${recipe.cookScore !== undefined ? `<span class="chip score-chip">${recipe.cookScore}% Match</span>` : ''}
                    </div>
                </div>
                <div class="card-back">
                    <h2>${recipe.cookScore}% Match!</h2>
                    <p>Missing: ${recipe.missedIngredientCount || 0} items</p>
                    <p>Ready in ${recipe.readyInMinutes || '?'} mins</p>
                    ${priceInDollars ? `<p>Cost: $${priceInDollars} per serving</p>` : ''}
                    <button class="action-btn mt-10 pointer-events-none">View Recipe 👨‍🍳</button>
                </div>
            </div>
        </div>
    `;
}).join('');

    container.innerHTML = recipes.map((recipe, index) => `
        <div class="recipe-card" data-id="${recipe.id}" style="animation-delay: ${index * 0.05}s">
            <div class="card-inner">
                <div class="card-front">
                    <img src="${recipe.image}" alt="${recipe.title}">
                    <div class="card-content">
                        <h3>${recipe.title}</h3>
                        ${recipe.cookScore !== undefined ? `<span class="chip score-chip">${recipe.cookScore}% Match</span>` : ''}
                    </div>
                </div>
                <div class="card-back">
                    <h2>${recipe.cookScore}% Match!</h2>
                    <p>Missing: ${recipe.missedIngredientCount || 0} items</p>
                    <p>Ready in ${recipe.readyInMinutes || '?'} mins</p>
                    <button class="action-btn mt-10 pointer-events-none">View Recipe 👨‍🍳</button>
                </div>
            </div>
        </div>
    `).join('');
}

export function showSkeletons() {
    const container = document.getElementById('recipe-results');
    container.innerHTML = Array(6).fill(`
        <div class="skeleton-card">
            <div class="skeleton-img"></div>
            <div class="skeleton-text line-1"></div>
            <div class="skeleton-text line-2"></div>
        </div>
    `).join('');
}

export function openModal(data, selectedIngredients) {
    const modal = document.getElementById('recipe-modal');
    const body = document.getElementById('modal-body');

    // Calculate actual missing items based on detailed ingredients
    const missingItems = [];
    const ingredientsHTML = data.extendedIngredients.map(ing => {
        const isMissing = !selectedIngredients.some(userIng => ing.name.toLowerCase().includes(userIng));
        if (isMissing) missingItems.push(ing.name);
        
        // Smart Substitutions Check
        let subBtn = '';
        const foundSub = Object.keys(SUBSTITUTIONS).find(key => ing.name.toLowerCase().includes(key));
        if (isMissing && foundSub) {
            subBtn = `<button class="sub-btn" data-sub="${SUBSTITUTIONS[foundSub]}">🔄 Sub</button>`;
        }

        return `
        <li class="ingredient-item ${isMissing ? 'missing' : 'owned'}">
            <input type="checkbox">
            <span>
                <strong class="ingredient-amount" data-original="${ing.amount}">
                    ${parseFloat(ing.amount).toFixed(1).replace(/\.0$/, '')}
                </strong> 
                <strong>${ing.unit}</strong> ${ing.name}
            </span>
            ${subBtn}
        </li>`;
    }).join('');

    const steps = data.analyzedInstructions[0]?.steps || [];
    const stepsHTML = steps.map(step => `
        <div class="step-item" id="step-${step.number}">
            <div class="step-number">${step.number}</div>
            <div class="step-text">${step.step}</div>
        </div>
    `).join('') || "<p>No detailed steps provided.</p>";
    
    // Add this right before building the body.innerHTML
const uniqueEquipment = new Set();
steps.forEach(step => {
    if (step.equipment) {
        step.equipment.forEach(eq => uniqueEquipment.add(eq.name));
    }
});
const equipmentList = Array.from(uniqueEquipment);

const equipmentHTML = equipmentList.length > 0 
    ? `<div class="equipment-radar" style="margin-bottom: 15px; padding: 10px; background: #edf2f7; border-radius: 8px;">
        <strong>🛠 Required Gear:</strong> ${equipmentList.join(', ')}
       </div>`
    : '';

// Then inject ${equipmentHTML} into your modal body (e.g., right above the ingredients list)
    body.innerHTML = `
        // Add the YouTube button to the modal-header
    <div class="modal-header">
        <div class="flex-between w-100">
            <h1>${data.title}</h1>
            <div style="display:flex; gap: 10px;">
                <a href="https://www.youtube.com/results?search_query=How+to+cook+${encodeURIComponent(data.title)}" 
                target="_blank" 
                class="glow-btn small" 
                style="text-decoration: none; border-color: #e53e3e; color: #e53e3e;">
                📺 Watch on YouTube
                </a>
                <button id="export-list-btn" class="glow-btn small">🛒 Export Grocery List</button>
            </div>
        </div>
    </div>
        <img src="${data.image}" class="modal-hero-img">
        <div class="scaler-tool">
            <label>Adjust Servings:</label>
            <button id="btn-dec-servings" class="scale-btn">-</button>
            <span id="current-servings">${data.servings}</span>
            <button id="btn-inc-servings" class="scale-btn">+</button>
        </div>
        <div class="recipe-content-grid">
            <aside>
                <h3>Ingredients (<span style="color:#e53e3e">Red</span> = Missing)</h3>
                <ul class="ingredients-list">${ingredientsHTML}</ul>
            </aside>
            <article>
                <div class="flex-between mb-10">
                    <h3>Cooking Steps</h3>
                    ${steps.length > 0 ? `<button id="hands-free-btn" class="action-btn small">🎤 Hands-Free Mode</button>` : ''}
                </div>
                <div class="steps-container">${stepsHTML}</div>
            </article>
        </div>
    `;
    // Check if Spoonacular returned a built-in wine pairing for this recipe
let wineHTML = '';
if (data.winePairing && data.winePairing.pairedWines && data.winePairing.pairedWines.length > 0) {
    const wineText = data.winePairing.pairingText;
    const topWine = data.winePairing.productMatches[0];
    
    wineHTML = `
        <div class="wine-pairing glass-panel" style="margin-top: 20px; padding: 15px; border-left: 4px solid #805ad5;">
            <h3 style="color: #805ad5; margin-bottom: 5px;">🍷 Sommelier Pairing</h3>
            <p style="font-size: 0.9rem; color: #4a5568;">${wineText}</p>
            ${topWine ? `<a href="${topWine.link}" target="_blank" style="font-size: 0.85rem; font-weight: bold; color: #805ad5; text-decoration: none;">Buy ${topWine.title}</a>` : ''}
        </div>
    `;
}

    modal.style.display = 'flex';

    // Feature: Scaler
    let currentServings = data.servings;
    const updateServings = (newServings) => {
        if (newServings < 1) return;
        currentServings = newServings;
        document.getElementById('current-servings').innerText = currentServings;
        document.querySelectorAll('.ingredient-amount').forEach(node => {
            const scaled = (parseFloat(node.dataset.original) * (currentServings / data.servings));
            node.innerText = scaled.toFixed(1).replace(/\.0$/, '');
        });
    };
    document.getElementById('btn-inc-servings').onclick = () => updateServings(currentServings + 1);
    document.getElementById('btn-dec-servings').onclick = () => updateServings(currentServings - 1);

    // Feature: Export Grocery List
    document.getElementById('export-list-btn').onclick = () => {
        if (missingItems.length === 0) return showToast("You have all ingredients!", "success");
        const list = `🛒 Grocery List for ${data.title}:\n` + missingItems.map(i => `▢ ${i}`).join('\n');
        navigator.clipboard.writeText(list);
        showToast("Grocery List copied to clipboard!", "success");
    };

    // Feature: Show Substitutions
    document.querySelectorAll('.sub-btn').forEach(btn => {
        btn.onclick = (e) => {
            const li = e.target.closest('li');
            const p = document.createElement('p');
            p.className = 'sub-text';
            p.innerText = `💡 Substitute: ${e.target.dataset.sub}`;
            li.appendChild(p);
            e.target.remove();
        };
    });

    // Feature: Dirty Hands Voice Control
    const hfBtn = document.getElementById('hands-free-btn');
    let recognition;
    let currentStepIndex = 0;

    if (hfBtn) {
        hfBtn.onclick = () => {
            if (!('webkitSpeechRecognition' in window)) return showToast("Voice not supported in this browser.", "error");
            
            if (hfBtn.classList.contains('listening')) {
                recognition.stop();
                window.speechSynthesis.cancel();
                hfBtn.classList.remove('listening');
                hfBtn.innerText = "🎤 Hands-Free Mode";
                return;
            }

            hfBtn.classList.add('listening');
            hfBtn.innerText = "🛑 Stop Listening";
            showToast("Say 'Next', 'Back', or 'Read'!", "info");

            recognition = new webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = false;

            const readStep = (index) => {
                window.speechSynthesis.cancel();
                document.querySelectorAll('.step-item').forEach(el => el.style.background = 'white');
                const stepEl = document.getElementById(`step-${steps[index].number}`);
                stepEl.style.background = '#feebc8'; // Highlight current
                stepEl.scrollIntoView({ behavior: "smooth", block: "center" });

                const utterance = new SpeechSynthesisUtterance(steps[index].step);
                window.speechSynthesis.speak(utterance);
            };

            recognition.onresult = (event) => {
                const command = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
                if (command.includes('next') && currentStepIndex < steps.length - 1) {
                    currentStepIndex++; readStep(currentStepIndex);
                } else if (command.includes('back') && currentStepIndex > 0) {
                    currentStepIndex--; readStep(currentStepIndex);
                } else if (command.includes('read') || command.includes('repeat')) {
                    readStep(currentStepIndex);
                }
            };
            recognition.start();
        };
    }
}

export function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerText = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
// Inside ui.js
export function renderEmptyState(ingredients, cuisine) {
    const container = document.getElementById('recipe-results');
    const query = `${cuisine ? cuisine + ' ' : ''}${ingredients.join(' ')} recipe`;
    const youtubeLink = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

    container.innerHTML = `
        <div class="empty-state glass-panel" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
            <h2 style="font-size: 2rem; margin-bottom: 10px;">🌍 We couldn't find an exact match!</h2>
            <p style="color: #4a5568; margin-bottom: 20px;">
                Our recipe database is still learning about diverse global cuisines. 
                But don't worry, the best authentic chefs are on YouTube!
            </p>
            <a href="${youtubeLink}" target="_blank" class="action-btn" style="text-decoration: none; display: inline-block;">
                📺 Search "${query}" on YouTube
            </a>
        </div>
    `;
}