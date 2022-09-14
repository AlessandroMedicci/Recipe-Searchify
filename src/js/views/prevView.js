import icons from 'url:../../img/icons.svg'; // << Imported icons after Parcel installation
import Content from './View.js';

class PreviewContent extends Content {
  _parentElement = '';

  _setUpRecipeMarkup() {
    const ID = window.location.hash.slice(1);
    return `
      <li class="preview">
        <a class="preview__link ${
          /* Adding class that keeps marked the element that was chosen to render */ ''
        } ${this._data.id === ID ? 'preview__link--active' : ''}" href="#${
      this._data.id
    }">
          <figure class="preview__fig">
            <img src="${this._data.image}" alt="${this._data.title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${this._data.title}</h4>
            <p class="preview__publisher">${this._data.publisher}</p>
            <div class="preview__user-generated ${
              this._data.key ? '' : 'hidden'
            }">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
            </div>
          </div>
        </a>
      </li>
    `;
  }
}

export default new PreviewContent();
