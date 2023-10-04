const edamamAppId = "2f4013c4";
const edamamAppKey = "173b04b81fbfda990d7c78c089bb5569";

function searchRecipesByIngredients() {
    const ingredients = document.getElementById("ingredientInput").value;
    const apiUrl = `https://api.edamam.com/search?q=${encodeURIComponent(ingredients)}&app_id=${edamamAppId}&app_key=${edamamAppKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const recipeList = document.querySelector(".recipe-list");
            recipeList.innerHTML = "";

            if (data.hits && data.hits.length > 0) {
                data.hits.forEach(recipe => {
                    const recipeInfo = recipe.recipe;

                    let healthinessClass;
                    const caloriesPerServing = recipeInfo.calories / recipeInfo.yield;

                    if (caloriesPerServing < 200) {
                        healthinessClass = "healthy";
                    } else if (caloriesPerServing < 400) {
                        healthinessClass = "moderate";
                    } else {
                        healthinessClass = "less-healthy";
                    }

                    recipeItem(recipeInfo, healthinessClass);
                });
            } else {
                recipeList.innerHTML = "No results found. Try different ingredients.";
            }
        })
        .catch(error => {
            console.error("Error fetching recipe data:", error);
        });
}

let nextPage = 1;

function loadMoreRecipes() {
    const popularRecipesUrl = `https://api.edamam.com/search?q=popular&app_id=${edamamAppId}&app_key=${edamamAppKey}&from=${nextPage * 10}&to=${(nextPage + 1) * 10}`;

    fetch(popularRecipesUrl)
        .then(response => response.json())
        .then(data => {
            const popularRecipeList = document.getElementById("popular-recipes");

            if (data.hits && data.hits.length > 0) {
                data.hits.forEach(recipe => {
                    const recipeInfo = recipe.recipe;

                    let healthinessClass;
                    const caloriesPerServing = recipeInfo.calories / recipeInfo.yield;

                    if (caloriesPerServing < 200) {
                        healthinessClass = "healthy";
                    } else if (caloriesPerServing < 400) {
                        healthinessClass = "moderate";
                    } else {
                        healthinessClass = "less-healthy";
                    }

                    recipeItem(recipeInfo, healthinessClass);
                });

                nextPage++; 
            } else {
                document.querySelector(".load-more-btn").style.display = "none";
            }
        })
        .catch(error => {
            console.error("Error fetching popular recipe data:", error);
        });
}

document.addEventListener("DOMContentLoaded", loadMoreRecipes);

document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

function recipeItem(recipeInfo, healthinessClass) {
    const recipeList = document.getElementById("popular-recipes");

    const recipeCard = document.createElement("div");
    recipeCard.classList.add("max-w-sm", "border", "border-gray-200", "rounded-lg", "shadow", "dark:bg-gray-800", "dark:border-gray-700", "recipe-card-border");

    recipeCard.innerHTML = `
        <a href="${recipeInfo.url}">
            <img class="rounded-t-lg" src="${recipeInfo.image}" alt="${recipeInfo.label}" />
        </a>
        <div class="p-5">
            <a href="${recipeInfo.url}">
                <h3 class="mb-2 text-2xl font-bold tracking-tight text-white-900 dark:text-white font-light-purple">${recipeInfo.label}</h3>
            </a>
            <p class="mb-3 font-normal text-white-700 dark:text-white-400">Calories: ${recipeInfo.calories.toFixed(2)}</p>
            <p class="mb-3 font-normal text-white-700 dark:text-white-400">Servings: ${recipeInfo.yield}</p>
            <p class="mb-3 font-normal text-white-700 dark:text-white-400">Healthiness: 
                <span class="traffic-light-circle ${healthinessClass}-circle"></span>
                <span class="${healthinessClass}">${healthinessClass}</span>
            </p>
            <p class="mb-3 font-normal text-white-700 dark:text-white-400">${recipeInfo.dishType ? 'Category: ' + recipeInfo.dishType : 'Description: N/A'}</p>
            <a href="${recipeInfo.url}" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-purple-700 rounded-lg hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800 color-purple recipe-card-btn">Read Recipe</a>
        </div>
    `;

    const cardContainer = document.createElement("div");
    cardContainer.classList.add("mb-4", "flex", "justify-center");
    cardContainer.appendChild(recipeCard);

    recipeList.appendChild(cardContainer);
}