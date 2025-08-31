// User authentication functionality
const authContainer = document.getElementById('auth-container');
const appContent = document.getElementById('app-content');
const userMenu = document.getElementById('user-menu');
const userGreeting = document.getElementById('user-greeting');
const logoutBtn = document.getElementById('logout-btn');
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const switchToSignup = document.getElementById('switch-to-signup');
const switchToLogin = document.getElementById('switch-to-login');

// Sample user data (in a real app, this would be stored in a database)
let users = JSON.parse(localStorage.getItem('jiko_users')) || [];
let currentUser = JSON.parse(localStorage.getItem('jiko_current_user')) || null;

// Check if user is already logged in
if (currentUser) {
    showAppContent();
}

// Auth tab switching
authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');
        
        // Update active tab
        authTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Show corresponding form
        authForms.forEach(form => form.classList.remove('active'));
        document.getElementById(`${tabId}-form`).classList.add('active');
    });
});

// Switch between login and signup forms
switchToSignup.addEventListener('click', (e) => {
    e.preventDefault();
    authTabs.forEach(t => t.classList.remove('active'));
    document.querySelector('[data-tab="signup"]').classList.add('active');
    
    authForms.forEach(form => form.classList.remove('active'));
    signupForm.classList.add('active');
});

switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    authTabs.forEach(t => t.classList.remove('active'));
    document.querySelector('[data-tab="login"]').classList.add('active');
    
    authForms.forEach(form => form.classList.remove('active'));
    loginForm.classList.add('active');
});

// Login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Reset error messages
    hideAllErrors();
    
    // Validate inputs
    let isValid = true;
    
    if (!email) {
        showError('login-email-error', 'Email is required');
        isValid = false;
    }
    
    if (!password) {
        showError('login-password-error', 'Password is required');
        isValid = false;
    }
    
    if (!isValid) return;
    
    // Check if user exists
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Login successful
        currentUser = {
            name: user.name,
            email: user.email
        };
        
        // Save to localStorage
        localStorage.setItem('jiko_current_user', JSON.stringify(currentUser));
        
        // Show app content
        showAppContent();
    } else {
        showError('login-password-error', 'Invalid email or password');
    }
});

// Signup form submission
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    
    // Reset error messages
    hideAllErrors();
    
    // Validate inputs
    let isValid = true;
    
    if (!name) {
        showError('signup-name-error', 'Name is required');
        isValid = false;
    }
    
    if (!email) {
        showError('signup-email-error', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('signup-email-error', 'Please enter a valid email');
        isValid = false;
    } else if (users.some(u => u.email === email)) {
        showError('signup-email-error', 'Email already exists');
        isValid = false;
    }
    
    if (!password) {
        showError('signup-password-error', 'Password is required');
        isValid = false;
    } else if (password.length < 6) {
        showError('signup-password-error', 'Password must be at least 6 characters');
        isValid = false;
    }
    
    if (!confirmPassword) {
        showError('signup-confirm-password-error', 'Please confirm your password');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('signup-confirm-password-error', 'Passwords do not match');
        isValid = false;
    }
    
    if (!isValid) return;
    
    // Create new user
    const newUser = {
        name,
        email,
        password // In a real app, you would hash the password
    };
    
    users.push(newUser);
    
    // Save to localStorage
    localStorage.setItem('jiko_users', JSON.stringify(users));
    
    // Set as current user
    currentUser = {
        name,
        email
    };
    
    localStorage.setItem('jiko_current_user', JSON.stringify(currentUser));
    
    // Show app content
    showAppContent();
});

// Logout functionality
logoutBtn.addEventListener('click', () => {
    currentUser = null;
    localStorage.removeItem('jiko_current_user');
    hideAppContent();
});

// Helper functions
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function hideAllErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => {
        el.style.display = 'none';
    });
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showAppContent() {
    authContainer.style.display = 'none';
    appContent.style.display = 'block';
    userMenu.style.display = 'flex';
    userGreeting.textContent = `Hello, ${currentUser.name.split(' ')[0]}!`;
    
    // Initialize the recipe app
    init();
}

