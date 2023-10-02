        const edamamAppId = "2f4013c4";
        const edamamAppKey = "173b04b81fbfda990d7c78c089bb5569";
        // OKAY, NOW THIS IS IS STRAIGHT UP UNACCEPTABLE.
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

                            // Determine the healthiness category based on your criteria
                            let healthinessClass;
                            const caloriesPerServing = recipeInfo.calories / recipeInfo.yield;

                            if (caloriesPerServing < 200) {
                                healthinessClass = "healthy";
                            } else if (caloriesPerServing < 400) {
                                healthinessClass = "moderate";
                            } else {
                                healthinessClass = "less-healthy";
                            }

                            const recipeItem = document.createElement("div");
                            recipeItem.classList.add("recipe-item");
                            recipeItem.innerHTML = `
                                <center>
                                    <h3>${recipeInfo.label}</h3>
                                    <img class="recipe-image" src="${recipeInfo.image}" alt="${recipeInfo.label}"></center><br>
                                    <p>Calories: ${recipeInfo.calories.toFixed(2)}</p>
                                    <p>Servings: ${recipeInfo.yield}</p>
                                    <p>Healthiness: 
                                        <span class="traffic-light-circle ${healthinessClass}-circle"></span>
                                        <span class="${healthinessClass}">${healthinessClass}</span>
                                    </p>
                                    <p>${recipeInfo.dishType ? 'Category: ' + recipeInfo.dishType : 'Description: N/A'}</p>
                                    <a href="${recipeInfo.url}" target="_blank">View Recipe</a>
                                
                            `;
                            recipeList.appendChild(recipeItem);
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

                            // Determine the healthiness category based on your criteria
                            let healthinessClass;
                            const caloriesPerServing = recipeInfo.calories / recipeInfo.yield;

                            if (caloriesPerServing < 200) {
                                healthinessClass = "healthy";
                            } else if (caloriesPerServing < 400) {
                                healthinessClass = "moderate";
                            } else {
                                healthinessClass = "less-healthy";
                            }

                            const recipeItem = document.createElement("div");
                            recipeItem.classList.add("recipe-item");
                            recipeItem.innerHTML = `
                                <center>
                                    <h3>${recipeInfo.label}</h3>
                                    <img class="recipe-image" src="${recipeInfo.image}" alt="${recipeInfo.label}"></center><br>
                                    <p>Calories: ${recipeInfo.calories.toFixed(2)}</p>
                                    <p>Servings: ${recipeInfo.yield}</p>
                                    <p>Healthiness: 
                                        <span class="traffic-light-circle ${healthinessClass}-circle"></span>
                                        <span class="${healthinessClass}">${healthinessClass}</span>
                                    </p>
                                    <p>${recipeInfo.dishType ? 'Category: ' + recipeInfo.dishType : 'Description: N/A'}</p>
                                    <a href="${recipeInfo.url}" target="_blank">View Recipe</a>
                                
                            `;
                            popularRecipeList.appendChild(recipeItem);
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