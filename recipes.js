export function calculateCookScore(recipes) {
    if (!recipes) return [];
    
    return recipes.map(recipe => {
        let matchScore = 0;
        
        
        if (recipe.usedIngredientCount !== undefined) {
            const total = recipe.usedIngredientCount + recipe.missedIngredientCount;
            matchScore = total > 0 ? (recipe.usedIngredientCount / total) * 100 : 0;
        } else {
            
            matchScore = Math.random() * 40 + 60; // Fake score between 60-100 for visual demo
        }
        
        return {
            ...recipe,
            cookScore: Math.round(matchScore)
        };
    }).sort((a, b) => b.cookScore - a.cookScore);
}

export function getRandomLazy(recipes) {
    return recipes[Math.floor(Math.random() * recipes.length)];
}