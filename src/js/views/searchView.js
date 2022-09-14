class SearchContent {
  _parentElement = document.querySelector('.search');

  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._wipeUpInput();
    return query;
  }

  _wipeUpInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }

  addSearchManager(manager) {
    this._parentElement.addEventListener('submit', function (event) {
      event.preventDefault();
      manager();
    });
  }
}

export default new SearchContent();
