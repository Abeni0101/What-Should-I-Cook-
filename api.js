const API_KEY = '9b80ed94c6114e6590e3b5c5e735a43e'; 
const BASE_URL = 'https://api.spoonacular.com/recipes';

// Inside api.js
export async function fetchBySettings(options) {
    const { ingredients, diet, cuisine, highProtein, lowCalorie, mustUseItem } = options;
    if (!ingredients || ingredients.length === 0) return [];
    
    const sortedIngs = mustUseItem ? [mustUseItem, ...ingredients.filter(i => i !== mustUseItem)] : ingredients;
    const ingString = sortedIngs.join(',');
    
    let url = `${BASE_URL}/complexSearch?includeIngredients=${ingString}&number=12&addRecipeInformation=true&fillIngredients=true&apiKey=${API_KEY}`;
    
    if (diet) url += `&diet=${diet}`;
    if (cuisine) url += `&cuisine=${cuisine}`; // ADDED THIS LINE
    if (highProtein) url += `&minProtein=25`;
    if (lowCalorie) url += `&maxCalories=500`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.results;
    } catch (error) {
        return null; 
    }
}

export async function fetchRecipeDetails(id) {
    const cacheKey = `recipe_${id}`;
    if (sessionStorage.getItem(cacheKey)) return JSON.parse(sessionStorage.getItem(cacheKey));

    try {
        const response = await fetch(`${BASE_URL}/${id}/information?apiKey=${API_KEY}`);
        const data = await response.json();
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
        return data;
    } catch (error) {
        return null;
    }
}
export async function fetchWinePairing(foodName) {
    try {
        const response = await fetch(`${BASE_URL}/food/wine/pairing?food=${foodName}&apiKey=${API_KEY}`);
        const data = await response.json();
        return data;
    } catch (error) {
        return null;
    }
}