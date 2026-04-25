// Feature: Invisible Staples Exemption
const STAPLES = ['salt', 'pepper', 'water', 'olive oil', 'garlic', 'garlic powder', 'butter', 'sugar', 'flour', 'vegetable oil'];

export function calculateCookScore(recipes, mustUseItem) {
    if (!recipes) return [];
    
    return recipes.map(recipe => {
        let matchScore = 0;
        
        if (recipe.usedIngredientCount !== undefined) {
            // Filter out missing ingredients that are just staples
            const trueMissing = recipe.missedIngredients.filter(
                ing => !STAPLES.some(staple => ing.name.toLowerCase().includes(staple))
            );
            
            const trueMissedCount = trueMissing.length;
            const totalRequired = recipe.usedIngredientCount + trueMissedCount;
            
            matchScore = totalRequired > 0 ? (recipe.usedIngredientCount / totalRequired) * 100 : 100;
            
            // Feature: Save My Food Penalty
            if (mustUseItem) {
                const usesUrgentItem = recipe.usedIngredients.some(ing => ing.name.toLowerCase().includes(mustUseItem));
                if (!usesUrgentItem) matchScore = matchScore * 0.5; // Cut score in half if it ignores the expiring item
            }
        }
        
        return {
            ...recipe,
            cookScore: Math.round(matchScore),
            trueMissingIngredients: recipe.missedIngredients // Pass true missing to UI
        };
    }).sort((a, b) => b.cookScore - a.cookScore); // Rank highest score first
}

export function getRandomLazy(recipes) {
    return recipes[Math.floor(Math.random() * recipes.length)];
}

// Feature: Local Smart Substitutions (Saves API limits)
export const SUBSTITUTIONS = {
    'buttermilk': '1 cup milk + 1 tbsp lemon juice',
    'heavy cream': '3/4 cup milk + 1/4 cup melted butter',
    'baking powder': '1/4 tsp baking soda + 1/2 tsp cream of tartar',
    'egg': '1/4 cup applesauce OR 1 tbsp flaxseed + 3 tbsp water',
    'brown sugar': '1 cup white sugar + 1 tbsp molasses',
    'soy sauce': 'tamari OR worcestershire sauce',
    'sour cream': 'plain greek yogurt'
};