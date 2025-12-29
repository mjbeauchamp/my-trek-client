# TREK LIST CLIENT

This is the frontend codebase for **Trek List**, a backpacking checklist application. Users can create multiple gear checklists, and manage items in each checklist. They can also access a list of informational backpacking articles. This is a portfolio project demonstrating modern React development practices, state management, and integration with a separate Node.js/Express backend that manages users, gear lists, and backpacking articles.

**Server Repository:** [Trek List Server Repository](https://github.com/mjbeauchamp/my-trek-server)

## Live Demo

View deployed site here: [Trek List](https://trek-list.vercel.app/)

The client is deployed on **Vercel**.

The server is deployed using **Render**.

Base URL for the deployed API:

https://trek-list-api.onrender.com

Authenticated routes require a valid Auth0 JWT.

**Note:** Some sections of the app use placeholder text or images. This is a portfolio project, so some content is minimal or illustrative rather than fully built out.

---

## FEATURES

- **User Authentication** – Secure login using Auth0.
- **Gear Checklists** – Users can create, update, and delete multiple gear checklists.
- **Item Management** – Users can add, edit, or remove items in each checklist.
- **Common Gear** – Users can optionally select frequently used gear from a predefined list.
- **Backpacking Articles** – The Backpacking 101 page features curated content to learn more about safe and responsible trekking.
- **Responsive Design** – Fully functional on mobile, tablet, and desktop screens.
- **Error Handling & Notifications** – Site provides user feedback with clear error messaging and/or toast notifications for API errors.

---

## TECH STACK

- **Frontend:** React 19, Vite
- **State Management:** React Context
- **Authentication:** Auth0 (via `@auth0/auth0-react`)
- **Routing:** React Router
- **Styling:** SCSS (intentionally chosen over Tailwind CSS to demonstrate core CSS fundamentals)
- **Type Safety:** TypeScript
- **UI Components:** Headless UI
- **Linting:** ESLint
- **Formatting:** Prettier

---

## GETTING STARTED

### Prerequisites

- Node.js (see .nvmrc for current version)
- Auth0 account configured for the app
- Access to a successfully running instance of the corresponding server code, found here: (https://github.com/mjbeauchamp/my-trek-server)

## INSTALLATION & RUNNING LOCALLY

Clone down the repo from GitHub.

Create an `.env` file in the root of the project:

```env
VITE_API_URL=<your-server-api-url>
VITE_AUTH0_DOMAIN=<your-auth0-domain>
VITE_AUTH0_CLIENT_ID=<your-auth0-client-id>
VITE_AUTH0_AUDIENCE=<your-auth0-audience>
VITE_ENV=development
```

Then run:

```bash
npm install
```

Once installation is complete, run:

```bash
npm run dev
```

Your app should now be running smoothly and accessible in your browser.

## NOTES

- The app relies on a separate Node.js/Express backend to manage users, gear lists, and backpacking articles.
- All API calls that modify or retrieve user-specific data are protected using Auth0 JWT authentication.
- Users can have multiple gear lists. Each gear list contains list metadata and an 'items' array that can contain user-generated gear items.

## FUTURE IMPROVEMENTS

- Addition of automated testing for components and hooks
- New features to support an additional 'shopping list' and 'packing list' associated with each base gear checklist
- Performance optimization through caching and paginated data fetching
- Additional interactive UI animations and polished effects
- Expanded validation and error handling for API interactions
