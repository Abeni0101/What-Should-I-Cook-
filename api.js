// const API_KEY = 'c8248126f8d0469fa03b1e6a89d26076'; 
const API_KEY = '075b4b48c9bf4558855d9bd4123c803f'; 
const BASE_URL = 'https://api.spoonacular.com/recipes';

export async function fetchBySettings(ingredients, diet) {
    if (!ingredients || ingredients.length === 0) return [];
    
    const ingString = ingredients.join(',');
    let url = `${BASE_URL}/complexSearch?includeIngredients=${ingString}&number=12&addRecipeInformation=true&fillIngredients=true&apiKey=${API_KEY}`;
    
    if (diet) {
        url += `&diet=${diet}`;
    }

    
    const cacheKey = `search_${ingString}_${diet}`;
    if (sessionStorage.getItem(cacheKey)) {
        return JSON.parse(sessionStorage.getItem(cacheKey));
    }
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        
        
        sessionStorage.setItem(cacheKey, JSON.stringify(data.results));
        return data.results;
    } catch (error) {
        console.error("API Error:", error);
        return null; 
    }
}

export async function fetchRecipeDetails(id) {
    const cacheKey = `recipe_${id}`;
    if (sessionStorage.getItem(cacheKey)) {
        return JSON.parse(sessionStorage.getItem(cacheKey));
    }

    try {
        const url = `${BASE_URL}/${id}/information?apiKey=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
        return data;
    } catch (error) {
        console.error("Failed to fetch details", error);
        return null;
    }
}