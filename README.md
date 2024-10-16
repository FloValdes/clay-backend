### `README.md`

---

# Internationalization Backend

This project is an internationalization API built with Node.js, Express, TypeScript, and MongoDB. It allows for dynamic translation management without requiring redeployment when translation changes are made. The backend provides endpoints for retrieving and updating translations.

## Table of Contents

- [Installation](#installation)
- [Running the Express Server](#running-the-express-server)
- [Running Tests](#running-tests)
- [Design Decisions](#design-decisions)
- [API Documentation](#api-documentation)
  - [GET /pages](#get-pages)
  - [POST /pages](#post-pages)
  - [DELETE /pages/:page](#delete-pagespage)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/internationalization-backend.git
   cd internationalization-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Install and run MongoDB locally (if not installed):

   - You can install MongoDB using Homebrew (for macOS):

     ```bash
     brew tap mongodb/brew
     brew install mongodb-community@6.0
     ```

   - Start the MongoDB service:

     ```bash
     brew services start mongodb-community@6.0
     ```

4. Create a `.env` file in the project root for environment variables (if needed):

   ```bash
   MONGO_URI=mongodb://localhost:27017/internationalization
   PORT=3000
   ```

## Running the Express Server

To start the Express server locally, run:

```bash
npm run start
```

This will start the server on `http://localhost:3000`.

If you want to start the server in development mode with automatic reloading, run:

```bash
npm run dev
```

## Running Tests

This project uses **Jest** and **Supertest** for testing. To run the tests:

1. Ensure that MongoDB is running.

2. Run the tests:

   ```bash
   npm test
   ```

This will execute all unit tests located in the `__tests__` directory.

## Design Decisions

### 1. **Translations Data Structure**
   - Translations are stored in MongoDB under a `Page` document where each page has a `translations` field, which is a `Map`. Each translation key maps to another `Map` object that stores the locale (e.g., `en`, `es`) and the corresponding translation string.
   - This structure allows for quick access to all translations for a particular page and supports easy updates for specific locales.

### 2. **Dynamic Loading Without Deployment**
   - The API is designed to allow translations to be updated dynamically without requiring a redeploy of the application. All translation updates are made directly in MongoDB, and the frontend can fetch updated translations immediately through API requests.

### 3. **TypeScript Usage**
   - TypeScript was chosen for this project to enforce strict typing, leading to fewer runtime errors and better tooling support. Interfaces for translations and pages ensure type safety throughout the application.

### 4. **Separation of API and Client**
   - The API is kept separate from the frontend client. This decoupling ensures that the backend can serve multiple clients, making it scalable and maintainable.

## API Documentation

### GET /pages

#### Description
Retrieve translations for a specific page and locale.

#### URL
`GET /pages`

#### Query Parameters
| Parameter | Type   | Description                          |
|-----------|--------|--------------------------------------|
| `page`    | string | The page name to retrieve translations for (e.g., `home`, `about`). |
| `locale`  | string | The locale of the translations (e.g., `en`, `es`). |

#### Example Request
```bash
GET /pages?page=home&locale=en
```

#### Example Response
```json
{
  "welcome_message": "Welcome to the site!",
  "cta_button": "Click here"
}
```

### POST /pages

#### Description
Add or update translations for a specific page.

#### URL
`POST /pages`

#### Request Body
| Field          | Type                          | Description                          |
|----------------|-------------------------------|--------------------------------------|
| `page`         | string                        | The page name to update translations for (e.g., `home`, `about`). |
| `translations` | object (key-value pairs)       | The translations to update or add, where each key is the translation key, and the value is an object with locale keys (e.g., `en`, `es`) and their respective translations. |

#### Example Request
```json
{
  "page": "home",
  "translations": {
    "welcome_message": {
      "en": "Welcome to the site!",
      "es": "¡Bienvenido al sitio!"
    },
    "cta_button": {
      "en": "Click here",
      "es": "Haz clic aquí"
    }
  }
}
```

#### Example Response
```json
{
  "_id": "home",
  "page": "home",
  "translations": {
    "welcome_message": {
      "en": "Welcome to the site!",
      "es": "¡Bienvenido al sitio!"
    },
    "cta_button": {
      "en": "Click here",
      "es": "Haz clic aquí"
    }
  },
  "updated_at": "2024-10-15T10:00:00Z"
}
```

### DELETE /pages/:page

#### Description
Delete translations for a specific page.

#### URL
`DELETE /pages/:page`

#### Example Request
```bash
DELETE /pages/home
```

#### Example Response
```json
{
  "message": "Page home deleted successfully"
}
```