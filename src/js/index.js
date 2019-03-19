// Global app controller
import Recipe from './models/Recipe';
import Search from './models/Search';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
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
    if (query) {
        // 2. New search object and add to state
        state.search = new Search(query);
    }
    if (state.search) {
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
        } catch (error) {
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
    if (btn) {
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

    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        if (state.search) {
            searchView.highlightSelected(id);
        }

        // Crate new recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipe data
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
            // Render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe, 
                state.likes.isLiked(id));
        } catch (error) {
            console.log('Error in controlRecipe()...');
            console.log(error);
        }

    }
}

//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/**
 * LIST CONTROLLER
 */

 const controlList = () => {
     // Create a new list IF there is none
     if(!state.list) state.list = new List();

     //add ing to list
     state.recipe.ingredients.forEach(el => {
         const item = state.list.addItem(el.count, el.unit, el.ingredient);
         listView.renderItem(item);
     })
 }

 // Handle delete and update list item events
 elements.shopping.addEventListener('click', e=> {
     const id = e.target.closest('.shopping__item').dataset.itemid;

     // Handle delete btn
     if (e.target.matches('.shopping__delete, .shopping__delete *')) {
         //del from state
         state.list.deleteItem(id);

         listView.deleteItem(id);
     } else if (e.target.matches('.shopping__count-value')) {
         const val = parseFloat(e.target.value, 10);
         state.list.updateCount(id, val);
     }
 })

/**
 * LIKES CONTROLLER
 */
window.addEventListener('load', () => {
    state.likes = new Likes();
    state.likes.readStorage();
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    state.likes.likes.forEach(like => likesView.renderLike(like));
})


const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;
    // user has not yet liked curr recipe
    if(!state.likes.isLiked(currentID)) {
        // add like to state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        //toggle the like button
        likesView.toggleLikeBtn(true);
        //add like to ui list
        likesView.renderLike(newLike);
        
    // user has liked curr recipe
    } else {
        // remove like from state
        state.likes.deleteLike(currentID);
        //toggle the like button
        likesView.toggleLikeBtn(false);
        //remove like from ui list
        
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
}


//Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *') && state.recipe.servings > 1) {
        state.recipe.updateServings('dec');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        controlLike();
    }
})

