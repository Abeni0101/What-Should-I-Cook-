import * as api from './api.js';
import * as ui from './ui.js';
import * as logic from './recipes.js';
import { initDragAndDrop } from './drag.js';

let selectedIngredients = [];
let currentResults = [];

// Initialize Drag and Drop with a callback to add ingredients
initDragAndDrop((ingredient) => {
    addIngredient(ingredient);
});

// 1. Handle Ingredient Input
const input = document.getElementById('ingredient-input');
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && input.value.trim() !== "") {
        addIngredient(input.value.trim().toLowerCase());
        input.value = "";
    }
});
// 1. Handle Ingredient Input (Mobile & Desktop Safe)
const form = document.getElementById('ingredient-form');

form.addEventListener('submit', (e) => {
    e.preventDefault(); // Stops the page from refreshing
    
    if (input.value.trim() !== "") {
        addIngredient(input.value.trim().toLowerCase());
        input.value = "";
    }
    
    // Optional: Keep focus on input for rapid typing on desktop, 
    // but on mobile, you might want it to drop the keyboard.
    if (window.innerWidth > 768) {
        input.focus();
    } else {
        input.blur(); // Drops the mobile keyboard so they can see results
    }
});

function addIngredient(val) {
    if (!selectedIngredients.includes(val)) {
        selectedIngredients.push(val);
        renderChips();
        ui.showToast(`Added ${val} to prep!`, 'success');
    } else {
        ui.showToast(`${val} is already added!`, 'error');
    }
}

// 2. Render Ingredient Chips
function renderChips() {
    const container = document.getElementById('active-ingredients');
    container.innerHTML = selectedIngredients.map(ing => `
        <div class="chip animate-in">
            ${ing} <span data-ing="${ing}">&times;</span>
        </div>
    `).join('');

    container.querySelectorAll('span').forEach(btn => {
        btn.onclick = () => {
            selectedIngredients = selectedIngredients.filter(i => i !== btn.dataset.ing);
            renderChips();
        };
    });
}

// 3. Fetch Logic tied to Search Button (Saves API limits & allows filter changes)
document.getElementById('search-btn').addEventListener('click', async () => {
    if (selectedIngredients.length === 0) {
        ui.showToast('Please add ingredients first!', 'error');
        return;
    }
    
    ui.showSkeletons();
    const diet = document.getElementById('diet-filter').value;
    
    const rawData = await api.fetchBySettings(selectedIngredients, diet);
    
    if (rawData === null) {
        ui.showToast('API Error. Check console or API limits.', 'error');
        ui.renderResults([]);
        return;
    }

    currentResults = logic.calculateCookScore(rawData);
    ui.renderResults(currentResults);
});

// 4. Modal Trigger (Event Delegation)
document.getElementById('recipe-results').addEventListener('click', async (e) => {
    const card = e.target.closest('.recipe-card');
    if (card) {
        const id = card.dataset.id;
        // In complexSearch with addRecipeInformation=true, we might already have details!
        const existingRecipe = currentResults.find(r => r.id.toString() === id);
        
        if (existingRecipe && existingRecipe.analyzedInstructions) {
            ui.openModal(existingRecipe);
        } else {
            // Fallback fetch if data is missing
            const details = await api.fetchRecipeDetails(id);
            ui.openModal(details);
        }
    }
});

// 5. Close Modal
document.querySelector('.close-modal').onclick = () => {
    document.getElementById('recipe-modal').style.display = 'none';
    window.speechSynthesis.cancel(); // Stop reading if closed
};

// 6. Lazy Mode
document.getElementById('lazy-mode-btn').onclick = () => {
    if (currentResults.length > 0) {
        const lazy = logic.getRandomLazy(currentResults);
        ui.renderResults([lazy]);
        ui.showToast('We picked one for you!', 'success');
    } else {
        ui.showToast('Search for recipes first!', 'error');
    }
};