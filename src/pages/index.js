import "./index.css";

import {
  resetValidation,
  enableValidation,
  settings,
} from "../scripts/validation.js";
import { setButtonText } from "../utils/helpers.js";
import Api from "../utils/Api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "13cfda04-b97a-4769-ae32-a01aa8ac4519",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardList.append(cardElement);
    });
    profileNameElement.textContent = userInfo.name;
    profileDescriptionElement.textContent = userInfo.about;
    profileAvatarElement.src = userInfo.avatar;
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

// Edit Profile elements
const editProfileButton = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseButton = editProfileModal.querySelector(
  ".modal__close-button"
);
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);
const editProfileSubmitButton = editProfileModal.querySelector(
  ".modal__submit-button"
);

// Edit Avatar elements
const editAvatarButton = document.querySelector(".profile__avatar-button");
const editAvatarModal = document.querySelector("#edit-avatar-modal");
const editAvatarCloseButton = editAvatarModal.querySelector(
  ".modal__close-button"
);
const editAvatarForm = editAvatarModal.querySelector(".modal__form");
const editAvatarInput = editAvatarModal.querySelector("#profile-avatar-input");
const editAvatarSubmitButton = editAvatarModal.querySelector(
  ".modal__submit-button"
);

// New post elements
const newPostButton = document.querySelector(".profile__post-button");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseButton = newPostModal.querySelector(".modal__close-button");
const newPostForm = newPostModal.querySelector(".modal__form");
const newPostImageInput = newPostModal.querySelector("#image-link-input");
const newPostCaptionInput = newPostModal.querySelector("#image-caption-input");
const newPostSubmitButton = newPostModal.querySelector(".modal__submit-button");

// Delete post elements
const deleteCardModal = document.querySelector("#delete-card-modal");
const deleteConfirmButton = deleteCardModal.querySelector(
  ".modal__delete-button"
);
const deleteCancelButton = deleteCardModal.querySelector(
  ".modal__cancel-button"
);
const deleteCloseButton = deleteCardModal.querySelector(".modal__close-button");

// Profile information elements
const profileNameElement = document.querySelector(".profile__name");
const profileDescriptionElement = document.querySelector(
  ".profile__description"
);
const profileAvatarElement = document.querySelector(".profile__avatar");

// Preview modal elements
const previewModal = document.querySelector("#preview-modal");
const previewModalCloseButton = previewModal.querySelector(
  ".modal__close-button"
);
const previewImageElement = previewModal.querySelector(".modal__image");
const previewCaptionElement = previewModal.querySelector(".modal__caption");

// Card elements
const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardList = document.querySelector(".cards__list");

let selectedCard, selectedCardId;

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");

  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;
  cardTitleElement.textContent = data.name;

  if (data.isLiked) {
    cardLikeButton.classList.add("card__like-button_active");
  }

  cardLikeButton.addEventListener("click", (evt) => {
    handleLike(evt, data);
  });
  cardDeleteButton.addEventListener("click", () =>
    handleDeleteCard(cardElement, data)
  );

  cardImageElement.addEventListener("click", () => {
    previewImageElement.src = data.link;
    previewImageElement.alt = data.name;
    previewCaptionElement.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_is-open");
  document.addEventListener("keydown", handleEscapeKey);
}
function closeModal(modal) {
  modal.classList.remove("modal_is-open");
  document.removeEventListener("keydown", handleEscapeKey);
}

function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data._id;
  openModal(deleteCardModal);
}

editProfileButton.addEventListener("click", function () {
  editProfileNameInput.value = profileNameElement.textContent;
  editProfileDescriptionInput.value = profileDescriptionElement.textContent;
  openModal(editProfileModal);
  resetValidation(
    editProfileForm,
    editProfileForm.querySelectorAll(".modal__input"),
    settings
  );
});

editProfileCloseButton.addEventListener("click", function () {
  closeModal(editProfileModal);
});

