import { async } from 'regenerator-runtime';
import 'core-js/stable'; // << Polyfills everything
import 'regenerator-runtime/runtime'; // << Polyfills async await
import * as model from './model.js';
import recipeContent from './views/recipeView.js';
import searchContent from './views/searchView.js';
import resultContent from './views/resultView.js';
import bookmarkContent from './views/bookmarkView.js';
import paginationContent from './views/paginationView.js';
import recipeAddingContent from './views/addRecipeView.js';
import { MODAL_CLOSE } from './configuration.js';

// Preventing a page load after changes in the code *from Parcel
if (module.hot) {
  module.hot.accept();
}
/**
 * Function that is part of Publisher - Subscriber Design Pattern as it goes to View section without controlling anything but it gets controlled by the method it turns into as parameter.
 * @param {undefined} undefined as it turns into being parameter itself.
 */
const manageRecipes = async function () {
  try {
    /*
     * Storing the string taken out from URL
     * window.location points to an entire URL.
     * Followed by the # property identifies the ID that is being listened by the eventListener.
     * slice() method takes off the # from the string.
     */
    const recipeID = window.location.hash.slice(1);
    // Guard clause if there is no recipeID
    if (!recipeID) return;
    // Generic method formed in >> recipeContent >> View.js
    recipeContent.renderSpinner();
    // Updating the rendered content.
    resultContent.update(model.getSearchResultPage());
    // renderRecipe async function calls another loadRecipe async function.
    await model.loadRecipe(recipeID);
    // Rendering a recipe
    recipeContent.render(model.state.recipe);
    // Updating the rendered content.
    bookmarkContent.update(model.state.bookmarks);
  } catch (error) {
    recipeContent.renderError();
  }
};

const manageSearchResults = async function () {
  try {
    resultContent.renderSpinner();
    /*
     * getQuery method is defined in >> searchView.js module.
     * Retrieved query gets stored in a query variable.
     * Stored data gets passed in loadSearchResult method as an argument.
     */
    const query = searchContent.getQuery();
    if (!query) return;
    await model.loadSearchResults(query);
    /*
     * Pointing to resultContent it uses the one's variable environment.
     * render method is instantiated from View.js.
     * Taking getSearchResultPage with its own argument it uses logic defined in model.js and sets it to 1.
     */
    resultContent.render(model.getSearchResultPage());
    /*
     * Referring to paginationView.js module it uses its variable environment.
     * _parentElement is assigned to different element.
     */
    paginationContent.render(model.state.search);
  } catch (error) {
    console.error(error);
  }
};
/**
 * Rendering the data.
 * @param {*} goToPage gets an argument from addPageManager method.
 */
const managePagination = function (goToPage) {
  resultContent.render(model.getSearchResultPage(goToPage));
  paginationContent.render(model.state.search);
};
/**
 * Rendering the data.
 * @param {*} newServings gets an argument from addServingManager method.
 */
const manageServings = function (newServings) {
  // Updating the recipe serving in state
  model.updateServings(newServings);
  // Updating the content
  //recipeContent.render(model.state.recipe);
  recipeContent.update(model.state.recipe);
};

const manageBookmarks = function () {
  // Adding a bookmark.
  if (!model.state.recipe.bookmarked) model.bookmark(model.state.recipe);
  // Removing it.
  else model.unbookmark(model.state.recipe.id);
  // Updating recipe content
  recipeContent.update(model.state.recipe);
  // Rendering a bookmark.
  bookmarkContent.render(model.state.bookmarks);
};
// Is being passed as a parameter to addBookmarkLoadManager function then the eventListener gets attached on >> bookmarkView.js
const manageBookmarkLoad = function () {
  bookmarkContent.render(model.state.bookmarks);
};

const manageRecipeUpload = async function (uploadingRecipe) {
  try {
    recipeAddingContent.renderSpinner();
    await model.uploadRecipe(uploadingRecipe);
    recipeContent.render(model.state.recipe);
    recipeAddingContent.renderSuccess();
    bookmarkContent.render(model.state.bookmarks);
    /*
     * Changing URL ID using history API.
     * Changing without reloading the page
     * Method takes 3 arguments >> state, title and URL.
     */
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(function () {
      recipeAddingContent.toggleDialogue();
    }, MODAL_CLOSE * 1000);
  } catch (error) {
    recipeAddingContent.renderError(error.message);
  }
};

const init = function () {
  bookmarkContent.addBookmarkLoadManager(manageBookmarkLoad);
  recipeContent.addRenderManager(manageRecipes);
  recipeContent.addServingManager(manageServings);
  recipeContent.addBookmarkManager(manageBookmarks);
  searchContent.addSearchManager(manageSearchResults);
  paginationContent.addPageManager(managePagination);
  recipeAddingContent.addUploadManager(manageRecipeUpload);
};

init();
