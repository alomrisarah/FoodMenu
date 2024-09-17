document.addEventListener("DOMContentLoaded", function () {
 const apiUrl = "https://www.themealdb.com/api/json/v1/1/filter.php?c="
 const detailsApiUrl = "https://www.themealdb.com/api/json/v1/1/lookup.php?i="
 const filters = document.querySelectorAll(".filter button")
 const dessertsGrid = document.getElementById("food-grid")

 async function fetchData(category) {
  try {
   const response = await fetch(apiUrl + category)
   const data = await response.json()
   console.log("API Response:", data) // Log the API response
   return data.meals || []
  } catch (error) {
   console.error("Error fetching data:", error)
   return []
  }
 }

 async function fetchMealDetails(idMeal) {
  try {
   const response = await fetch(detailsApiUrl + idMeal)
   const data = await response.json()
   return data.meals[0]
  } catch (error) {
   console.error("Error fetching meal details:", error)
   return null
  }
 }

 function createCard(meal) {
  const card = document.createElement("div")
  card.className = "card"
  card.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <h2>${meal.strMeal}</h2>
            <button class="details-btn" data-id="${meal.idMeal}">Details</button>
            <div class="details" id="details-${meal.idMeal}" style="display: none;">
                <p><strong>Ingredients:</strong> Loading...</p>
                <p><strong>Instructions:</strong> Loading...</p>
            </div>
        `
  return card
 }

 function displayMeals(meals) {
  dessertsGrid.innerHTML = "" // Clear previous content
  meals.forEach((meal) => {
   const card = createCard(meal)
   dessertsGrid.appendChild(card)
  })

  document.querySelectorAll(".details-btn").forEach((button) => {
   button.addEventListener("click", async function () {
    const mealId = this.dataset.id
    const detailsDiv = document.getElementById(`details-${mealId}`)
    if (detailsDiv.style.display === "none") {
     // Fetch and display meal details
     const mealDetails = await fetchMealDetails(mealId)
     if (mealDetails) {
      const ingredients = []
      for (let i = 1; i <= 20; i++) {
       const ingredient = mealDetails[`strIngredient${i}`]
       if (ingredient) {
        ingredients.push(ingredient)
       } else {
        break
       }
      }
      detailsDiv.innerHTML = `
                            <p><strong>Ingredients:</strong> ${ingredients.length ? ingredients.join(", ") : "No ingredients available"}</p>
                            <p><strong>Instructions:</strong> ${mealDetails.strInstructions || "No instructions available"}</p>
                        `
     } else {
      detailsDiv.innerHTML = "<p>Error loading details.</p>"
     }
     detailsDiv.style.display = "block"
     this.textContent = "Hide Details"
    } else {
     detailsDiv.style.display = "none"
     this.textContent = "Details"
    }
   })
  })
 }

 async function updateMenu(category) {
  const meals = await fetchData(category)
  displayMeals(meals)
 }

 filters.forEach((button) => {
  button.addEventListener("click", function () {
   const filter = this.dataset.filter
   updateMenu(filter)
  })
 })

 // Initialize with 'all' category
 updateMenu("all")
})
