export function renderResults(recipes) {
    const container = document.getElementById('recipe-results');
    
    if (!recipes || recipes.length === 0) {
        container.innerHTML = '<div class="empty-state">No recipes found for these ingredients/diet. Try broadening your search! 🕵️‍♂️</div>';
        return;
    }

    container.innerHTML = recipes.map((recipe, index) => `
        <div class="recipe-card" data-id="${recipe.id}" style="animation-delay: ${index * 0.05}s">
            <div class="card-inner">
                <div class="card-front">
                    <img src="${recipe.image}" alt="${recipe.title}">
                    <div class="card-content">
                        <h3>${recipe.title}</h3>
                        <span class="chip score-chip">Match: ${recipe.cookScore}%</span>
                    </div>
                </div>
                <div class="card-back">
                    <h2>${recipe.cookScore}% Match!</h2>
                    <p>Health Score: ${recipe.healthScore || 'N/A'}</p>
                    <p>Ready in ${recipe.readyInMinutes || '?'} mins</p>
                    <button class="action-btn mt-10 pointer-events-none">Click to Cook 👨‍🍳</button>
                </div>
            </div>
        </div>
    `).join('');
}

export function showSkeletons() {
    const container = document.getElementById('recipe-results');
    container.innerHTML = Array(6).fill('<div class="skeleton"></div>').join('');
}

export function openModal(data) {
    const modal = document.getElementById('recipe-modal');
    const body = document.getElementById('modal-body');

    const badges = `
        <div class="diet-badges">
            ${data.vegan ? '<span class="badge vegan">Vegan</span>' : ''}
            ${data.vegetarian ? '<span class="badge vegetarian">Vegetarian</span>' : ''}
            ${data.glutenFree ? '<span class="badge gluten-free">Gluten Free</span>' : ''}
            ${data.veryHealthy ? '<span class="badge healthy">Healthy</span>' : ''}
        </div>
    `;

    // Map ingredients with data-original attributes for the scaler logic
    const ingredientsHTML = data.extendedIngredients.map(ing => `
        <li class="ingredient-item">
            <input type="checkbox">
            <span>
                <strong class="ingredient-amount" data-original="${ing.amount}">
                    ${parseFloat(ing.amount).toFixed(1).replace(/\.0$/, '')}
                </strong> 
                <strong>${ing.unit}</strong> ${ing.name}
            </span>
        </li>
    `).join('');

    const steps = data.analyzedInstructions[0]?.steps || [];
    const stepsHTML = steps.map(step => `
        <div class="step-item">
            <div class="step-number">${step.number}</div>
            <div class="step-text">${step.step}</div>
        </div>
    `).join('') || "<p>No detailed steps provided for this recipe.</p>";

    body.innerHTML = `
        <div class="modal-header">
            <h1>${data.title}</h1>
            ${badges}
        </div>

        <img src="${data.image}" class="modal-hero-img">

        <div class="recipe-stats-bar glass-panel">
            <div class="stat-item"><span>${data.readyInMinutes}</span> MINS</div>
            <div class="stat-item"><span>${data.healthScore}</span> HEALTH</div>
            <div class="stat-item"><span>${Math.round(data.pricePerServing || 0)}¢</span> /SERV</div>
        </div>
        
        <div class="scaler-tool">
            <label>Adjust Servings:</label>
            <button id="btn-dec-servings" class="scale-btn">-</button>
            <span id="current-servings">${data.servings}</span>
            <button id="btn-inc-servings" class="scale-btn">+</button>
        </div>

        <div class="recipe-content-grid">
            <aside>
                <h3>Ingredients</h3>
                <ul class="ingredients-list">${ingredientsHTML}</ul>
            </aside>
            <article>
                <div class="flex-between">
                    <h3>Cooking Steps</h3>
                    ${steps.length > 0 ? `<button id="tts-btn" class="action-btn small">🔊 Read Steps</button>` : ''}
                </div>
                <div class="steps-container">${stepsHTML}</div>
            </article>
        </div>
    `;

    modal.style.display = 'flex'; // Use flex for centering

    // --- PRO FEATURE: Encapsulated Event Listeners ---
    // Servings Scaler Logic (No global variables!)
    let currentServings = data.servings;
    const originalServings = data.servings;

    const updateServingsUI = (newServings) => {
        if (newServings < 1) return;
        currentServings = newServings;
        document.getElementById('current-servings').innerText = currentServings;
        
        document.querySelectorAll('.ingredient-amount').forEach(node => {
            const originalAmt = parseFloat(node.dataset.original);
            const scaledAmt = (originalAmt * (currentServings / originalServings));
            node.innerText = scaledAmt.toFixed(1).replace(/\.0$/, ''); // Keeps it clean (e.g., 1.5 instead of 1.50)
        });
    };

    document.getElementById('btn-inc-servings').onclick = () => updateServingsUI(currentServings + 1);
    document.getElementById('btn-dec-servings').onclick = () => updateServingsUI(currentServings - 1);

    // TTS Logic
    const ttsBtn = document.getElementById('tts-btn');
    if (ttsBtn) {
        ttsBtn.onclick = () => {
            const synth = window.speechSynthesis;
            if (synth.speaking) {
                synth.cancel(); // Stop if already playing
                ttsBtn.innerText = "🔊 Read Steps";
                return;
            }
            ttsBtn.innerText = "⏹ Stop Reading";
            const textToRead = steps.map(s => `Step ${s.number}: ${s.step}`).join('. ');
            const utterance = new SpeechSynthesisUtterance(textToRead);
            utterance.rate = 0.9;
            utterance.onend = () => ttsBtn.innerText = "🔊 Read Steps";
            synth.speak(utterance);
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