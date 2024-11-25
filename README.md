# API Documentation

## Overview

This project provides APIs and views to manage events and scores, with different access levels for different roles such as Admin and Jury. Below is the detailed breakdown of the available routes, grouped by access level and functionality.

---

## Public Routes

These routes are accessible by any authenticated user, including guests.

### Authentication
- **POST /api/auth/signin**
  - Authenticates a user and generates a JWT token.
  
- **POST /api/auth/signout**
  - Logs out the current user by invalidating their session.
  
- **GET /signin**
  - Renders the login page.

### Home and Error Pages
- **GET /home**
  - Displays the home page based on the user's role.

- **GET /unauthorized**
  - Renders a page indicating the user does not have permission to view the requested page.

- **GET /notfound**
  - Renders a "Page Not Found" page.

### Event Browsing
- **GET /event**
  - Displays a list of all events.

- **GET /event/:id**
  - Displays the details of a specific event by ID, including the scores associated with that event.

- **POST /event/search**
  - Allows searching for events based on certain criteria.

---

## Admin Routes

These routes are restricted to users with the Admin role.

### Dashboard and Management
- **GET /admin/dashboard**
  - Displays the admin dashboard with a list of events.

- **GET /admin/signup**
  - Renders the admin sign-up page.

### Event Management
- **GET /admin/event/create**
  - Renders the form for creating a new event.

- **GET /admin/event/:id**
  - Renders the form for updating an existing event by ID.

- **GET /admin/event/:id/scores**
  - Displays the scores associated with a specific event by ID.

- **POST /api/event/create**
  - API to create a new event.

- **PUT /api/event/update/:id**
  - API to update an existing event by ID.

- **DELETE /api/event/delete/:id**
  - API to delete an event by ID.

### Score Management
- **POST /api/score/:id/create**
  - API to create a new score for an event.

- **GET /api/scores**
  - Retrieves a list of all scores.

- **GET /api/event/:eventId/score/:scoreId**
  - Retrieves a specific score by event ID and score ID.

- **POST /admin/event/:id/score/:idScore/update**
  - API to update a specific score by event ID and score ID.

- **DELETE /api/score/:id**
  - API to delete a score by ID.

- **POST /api/scores/search**
  - Allows searching for scores based on certain criteria.

---

## Mixed User/Admin Routes

These routes are accessible by both Admins and Jury members, depending on the permissions required.

### PIN Verification and Scoring
- **POST /event/score/:id/verify**
  - Verifies the PIN for an event before allowing access to the scoring form.

- **GET /event/score/:id/form**
  - Renders the form for entering scores, accessible only after PIN verification.

- **GET /admin/event/:id/score/:idScore**
  - Renders the form for updating a specific score by event ID and score ID.

---

## Middleware

### `authJwt`
- **verifyToken**: Validates the JWT token provided by the user.
- **isAdmin**: Ensures the user has Admin privileges.
- **isAdminOrJury**: Ensures the user has either Admin or Jury privileges.

### `verifySignUp`
- **checkDuplicateUsernameOrEmail**: Ensures that the username or email is not already in use.

### `verifyPin`
- Validates the PIN provided for accessing specific event-related resources.

---

## Usage

To start using the API, follow these steps:

    1. Clone the repository.
    2. Install dependencies using `npm install`.
    3. Set up your environment variables in a `.env` file.
    4. Start the server using `npm start`.
    5. Use the provided routes to interact with the application via a client, such as Postman or your web browser.

For more detailed information, refer to the specific sections above or the source code comments.

---
