class Card {
  constructor(data, templateSelector, handleLike, handleDelete, handlePreview) {
    this._data = data;
    this._templateSelector = templateSelector;
    this._handleLike = handleLike;
    this._handleDelete = handleDelete;
    this._handlePreview = handlePreview;

    this._cardTemplate = document.querySelector(this._templateSelector).content;
  }

  getCardElement() {
    const cardElement = this._cardTemplate
      .cloneNode(true)
      .querySelector(".card");
    const cardTitleElement = cardElement.querySelector(".card__title");
    const cardImageElement = cardElement.querySelector(".card__image");
    const cardLikeButton = cardElement.querySelector(".card__like-button");
    const cardDeleteButton = cardElement.querySelector(".card__delete-button");

    cardImageElement.src = this._data.link;
    cardImageElement.alt = this._data.name;
    cardTitleElement.textContent = this._data.name;

    if (this._data.isLiked) {
      cardLikeButton.classList.add("card__like-button_active");
    }

    cardLikeButton.addEventListener("click", (evt) => {
      this._handleLike(evt, this._data);
    });
    cardDeleteButton.addEventListener("click", () =>
      this._handleDelete(cardElement, this._data)
    );

    cardImageElement.addEventListener("click", () => {
      this._handlePreview(this._data);
    });

    return cardElement;
  }
}

export default Card;