newPostButton.addEventListener("click", function () {
  openModal(newPostModal);
});

previewModalCloseButton.addEventListener("click", () => {
  closeModal(previewModal);
});

newPostCloseButton.addEventListener("click", function () {
  closeModal(newPostModal);
});

editAvatarButton.addEventListener("click", function () {
  openModal(editAvatarModal);
});

editAvatarCloseButton.addEventListener("click", function () {
  closeModal(editAvatarModal);
});

function handleEditProfileFormSubmit(evt) {
  evt.preventDefault();

  setButtonText(editProfileSubmitButton, true);

  api
    .updateUserInfo([
      editProfileNameInput.value,
      editProfileDescriptionInput.value,
    ])
    .then((userInfo) => {
      profileNameElement.textContent = userInfo.name;
      profileDescriptionElement.textContent = userInfo.about;
      closeModal(editProfileModal);
      editProfileForm.reset();
    })
    .catch((error) => {
      console.error("Error updating user info:", error);
    })
    .finally(() => {
      setButtonText(editProfileSubmitButton, false);
    });
}

editProfileForm.addEventListener("submit", handleEditProfileFormSubmit);

function handleNewPostFormSubmit(evt) {
  evt.preventDefault();
  setButtonText(newPostSubmitButton, true);

  api
    .addNewCard({
      link: newPostImageInput.value,
      name: newPostCaptionInput.value,
    })
    .then((newCardValues) => {
      const newCardElement = getCardElement(newCardValues);
      cardList.prepend(newCardElement);
      closeModal(newPostModal);
      newPostForm.reset();
    })
    .catch((error) => {
      console.error("Error adding new card:", error);
    })
    .finally(() => {
      setButtonText(newPostSubmitButton, false);
    });
}

newPostForm.addEventListener("submit", handleNewPostFormSubmit);

function handleEditAvatarFormSubmit(evt) {
  evt.preventDefault();
  setButtonText(editAvatarSubmitButton, true);

  const avatarUrl = editAvatarInput.value;
  api
    .updateUserAvatar(avatarUrl)
    .then((userInfo) => {
      profileAvatarElement.src = userInfo.avatar;
      closeModal(editAvatarModal);
      editAvatarForm.reset();
    })
    .catch((error) => {
      console.error("Error updating avatar:", error);
    })
    .finally(() => {
      setButtonText(editAvatarSubmitButton, false);
    });
}

editAvatarForm.addEventListener("submit", handleEditAvatarFormSubmit);

function handleDeleteSubmit() {
  setButtonText(deleteConfirmButton, true, "Delete", "Deleting...");

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteCardModal);
    })
    .catch((error) => {
      console.error("Error deleting card:", error);
    })
    .finally(() => {
      setButtonText(deleteConfirmButton, false, "Delete", "Deleting...");
    });
}

deleteConfirmButton.addEventListener("click", handleDeleteSubmit);
deleteCancelButton.addEventListener("click", () => {
  closeModal(deleteCardModal);
});
deleteCloseButton.addEventListener("click", () => {
  closeModal(deleteCardModal);
});

function handleLike(evt, cardId) {
  const cardLikeButton = evt.target;
  const isLiked = cardLikeButton.classList.contains("card__like-button_active");
  api
    .changeLikeStatus(cardId._id, !isLiked)
    .then(() => {
      cardLikeButton.classList.toggle("card__like-button_active", !isLiked);
    })
    .catch((error) => {
      console.error("Error changing like status:", error);
    });
}

const modals = document.querySelectorAll(".modal");
modals.forEach((modal) => {
  modal.addEventListener("click", (evt) => {
    if (evt.target.classList.contains("modal")) {
      closeModal(modal);
    }
  });
});

function handleEscapeKey(event) {
  if (event.key === "Escape") {
    const openModal = document.querySelector(".modal_is-open");
    if (openModal) {
      closeModal(openModal);
    }
  }
}

enableValidation(settings);
