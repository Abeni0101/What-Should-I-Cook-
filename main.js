import * as api from './api.js';
import * as ui from './ui.js';
import * as logic from './recipes.js';
import { initDragAndDrop } from './drag.js';
import { searchFallbackDB, culturalRecipes } from './culturalDB.js';

let selectedIngredients = [];
let mustUseItem = null;
let currentResults = [];

// Feature: Data Persistence (Load from LocalStorage)
window.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('pantry');
    if (saved) {
        selectedIngredients = JSON.parse(saved);
        renderChips();
    }
});

function saveState() {
    localStorage.setItem('pantry', JSON.stringify(selectedIngredients));
}

initDragAndDrop((ingredient) => addIngredient(ingredient.toLowerCase()));

const input = document.getElementById('ingredient-input');
const form = document.getElementById('ingredient-form');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value.trim() !== "") {
        addIngredient(input.value.trim().toLowerCase());
        input.value = "";
    }
});

function addIngredient(val) {
    if (!selectedIngredients.includes(val)) {
        selectedIngredients.push(val);
        saveState();
        renderChips();
        ui.showToast(`Added ${val} to prep!`, 'success');
    } else {
        ui.showToast(`${val} is already added!`, 'error');
    }
}

function renderChips() {
    const container = document.getElementById('active-ingredients');
    container.innerHTML = selectedIngredients.map(ing => `
        <div class="chip ${mustUseItem === ing ? 'urgent' : ''} animate-in">
            ${ing} 
            <span class="urgent-btn" data-ing="${ing}" title="Mark as Must-Use">🚨</span>
            <span class="remove-btn" data-ing="${ing}">&times;</span>
        </div>
    `).join('');

    container.querySelectorAll('.remove-btn').forEach(btn => {
        btn.onclick = () => {
            selectedIngredients = selectedIngredients.filter(i => i !== btn.dataset.ing);
            if (mustUseItem === btn.dataset.ing) mustUseItem = null;
            saveState();
            renderChips();
        };
    });

    // Feature: Save My Food
    container.querySelectorAll('.urgent-btn').forEach(btn => {
        btn.onclick = () => {
            mustUseItem = mustUseItem === btn.dataset.ing ? null : btn.dataset.ing;
            ui.showToast(mustUseItem ? `${mustUseItem} prioritized!` : 'Priority removed.', 'info');
            renderChips();
        };
    });
}

document.getElementById('search-btn').addEventListener('click', async () => {
    if (selectedIngredients.length === 0) return ui.showToast('Please add ingredients first!', 'error');
    
    ui.showSkeletons();
    
    // Gather all macro/filter states
    const options = {
        ingredients: selectedIngredients,
        diet: document.getElementById('diet-filter').value,
        mustUseItem: mustUseItem,
        highProtein: document.getElementById('macro-protein').checked,
        lowCalorie: document.getElementById('macro-calories').checked
    };
    
    const rawData = await api.fetchBySettings(options);
    if (!rawData) return ui.renderResults([]);

    currentResults = logic.calculateCookScore(rawData, mustUseItem);
    ui.renderResults(currentResults);
});

// Event Delegation for Modals
document.getElementById('recipe-results').addEventListener('click', async (e) => {
    const card = e.target.closest('.recipe-card');
    if (card) {
        const id = card.dataset.id;
        const details = await api.fetchRecipeDetails(id);
        if (details) ui.openModal(details, selectedIngredients);
    }
});

document.querySelector('.close-modal').onclick = () => {
    document.getElementById('recipe-modal').style.display = 'none';
    window.speechSynthesis.cancel();
};

document.getElementById('lazy-mode-btn').onclick = () => {
    if (currentResults.length > 0) {
        ui.renderResults([logic.getRandomLazy(currentResults)]);
        ui.showToast('We picked one for you!', 'success');
    } else {
        ui.showToast('Search for recipes first!', 'error');
    }
};
// The Bailout Button (Eat Out) ---
document.getElementById('bailout-btn').addEventListener('click', () => {
    ui.showToast('Locating best spots near you... 📍', 'info');

    // 1. Determine what they are craving based on their pantry
    let query = "top rated restaurants";
    if (selectedIngredients.length > 0) {
        // Take the top 2 ingredients so the search isn't too broad/weird
        const cravings = selectedIngredients.slice(0, 2).join(' ');
        query = `best ${cravings} food restaurants`;
    }

    // 2. Try to get exact GPS location
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                // Opens native Google Maps app on mobile, or web map on desktop
                const mapUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${lat},${lng},14z`;
                window.open(mapUrl, '_blank');
            },
            (error) => {
                // Fallback if they deny location permissions
                ui.showToast('Location denied. Showing general search.', 'error');
                window.open(`https://www.google.com/maps/search/${encodeURIComponent(query + " near me")}`, '_blank');
            },
            { timeout: 5000 }
        );
    } else {
        // Fallback for older browsers
        window.open(`https://www.google.com/maps/search/${encodeURIComponent(query + " near me")}`, '_blank');
    }
});

document.getElementById('search-btn').addEventListener('click', async () => {
    if (selectedIngredients.length === 0) return ui.showToast('Please add ingredients first!', 'error');
    
    ui.showSkeletons();
    
    const options = {
        ingredients: selectedIngredients,
        diet: document.getElementById('diet-filter').value,
        cuisine: document.getElementById('cuisine-filter').value, // Get the cuisine
        mustUseItem: mustUseItem,
        highProtein: document.getElementById('macro-protein').checked,
        lowCalorie: document.getElementById('macro-calories').checked
    };
    
    let rawData = await api.fetchBySettings(options);

    // FEATURE: The Cultural Rescue! 
    // If the API returns nothing, check our custom Cultural Database
    if (!rawData || rawData.length === 0) {
        rawData = searchFallbackDB(selectedIngredients, options.cuisine);
    }

    if (!rawData || rawData.length === 0) {
        // If STILL nothing, show the "YouTube Rescue" empty state
        return ui.renderEmptyState(selectedIngredients, options.cuisine);
    }

    currentResults = logic.calculateCookScore(rawData, mustUseItem);
    ui.renderResults(currentResults);
});

// Update the modal click listener to handle the custom "ethiopian_doro_wat" ID
document.getElementById('recipe-results').addEventListener('click', async (e) => {
    const card = e.target.closest('.recipe-card');
    if (card) {
        const id = card.dataset.id;
        
        // Check if it's a custom cultural recipe first
        const customRecipe = culturalRecipes.find(r => r.id === id);
        if (customRecipe) {
            return ui.openModal(customRecipe, selectedIngredients);
        }

        // Otherwise, fetch from API normally
        const details = await api.fetchRecipeDetails(id);
        if (details) ui.openModal(details, selectedIngredients);
    }
});