import icons from 'url:../../img/icons.svg'; // << Imported icons after Parcel installation
import fracty from 'fracty'; // << External fractional library

import Content from './View.js';

class RecipeContent extends Content {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = `👀 No such a recipe found! Search wisely 👌`;
  _successMessage = ``;

  /**
   * Method that is a Publisher of a Subscriber-Publisher Design Pattern that takes controller (Subscriber) function as a parameter >> this way MVC architecture is maintained as a View part of the model does not get interacted by the Controller part directly. Instead, it invokes the method through being its parameter.
   * @param {function} handler function that is being received
   */
  addRenderManager(manager) {
    /*
     * Placing two events into Array and then forEach event eventListener gets added and are followed by an eventHandler.
     * This can take any manager function that is related to the specified events given.
     */
    ['hashchange', 'load'].forEach(event =>
      window.addEventListener(event, manager)
    );
  }

  addServingManager(manager) {
    this._parentElement.addEventListener('click', function (event) {
      const button = event.target.closest('.btn--update-servings');
      if (!button) return;
      // Destructured data
      const { updateTo } = button.dataset;
      if (+updateTo > 0) manager(+updateTo);
    });
  }

  addBookmarkManager(manager) {
    this._parentElement.addEventListener('click', function (event) {
      const button = event.target.closest('.btn--bookmark');
      if (!button) return;
      manager();
    });
  }

  _setUpRecipeMarkup() {
    // _data sending >> View.js >> Content Class for rendering
    return `
      <figure class="recipe__fig">
          <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this._data.title}</span>
          </h1>
      </figure>

      <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-clock"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">${
            this._data.cookingTime
          }</span>
          <span class="recipe__info-text">minutes</span>
        </div>

        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-users"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">${
            this._data.servings
          }</span>
          <span class="recipe__info-text">servings</span>

          <div class="recipe__info-buttons">
            <button class="btn--tiny btn--update-servings"
            ${/*{data} special keyword in response to dataset property*/ ''} 
            data-update-to="${this._data.servings - 1}">
              <svg>
                <use href="${icons}#icon-minus-circle"></use>
              </svg>
            </button>
            <button class="btn--tiny btn--update-servings" 
            
            data-update-to="${this._data.servings + 1}">
              <svg>
                <use href="${icons}#icon-plus-circle"></use>
              </svg>
            </button>
          </div>
        </div>

        <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
          <svg>
            <use href="${icons}#icon-user"></use>
          </svg>
        </div>
        <button class="btn--round btn--bookmark">
          <svg class="">
            <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
          </svg>
        </button>
      </div>

      <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
          ${
            /*
             * Ingredients array is being looped over using the map() method.
             * map() method returns a string.
             * join() method is being used to separate string
             */ ''
          } 
          ${this._data.ingredients.map(this._setupIngredientMarkup).join('')}

        </ul>
      </div>

      <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__publisher">${
            this._data.publisher
          }</span>. Please check out
          directions at their website.
        </p>
        <a class="btn--small recipe__btn"
          href="${this._data.sourceUrl}"
          target="_blank">
          <span>Directions</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </a>
      </div>    
    `;
  }

  _setupIngredientMarkup(ingredient) {
    return `
      <li class="recipe__ingredient">
        <svg class="recipe__icon">
          <use href="${icons}#icon-check"></use>
        </svg>
        <div class="recipe__quantity">
        ${
          /*
           * Using an external library to render fractional numbers.
           * Using the ternary operator to avoid NaN or Null.
           */ ''
        }
        ${
          ingredient.quantity ? fracty(ingredient.quantity).toString() : ''
        }</div>
        <div class="recipe__description">
          <span class="recipe__unit">${ingredient.unit}</span>
          ${ingredient.description}
        </div>
      </li>
    `;
  }
}

export default new RecipeContent();
