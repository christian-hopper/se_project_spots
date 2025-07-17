import "./index.css";

import {
  resetValidation,
  enableValidation,
  settings,
} from "../scripts/validation.js";
import { setButtonText } from "../utils/helpers.js";
import Card from "../components/Card.js";
import Api from "../utils/Api.js";
import Modal from "../components/Modal.js";
import UserInfo from "../components/UserInfo.js";

// Instantiate API
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "13cfda04-b97a-4769-ae32-a01aa8ac4519",
    "Content-Type": "application/json",
  },
});

// Instantiate UserInfo
const userInfo = new UserInfo({
  nameSelector: ".profile__name",
  aboutSelector: ".profile__description",
  avatarSelector: ".profile__avatar",
});

// Modal elements
const modals = {
  preview: new Modal(document.querySelector("#preview-modal")),
  editProfile: new Modal(document.querySelector("#edit-profile-modal")),
  newPost: new Modal(document.querySelector("#new-post-modal")),
  editAvatar: new Modal(document.querySelector("#edit-avatar-modal")),
  deleteCard: new Modal(document.querySelector("#delete-card-modal")),
};

// DOM references for cards and forms
const previewImageElement = document.querySelector(".modal__image");
const previewCaptionElement = document.querySelector(".modal__caption");

const cardList = document.querySelector(".cards__list");

// Edit Profile elements
const editProfileButton = document.querySelector(".profile__edit-button");
const editProfileForm = document.querySelector(
  "#edit-profile-modal .modal__form"
);
const editProfileNameInput = document.querySelector("#profile-name-input");
const editProfileDescriptionInput = document.querySelector(
  "#profile-description-input"
);
const editProfileSubmitButton = editProfileForm.querySelector(
  ".modal__submit-button"
);

// Edit Avatar elements
const editAvatarButton = document.querySelector(".profile__avatar-button");
const editAvatarForm = document.querySelector(
  "#edit-avatar-modal .modal__form"
);
const editAvatarInput = document.querySelector("#profile-avatar-input");
const editAvatarSubmitButton = editAvatarForm.querySelector(
  ".modal__submit-button"
);

// New post elements
const newPostButton = document.querySelector(".profile__post-button");
const newPostForm = document.querySelector("#new-post-modal .modal__form");
const newPostImageInput = document.querySelector("#image-link-input");
const newPostCaptionInput = document.querySelector("#image-caption-input");
const newPostSubmitButton = newPostForm.querySelector(".modal__submit-button");

// Delete post elements
const deleteConfirmButton = document.querySelector(".modal__delete-button");
const deleteCancelButton = document.querySelector(".modal__cancel-button");

// Variables for delete state
let selectedCard, selectedCardId;

// Fetch initial data
api
  .getAppInfo()
  .then(([cards, userData]) => {
    cards.forEach((item) => {
      const card = new Card(
        item,
        "#card-template",
        handleLike,
        handleDeleteCard,
        handlePreview
      );
      cardList.append(card.getCardElement());
    });

    userInfo.setUserInfo({
      name: userData.name,
      about: userData.about,
      avatar: userData.avatar,
    });
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

// Handlers
function handlePreview(data) {
  previewImageElement.src = data.link;
  previewImageElement.alt = data.name;
  previewCaptionElement.textContent = data.name;
  modals.preview.openModal();
}

function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data._id;
  modals.deleteCard.openModal();
}

function handleEditProfileFormSubmit(evt) {
  evt.preventDefault();
  setButtonText(editProfileSubmitButton, true);
  api
    .updateUserInfo([
      editProfileNameInput.value,
      editProfileDescriptionInput.value,
    ])
    .then((updatedUserInfo) => {
      userInfo.setUserInfo({
        name: updatedUserInfo.name,
        about: updatedUserInfo.about,
      });
      modals.editProfile.closeModal();
      editProfileForm.reset();
    })
    .catch((error) => {
      console.error("Error updating user info:", error);
    })
    .finally(() => {
      editProfileSubmitButton.disabled = false;
      setButtonText(editProfileSubmitButton, false);
    });
}

function handleNewPostFormSubmit(evt) {
  evt.preventDefault();
  setButtonText(newPostSubmitButton, true);
  api
    .addNewCard({
      link: newPostImageInput.value,
      name: newPostCaptionInput.value,
    })
    .then((newCardValues) => {
      const card = new Card(
        newCardValues,
        "#card-template",
        handleLike,
        handleDeleteCard,
        handlePreview
      );
      cardList.prepend(card.getCardElement());
      modals.newPost.closeModal();
      newPostForm.reset();
      resetValidation(
        newPostForm,
        newPostForm.querySelectorAll(".modal__input"),
        settings
      );
    })
    .catch((error) => {
      console.error("Error adding new card:", error);
    })
    .finally(() => {
      newPostSubmitButton.disabled = false;
      setButtonText(newPostSubmitButton, false);
    });
}

function handleEditAvatarFormSubmit(evt) {
  evt.preventDefault();
  setButtonText(editAvatarSubmitButton, true);
  const avatarUrl = editAvatarInput.value;
  api
    .updateUserAvatar(avatarUrl)
    .then((updatedUserInfo) => {
      userInfo.setUserInfo({
        avatar: updatedUserInfo.avatar,
      });
      modals.editAvatar.closeModal();
      editAvatarForm.reset();
    })
    .catch((error) => {
      console.error("Error updating avatar:", error);
    })
    .finally(() => {
      editAvatarSubmitButton.disabled = false;
      setButtonText(editAvatarSubmitButton, false);
    });
}

function handleDeleteSubmit() {
  setButtonText(deleteConfirmButton, true, "Delete", "Deleting...");
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      modals.deleteCard.closeModal();
    })
    .catch((error) => {
      console.error("Error deleting card:", error);
    })
    .finally(() => {
      deleteConfirmButton.disabled = false;
      setButtonText(deleteConfirmButton, false, "Delete", "Deleting...");
    });
}

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

// Event listeners
editProfileButton.addEventListener("click", () => {
  const currentUser = userInfo.getUserInfo();
  editProfileNameInput.value = currentUser.name;
  editProfileDescriptionInput.value = currentUser.about;
  modals.editProfile.openModal();
  resetValidation(
    editProfileForm,
    editProfileForm.querySelectorAll(".modal__input"),
    settings
  );
});

editProfileForm.addEventListener("submit", handleEditProfileFormSubmit);
newPostButton.addEventListener("click", () => modals.newPost.openModal());
newPostForm.addEventListener("submit", handleNewPostFormSubmit);
editAvatarButton.addEventListener("click", () => modals.editAvatar.openModal());
editAvatarForm.addEventListener("submit", handleEditAvatarFormSubmit);
deleteConfirmButton.addEventListener("click", handleDeleteSubmit);
deleteCancelButton.addEventListener("click", () =>
  modals.deleteCard.closeModal()
);

// Enable validation
enableValidation(settings);
