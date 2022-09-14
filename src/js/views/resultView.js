import icons from 'url:../../img/icons.svg'; // << Imported icons after Parcel installation
import Content from './View.js';
import previewContent from './prevView.js';

class ResultContent extends Content {
  _parentElement = document.querySelector('.results');
  _errorMessage = `👀 No such a recipe found for this query! Try again! 👌`;
  _successMessage = ``;

  _setUpRecipeMarkup() {
    return this._data
      .map(result => previewContent.render(result, false))
      .join('');
  }
}

export default new ResultContent();
