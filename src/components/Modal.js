class Modal {
  constructor(modal) {
    this._modal = modal;
    this._handleEscClose = this._handleEscClose.bind(this);
    this._closeButton = modal.querySelector(".modal__close-button");
    this._closeButton.addEventListener("click", () => this.closeModal());
    this._modal.addEventListener("click", (evt) => {
      if (evt.target === this._modal) {
        this.closeModal();
      }
    });
  }
  openModal() {
    this._modal.classList.add("modal_is-open");
    document.addEventListener("keydown", this._handleEscClose);
  }

  closeModal() {
    this._modal.classList.remove("modal_is-open");
    document.removeEventListener("keydown", this._handleEscClose);
  }

  _handleEscClose(evt) {
    if (evt.key === "Escape") {
      this.closeModal();
    }
  }
}

export default Modal;
