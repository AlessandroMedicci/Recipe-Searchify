import icons from 'url:../../img/icons.svg'; // << Imported icons after Parcel installation
import Content from './View.js';

class RecipeAddingContent extends Content {
  _parentElement = document.querySelector('.upload');
  _successMessage = `✔ Congrats! Recipe got uploaded!`;
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _openerBtn = document.querySelector('.nav__btn--add-recipe');
  _closerBtn = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addDialogueOpenManager();
    this._addDialogueCloseManager();
  }
  // Switching (add/remove) the hidden class depending on current condition >> if the class is there then removes it and if no >> adds one.
  toggleDialogue() {
    this._overlay.classList.toggle('hidden');
    // Window is an HTML class in this case.
    this._window.classList.toggle('hidden');
  }
  _addDialogueOpenManager() {
    // Using bind method to set {this.} keyword explicitly to _openerBTN.
    this._openerBtn.addEventListener('click', this.toggleDialogue.bind(this));
  }

  _addDialogueCloseManager() {
    this._closerBtn.addEventListener('click', this.toggleDialogue.bind(this));
    this._overlay.addEventListener('click', this.toggleDialogue.bind(this));
  }

  addUploadManager(manager) {
    this._parentElement.addEventListener('submit', function (event) {
      event.preventDefault();
      // Constructing a set of key/value pairs representing form fields and their values
      const arrayData = [...new FormData(this)];
      // Transforming a list of key-value pairs into an object
      const objectData = Object.fromEntries(arrayData);
      manager(objectData);
    });
  }
  _setUpRecipeMarkup() {}
}

export default new RecipeAddingContent();
