import icons from 'url:../../img/icons.svg'; // << Imported icons after Parcel installation

export default class Content {
  // Public class field property that is accessible to all its instances and can be referred using {this.} keyword
  _data;

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    //_data gets updated
    this._data = data;
    const markup = this._setUpRecipeMarkup();
    if (!render) return markup;
    this._wipeUp();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  // The main difference between render method and update is that it updates the content wherever it gets changed on DOM >> it does not rerenders the page every time something gets changed on.
  update(data) {
    //_data gets updated
    this._data = data;
    /*
     * Creating new markup and storing it not to render but to compare the new HTML to the current one.
     * Updating only the data that is being changed.
     */
    const updatedMarkup = this._setUpRecipeMarkup();
    /*
     * Converting markup string to a DOM Object that lives in a browser memory.
     * Comparing a new DOM to the current one.
     * The Range interface represents a fragment of a document that can contain nodes and parts of text nodes.
     */
    const newDOM = document
      .createRange()
      /**
       * Converting taken in parameter to the DOM Object that lives in the memory not in the page.
       * @param {string} updatedMarkup.
       * @returns a DocumentFragment by invoking the HTML fragment parsing algorithm or the XML fragment parsing algorithm with the start of the range (the parent of the selected node) as the context node.
       */
      .createContextualFragment(updatedMarkup);
    // Storing all the selected contextual elements.
    const newDOMElements = Array.from(newDOM.querySelectorAll('*'));
    // Storing all the selected existing (real) elements.
    const currentDOMElements = Array.from(
      this._parentElement.querySelectorAll('*')
    );
    /*
     * Updating the changed TEXT.
     * Comparing whether the two nodes are equal stored in newElement and currentElement.
     * Comparing Node's value.
     * Sets the updated content if any.
     */
    newDOMElements.forEach((newElement, index) => {
      const currentElement = currentDOMElements[index];
      if (
        !newElement.isEqualNode(currentElement) &&
        newElement.firstChild?.nodeValue.trim() !== ''
      ) {
        currentElement.textContent = newElement.textContent;
      }
      /*
       * Updating the changed ATTRIBUTE.
       * Setting attributes after the changes.
       */
      if (!newElement.isEqualNode(currentElement))
        Array.from(newElement.attributes).forEach(attribute =>
          currentElement.setAttribute(attribute.name, attribute.value)
        );
    });
  }

  /*
   * Cleaning up anu content before / after rendering.
   * {this.} keyword is pointed to in whatever variable environment _wipeUp() method is called out.
   */
  _wipeUp() {
    this._parentElement.innerHTML = '';
  }
  // Generic function >> rendering the spinner before the other rendering takes place.
  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;
    this._wipeUp();
    // Inserting HTML >> taking markup constance as one of the parameters.
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  /*
   * If particular message is being passed as a parameter, then the passed argument is going to be displayed. Otherwise, the default one is being inserted.
   * _errorMessage is defined in >> recipeView.js and resultView.js to which this. class is extended to.
   * An appropriate message will be displayed based on function in which an error might occur.
   * From controller.js _renderError is called and {this.} keyword is set to recipeContent module as it holds the variable environment needed.
   * Through recipeView.js in which Content class is extended, renderError is retrieved.
   */
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div> 
    `;
    this._wipeUp();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  // Same as renderError
  renderSuccess(message = this._successMessage) {
    const markup = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;
    this._wipeUp();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
