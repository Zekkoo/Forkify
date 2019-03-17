// Global app controller
import Recipe from './models/Recipe';
import Search from './models/Search';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';

/** Global state of the app
 * Search object
 * Current reciepe object
 * Shopping list object
 * Liked objects
 */

const state = {}

const controlSearch = async () => {
    // 1. Get query from the view
    const query = searchView.getInput();
    if(query) {
        // 2. New search object and add to state
        state.search = new Search(query);
    } 
    if(state.search) {
        // 3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        try {
            // 4. Search for reciepes
            await state.search.getResults();
    
            // 5. render results on UI
            //console.log(state.search.result);
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch(error) {
            console.log('Something went wrong with the controlSearch...');
            clearLoader();
        }

    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
        console.log(goToPage);
    }
    
})

/**
 * RECIPE CONTROLLER
 */

const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');

    if(id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        if(state.search) {
            searchView.highlightSelected(id);
        }

        // Crate new recipe object
        state.recipe = new Recipe(id);
        
        try {
            // Get recipe data
            await state.recipe.getRecipe();
            console.log(state.recipe.ingredients);
            state.recipe.parseIngredients();
            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
            // Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
            console.log(state.recipe);
        } catch(error) {
            console.log('Error in controlRecipe()...');
            console.log(error);
        }

    }
}

//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));