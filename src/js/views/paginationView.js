import icons from 'url:../../img/icons.svg'; // << Imported icons after Parcel installation
import Content from './View.js';

class PaginationContent extends Content {
  _parentElement = document.querySelector('.pagination');
  // manager argument is a function itself passed by controlled as this method's parameter.
  addPageManager(manager) {
    this._parentElement.addEventListener('click', function (event) {
      /*
       * pagination element is being selected to have EventDelegation.
       * closest() method is being used to target the btn--inline element
       * This way event propagates down and targets the event.
       */
      const button = event.target.closest('.btn--inline');
      if (!button) return;
      /*
       * .btn--inline element also contains class data-goto on which model.getSearchResultPage(goToPage) logic gets applied.
       * The dataset read-only property of the HTMLElement interface provides read/write access to custom data attributes (data-*) on elements.
       */
      const goToPage = +button.dataset.goto;
      // Deep flow need to be explained
      // Passes the argument to managePagination function defined in controller.js
      manager(goToPage);
    });
  }

  _setUpRecipeMarkup() {
    const currentPage = this._data.page;
    const numberOfPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    if (currentPage === 1 && numberOfPages > 1) {
      return `
        ${/*{data} special keyword in response to dataset   property*/ ''}
        <button data-goto="${
          currentPage + 1
        }" class="btn--inline pagination__btn--next">
          <span>Page ${currentPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
      `;
    }
    if (currentPage === numberOfPages && numberOfPages > 1) {
      return `
        <button data-goto="${
          currentPage - 1
        }" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${currentPage - 1}</span>
        </button>
      `;
    }
    if (currentPage < numberOfPages) {
      return `
        <button data-goto="${
          currentPage - 1
        }" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${currentPage - 1}</span>
        </button>

        <button data-goto="${
          currentPage + 1
        }" class="btn--inline pagination__btn--next">
          <span>Page ${currentPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
       `;
    }
    return ``;
  }
}

export default new PaginationContent();
