// culturalDB.js
export const culturalRecipes = [
    {
        id: "ethiopian_doro_wat",
        title: "Authentic Ethiopian Doro Wat (Spicy Chicken Stew)",
        image: "https://www.daringgourmet.com/wp-content/uploads/2019/12/Doro-Wat-4-square.jpg",
        cuisine: "African",
        readyInMinutes: 120,
        servings: 6,
        pricePerServing: 250,
        cookScore: 98,
        missedIngredientCount: 0, // Mocked for UI
        extendedIngredients: [
            { name: "Chicken legs and thighs", amount: 3, unit: "lbs" },
            { name: "Red onions (finely minced)", amount: 4, unit: "large" },
            { name: "Berbere spice blend", amount: 0.5, unit: "cup" },
            { name: "Niter Kibbeh (spiced clarified butter)", amount: 0.5, unit: "cup" },
            { name: "Hard-boiled eggs", amount: 6, unit: "whole" },
            { name: "Garlic (minced)", amount: 2, unit: "tbsp" },
            { name: "Ginger (minced)", amount: 1, unit: "tbsp" }
        ],
        analyzedInstructions: [{
            steps: [
                { number: 1, step: "Dry-cook the finely minced onions in a heavy pot over medium-low heat for 45-60 minutes until they reduce to a dark, caramelized paste. Do not add oil yet!" },
                { number: 2, step: "Add the Niter Kibbeh (spiced butter) and sauté the onions for another 10 minutes." },
                { number: 3, step: "Stir in the Berbere spice, garlic, and ginger. Cook for 15 minutes, adding a splash of water if it sticks." },
                { number: 4, step: "Add the chicken pieces. Coat them in the sauce, cover, and simmer on low for 45 minutes until tender." },
                { number: 5, step: "Score the hard-boiled eggs with a knife and gently stir them into the stew. Simmer for 5 more minutes." },
                { number: 6, step: "Serve hot with fresh Injera." }
            ]
        }],
        winePairing: { pairingText: "A light, slightly sweet Tej (Ethiopian Honey Wine) or an off-dry Riesling balances the intense heat of the Berbere spice beautifully." }
    }
    // You can add Shiro Wat, Tibs, or Nigerian Jollof here later!
];

// Function to search this fallback DB
export function searchFallbackDB(ingredients, cuisine) {
    return culturalRecipes.filter(recipe => {
        // Match by cuisine if selected
        if (cuisine && recipe.cuisine.toLowerCase() !== cuisine.toLowerCase()) return false;
        
        // Match by ingredients
        const matchesIng = ingredients.some(ing => 
            recipe.title.toLowerCase().includes(ing) || 
            recipe.extendedIngredients.some(e => e.name.toLowerCase().includes(ing))
        );
        return matchesIng;
    });
}