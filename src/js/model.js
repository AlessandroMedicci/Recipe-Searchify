import { async } from 'regenerator-runtime';
import { API_URL, API_KEY, RESULTS_PER_PAGE } from './configuration.js';
import { AJAX } from './helpers.js';
import recipeContent from './views/recipeView.js';

/*
 * Dynamic data that is being updated due to DOM events.
 * From which associated data can be retrieved.
 */
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: [],
};
/*
 * Recipe is a destructured Object variable created just to rename some property names given before.
 * After getJSON retrieve the data, it gets updated to state.recipe Object.
 */
const formRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    // Object destructuring happens only if short circuiting gets recipe.key.
    ...(recipe.key && { key: recipe.key }),
  };
};

/**
 * Fetches the data from API
 * @param {string} recipeID received from manageRecipe function in the controller.js module.
 * @return {undefined} changes the state Object from which the controller grabs the recipe then.
 */
export const loadRecipe = async function (recipeID) {
  try {
    /*
     * {loadRecipe} async function calls in another async {getJSON} function.
     * getJSON combines a static API_URL stored in configuration.js module and dynamic recipeID. Together they form a link that is sent to >> helper.js module in which method is defined.
     * getJson returns Promise and stores in data variable
     */
    const data = await AJAX(`${API_URL}${recipeID}?key=${API_KEY}`);
    state.recipe = formRecipeObject(data);
    // bookmarked property coming from fetched recipe object.
    if (state.bookmarks.some(bookmark => bookmark.id === recipeID))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (error) {}
};

/**
 * Taking query from controller.js module to load the data.
 * @param {string} query input.
 * @returns {undefined} as it only updates the state Object given in model.js module.
 */
export const loadSearchResults = async function (query) {
  try {
    // Storing the query in state Object.
    state.search.query = query;
    /*
     * Storing the retrieved object that contains data property with an array holding a search result.
     * query is a input string.
     * API_KEY is used for controlling recipes uploaded by us.
     */
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    /*
     * Returning data contains its own {data} Object with recipes property paired with Array containing all the query.
     * map() method is used to retrieve all the queries and update {state} object for rendering.
     */
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    state.search.page = 1;
  } catch (error) {
    console.error(`${error} ☣`);
    throw error;
  }
};
/**
 * Containing a logic for how many pages should be displayed on DOM depending on the search result.
 * @param {number} page that can be passed or granted from default value defined in the {state} Object.
 * @returns an update for {state} Object.
 */
export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;
  const startPoint = (page - 1) * state.search.resultsPerPage; // 0
  const endPoint = page * state.search.resultsPerPage; // 9;
  return state.search.results.slice(startPoint, endPoint);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ingredient => {
    ingredient.quantity =
      (ingredient.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

const localizeBookmark = function () {
  /*
   * Window property that is one of the Web Storage APi mechanisms to stores data locally in the browser.
   * The setItem() method of the Storage interface, when passed a key name and value, will add that key to the given Storage object, or update that key's value if it already exists.
   * Converting Object to string using stringify method.
   * After setting the item it gets stored in the browser's devtools >> application >> storage >> local storage.
   */
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const bookmark = function (recipe) {
  // Adding bookmarks into the {state} Object.
  state.bookmarks.push(recipe);
  /*
   * Checking the arguments property if it is equal to {state} Objects recipe property.
   * Setting the recipe bookmark property to true.
   */
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  localizeBookmark();
};
// Doing the opposite of booking method().
export const unbookmark = function (ID) {
  const index = state.bookmarks.findIndex(element => element.id === ID);
  state.bookmarks.splice(index, 1);
  if (ID === state.recipe.id) state.recipe.bookmarked = false;
  localizeBookmark();
};

const init = function () {
  const getLocalizedBookmark = function () {
    // Converting the data back to Object.
    const storage = localStorage.getItem('bookmarks');
    if (storage) state.bookmarks = JSON.parse(storage);
  };
  getLocalizedBookmark();
};
init();
/**
 * Getting the data
 * Forming it
 * Sending the data to the API.
 * Updating the state data.
 * Bookmarking.
 * @param {Object} uploadingRecipe parameter containing the object of the input.
 */
export const uploadRecipe = async function (uploadingRecipe) {
  try {
    // Storing returned array iterator object to be looped over.
    const ingredients = Object.entries(uploadingRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ingredient => {
        const ingredientArray = ingredient[1]
          .split(',')
          .map(element => element.trim());
        if (ingredientArray.length !== 3)
          throw new Error('👁 Indicate all the data!');

        const [quantity, unit, description] = ingredientArray;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: uploadingRecipe.title,
      source_url: uploadingRecipe.sourceUrl,
      image_url: uploadingRecipe.image,
      publisher: uploadingRecipe.publisher,
      cooking_time: +uploadingRecipe.cookingTime,
      servings: +uploadingRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = formRecipeObject(data);
    bookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};
