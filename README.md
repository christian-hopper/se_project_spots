# Spots

Spots is a dynamic photo-sharing web application where users can showcase and explore beautiful locations, memorable moments, and inspiring scenes from around the world.

## Features

- **User Profile Management**
  - Edit your name, bio, and profile picture
- **Card System**
  - Create and view photo cards with captions
  - Like and delete your own cards
- **Responsive Modals**
  - Edit profile, update avatar, preview images, add new posts, and confirm deletions using interactive modal windows
- **Form Validation**
  - Real-time form validation with error messages for required fields and input types
- **API Integration**
  - Fetch and persist user info and cards from a remote server using RESTful endpoints

## Technologies Used

- HTML5
- CSS3 (BEM Methodology)
- JavaScript (ES6 Modules)
- Webpack
- REST API
- Git & GitHub

## Key Functionality

- `Api.js`: Handles all API calls (fetching cards, updating user info/avatar, adding/deleting cards, toggling likes).
- `Card.js`: Generates individual card elements with like and delete functionalities.
- `UserInfo.js`: Manages and updates user profile information on the page.
- `Modal.js`: Handles opening/closing of all modal windows.
- `validation.js`: Enables and resets form validation dynamically.
- `helpers.js`: Utility functions like `setButtonText()` for UX feedback during async operations.

**Deployment**

This webpage is deployed to GitHub Pages:

- [Deployment Link](https://christian-hopper.github.io/se_project_spots)

**Walkthrough Video**

I have made a video walking through my thought process of making this webpage:

- [Deployment Link](https://drive.google.com/file/d/1dBxARI2zRCNyJ-I0HxaCEEbsOjGCzNMM/view?usp=sharing)

**Images**

![Spots Desktop Screenshot](./images/spots-desktop.jpeg)
![Spots Mobile Screenshot](./images/spots-mobile.jpeg)

**Plans for Improvement**

- Add user authentication (sign up/login)
- Allow users to comment on posts
- Improve accessibility with ARIA roles and keyboard navigation
- Introduce dark mode toggle

**Author**
Created by Christian Hopper