function hideAppContent() {
    authContainer.style.display = 'block';
    appContent.style.display = 'none';
    userMenu.style.display = 'none';
    
    // Reset auth forms
    authTabs.forEach(t => t.classList.remove('active'));
    document.querySelector('[data-tab="login"]').classList.add('active');
    
    authForms.forEach(form => form.classList.remove('active'));
    loginForm.classList.add('active');
    
    // Clear form fields
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
    document.getElementById('signup-name').value = '';
    document.getElementById('signup-email').value = '';
    document.getElementById('signup-password').value = '';
    document.getElementById('signup-confirm-password').value = '';
    
    hideAllErrors();
}

// Sample recipe data
const recipes = [
    {
        id: 1,
        name: "Jollof Rice",
        region: "west",
        cookTime: 60,
        dietary: "gluten-free",
        ingredients: ["rice", "tomatoes", "onions", "peppers", "chicken", "vegetable oil"],
        match: 85,
        description: "A classic West African one-pot dish with rice cooked in a rich tomato sauce."
    },
    {
        id: 2,
        name: "Injera with Wat",
        region: "east",
        cookTime: 120,
        dietary: "vegan",
        ingredients: ["teff flour", "lentils", "onions", "berbere spice", "cabbage"],
        match: 70,
        description: "Ethiopian sourdough flatbread served with spicy lentil stew."
    },
    {
        id: 3,
        name: "Suya Skewers",
        region: "west",
        cookTime: 45,
        dietary: "gluten-free",
        ingredients: ["beef", "peanuts", "peppers", "onions", "suya spice"],
        match: 90,
        description: "Spicy grilled beef skewers with a peanut spice mix, popular across West Africa."
    },
    {
        id: 4,
        name: "Bobotie",
        region: "south",
        cookTime: 75,
        dietary: "gluten-free",
        ingredients: ["beef", "onions", "dried fruit", "eggs", "milk", "curry powder"],
        match: 65,
        description: "South African baked minced meat dish with an egg-based topping."
    },
    {
        id: 5,
        name: "Plantain Mosa",
        region: "west",
        cookTime: 30,
        dietary: "vegetarian",
        ingredients: ["plantain", "flour", "yeast", "sugar", "oil"],
        match: 95,
        description: "Sweet plantain fritters, a popular Nigerian snack."
    },
    {
        id: 6,
        name: "Tagine",
        region: "north",
        cookTime: 90,
        dietary: "gluten-free",
        ingredients: ["chicken", "onions", "apricots", "almonds", "spices"],
        match: 75,
        description: "Moroccan slow-cooked stew with meat, fruits and vegetables."
    }
];

// Selected ingredients array
let selectedIngredients = [];

// DOM elements
const ingredientSearch = document.getElementById('ingredient-search');
const addIngredientBtn = document.getElementById('add-ingredient');
const selectedIngredientsContainer = document.getElementById('selected-ingredients');
const suggestedIngredients = document.querySelectorAll('.suggested-ingredient');
const searchBtn = document.getElementById('search-btn');
const recipeCardsContainer = document.getElementById('recipe-cards-container');
const resultsNumber = document.getElementById('results-number');

// Initialize the app
function init() {
    renderRecipeCards(recipes);
    setupEventListeners();
}

// Set up event listeners
function setupEventListeners() {
    // Add ingredient when button is clicked
    addIngredientBtn.addEventListener('click', addIngredient);
    
    // Add ingredient when Enter is pressed in the search box
    ingredientSearch.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addIngredient();
        }
    });
    
    // Add suggested ingredients when clicked
    suggestedIngredients.forEach(ingredient => {
        ingredient.addEventListener('click', function() {
            const ingredientValue = this.getAttribute('data-ingredient');
            if (!selectedIngredients.includes(ingredientValue)) {
                selectedIngredients.push(ingredientValue);
                renderSelectedIngredients();
            }
        });
    });
    
    // Search for recipes when the search button is clicked
    searchBtn.addEventListener('click', filterRecipes);
}

