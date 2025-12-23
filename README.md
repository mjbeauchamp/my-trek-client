# TREK LIST CLIENT

Frontend for **Trek List**, a backpacking checklist application. Users can create multiple gear checklists, and manage items in each checklist. They can also access a list of informational backpacking articles. This is a portfolio project demonstrating modern React development practices, state management, and integration with a separate Node.js/Express backend that manages users, gear lists, and backpacking articles.

**Server Repository:** [Trek List Server Repository](https://github.com/mjbeauchamp/my-trek-server)

**Note:** Some sections of the app use placeholder Lorem Ipsum text and placeholder images. This is a portfolio project, so content may be minimal or illustrative rather than fully built out.

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
- **Type Safety:** TypeScript
- **UI Components:** Headless UI
- **Linting:** ESLint
- **Formatting:** Prettier

---

## GETTING STARTED

### Prerequisites

- Node.js (see .nvmrc for current version)
- Access to a working instance of the Trek List server backend
- Auth0 account configured for the app
- A successfully running instance of the corresponding server code, found here: (https://github.com/mjbeauchamp/my-trek-server)

### Environment Variables

Create an `.env` file in the root of the project:

```env
VITE_API_URL=<your-server-api-url>
VITE_AUTH0_DOMAIN=<your-auth0-domain>
VITE_AUTH0_CLIENT_ID=<your-auth0-client-id>
VITE_AUTH0_AUDIENCE=<your-auth0-audience>
VITE_ENV=development
```

## INSTALLATION & RUNNING LOCALLY

Clone down the repo from GitHub. Then run:

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
- All API calls involving user data and gear lists are protected using JWTs from Auth0.
- List items are stored as arrays on their respective gear list documents in MongoDB.

## FUTURE IMPROVEMENTS

- Addition of automated testing for components and hooks
- New features to support an additional 'shopping list' and 'packing list' associated with each base gear checklist
- Performance optimization through caching and paginated data fetching
- Additional interactive UI animations and polished effects
- Expanded validation and error handling for API interactions
