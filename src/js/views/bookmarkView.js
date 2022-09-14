import icons from 'url:../../img/icons.svg'; // << Imported icons after Parcel installation
import Content from './View.js';
import previewContent from './prevView.js';

class BookmarkContent extends Content {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = `👀 No bookmark yet! Find a nice one and add it on 👌`;
  _successMessage = ``;
  /*
   * Taking manager parameter from controller section.
   * Attaching 'load' event on window
   * Firing the handler function when the event takes place.
   * Assuring that the bookmarked recipes stays rendered after the event.
   */
  addBookmarkLoadManager(manager) {
    window.addEventListener('load', manager);
  }

  _setUpRecipeMarkup() {
    return this._data
      .map(result => previewContent.render(result, false))
      .join('');
  }
}

export default new BookmarkContent();