// Add ingredient from search box
function addIngredient() {
    const ingredient = ingredientSearch.value.trim().toLowerCase();
    if (ingredient && !selectedIngredients.includes(ingredient)) {
        selectedIngredients.push(ingredient);
        renderSelectedIngredients();
        ingredientSearch.value = '';
    }
}

// Render selected ingredients
function renderSelectedIngredients() {
    selectedIngredientsContainer.innerHTML = '';
    selectedIngredients.forEach(ingredient => {
        const tag = document.createElement('div');
        tag.className = 'ingredient-tag';
        tag.innerHTML = `
            ${ingredient}
            <span class="remove" data-ingredient="${ingredient}">
                <i class="fas fa-times"></i>
            </span>
        `;
        selectedIngredientsContainer.appendChild(tag);
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.ingredient-tag .remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const ingredientToRemove = this.getAttribute('data-ingredient');
            selectedIngredients = selectedIngredients.filter(ing => ing !== ingredientToRemove);
            renderSelectedIngredients();
        });
    });
}

// Filter recipes based on selected ingredients and filters
function filterRecipes() {
    const regionFilter = document.getElementById('region-filter').value;
    const timeFilter = document.getElementById('time-filter').value;
    const dietFilter = document.getElementById('diet-filter').value;
    
    let filteredRecipes = recipes;
    
    // Filter by region
    if (regionFilter !== 'all') {
        filteredRecipes = filteredRecipes.filter(recipe => recipe.region === regionFilter);
    }
    
    // Filter by cooking time
    if (timeFilter !== 'any') {
        const maxTime = parseInt(timeFilter);
        filteredRecipes = filteredRecipes.filter(recipe => recipe.cookTime <= maxTime);
    }
    
    // Filter by dietary preference
    if (dietFilter !== 'any') {
        filteredRecipes = filteredRecipes.filter(recipe => recipe.dietary === dietFilter);
    }
    
    // If ingredients are selected, sort by match percentage
    if (selectedIngredients.length > 0) {
        filteredRecipes.forEach(recipe => {
            // Calculate match percentage based on ingredients
            const matchedIngredients = recipe.ingredients.filter(ing => 
                selectedIngredients.includes(ing)
            ).length;
            
            // Update match percentage (for demo purposes)
            recipe.match = Math.min(100, Math.floor((matchedIngredients / selectedIngredients.length) * 100));
        });
        
        // Sort by match percentage (highest first)
        filteredRecipes.sort((a, b) => b.match - a.match);
    }
    
    renderRecipeCards(filteredRecipes);
}

// Render recipe cards
function renderRecipeCards(recipesToRender) {
    recipeCardsContainer.innerHTML = '';
    resultsNumber.textContent = recipesToRender.length;
    
    if (recipesToRender.length === 0) {
        recipeCardsContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <h3 style="color: var(--primary-green); margin-bottom: 1rem;">No recipes found</h3>
                <p>Try adjusting your filters or adding more ingredients</p>
            </div>
        `;
        return;
    }
    
    recipesToRender.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        
        card.innerHTML = `
            <div class="recipe-icon">
                <i class="fas fa-utensils"></i>
            </div>
            <div class="recipe-content">
                <h3 class="recipe-title">${recipe.name}</h3>
                <div class="recipe-meta">
                    <span>${getRegionName(recipe.region)}</span>
                    <span>${recipe.cookTime} mins</span>
                </div>
                <p class="recipe-ingredients">
                    <span>Key ingredients:</span> ${recipe.ingredients.slice(0, 3).join(', ')}
                </p>
                <p>${recipe.description}</p>
                <div class="match-percentage">${recipe.match}% match</div>
                <button class="view-recipe">View Recipe</button>
            </div>
        `;
        
        recipeCardsContainer.appendChild(card);
    });
}

// Get full region name from code
function getRegionName(regionCode) {
    const regions = {
        'west': 'West Africa',
        'east': 'East Africa',
        'south': 'Southern Africa',
        'north': 'North Africa'
    };
    return regions[regionCode] || 'Africa';
}