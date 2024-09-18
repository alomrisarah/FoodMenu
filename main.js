document.addEventListener("DOMContentLoaded", function () {
 const apiUrl = "https://www.themealdb.com/api/json/v1/1/filter.php?c="
 const filters = document.querySelectorAll(".filter button")
 const foodGrid = document.getElementById("food-grid")

 // Fetch data from the API
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

 // Create a card for each meal
 function createCard(meal) {
  const card = document.createElement("div")
  card.className = "card"
  card.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <h2>${meal.strMeal}</h2>
            <a href="details.html?id=${meal.idMeal}" class="details-btn">Details</a>
            <a href="#contacts" class="btn-primary">Order</a>

        `
  return card
 }

 // Display meals in the grid
 function displayMeals(meals) {
  foodGrid.innerHTML = ""
  meals.forEach((meal) => {
   const card = createCard(meal)
   foodGrid.appendChild(card)
  })
 }

 // Update menu based on selected category
 async function updateMenu(category) {
  const meals = await fetchData(category)
  displayMeals(meals)
 }

 // Filter buttons event listeners
 filters.forEach((button) => {
  button.addEventListener("click", function () {
   const filter = this.dataset.filter
   updateMenu(filter)
  })
 })

 // Initial load
 updateMenu("all")
})

/* /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

document.addEventListener("DOMContentLoaded", function () {
 const confirmBtn = document.getElementById("confirm-btn")
 const confirmationMessage = document.getElementById("confirmation-message")

 if (confirmBtn) {
  confirmBtn.addEventListener("click", function () {
   confirmationMessage.style.display = "block"

   setTimeout(function () {
    confirmationMessage.style.display = "none"
   }, 3000)
  })
 } else {
  console.warn("Confirm button not found.")
 }
})

/* /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */

document.addEventListener("DOMContentLoaded", async function () {
 const detailsApiUrl = "https://www.themealdb.com/api/json/v1/1/lookup.php?i="

 // Function to get the meal ID from the URL query string
 function getMealIdFromUrl() {
  const params = new URLSearchParams(window.location.search)
  return params.get("id") // Retrieves the 'id' from the query string
 }

 // Function to fetch meal details based on the meal ID
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

 // Function to display meal details on the page
 function displayMealDetails(meal) {
  if (!meal) {
   document.getElementById("meal-details").innerHTML = "<p>Error loading meal details.</p>"
   return
  }

  // Set meal name, image, and instructions
  document.getElementById("meal-name").textContent = meal.strMeal
  document.getElementById("meal-image").src = meal.strMealThumb
  document.getElementById("meal-instructions").textContent = meal.strInstructions || "No instructions available."

  // Display ingredients
  const ingredientsList = document.getElementById("meal-ingredients")
  ingredientsList.innerHTML = "" // Clear previous ingredients
  for (let i = 1; i <= 20; i++) {
   const ingredient = meal[`strIngredient${i}`]
   const measure = meal[`strMeasure${i}`]
   if (ingredient && ingredient.trim()) {
    const listItem = document.createElement("li")
    listItem.textContent = `${measure ? measure : ""} ${ingredient}`
    ingredientsList.appendChild(listItem)
   } else {
    break
   }
  }
 }

 // Get the meal ID from the URL and fetch meal details
 const mealId = getMealIdFromUrl()
 if (mealId) {
  const mealDetails = await fetchMealDetails(mealId)
  displayMealDetails(mealDetails)
 } else {
  document.getElementById("meal-details").innerHTML = "<p>Invalid meal ID.</p>"
 }

 // Back button event listener to return to the previous page
 const backBtn = document.getElementById("back-btn")
 if (backBtn) {
  backBtn.addEventListener("click", function () {
   window.history.back()
  })
 } else {
  console.warn("Back button not found.")
 }
})
