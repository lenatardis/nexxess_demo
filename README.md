# Nexxess Client Portal – demo

The client portal of Nexxess, a trust marketplace. A customer logs in, follows how their trust is being set up step by step, buys service packages and trusts, sees invoices and shared files, reads the company feed and FAQ, and talks to their consultant.

**Live demo: https://lenatardis.github.io/nexxess_demo/**

This is a frontend-only build of the portal. The frontend is the production code. The backend (a REST API connected to a CRM) is replaced by a mock that runs inside the browser, so the demo needs no server and no account.

## Demo logins

| Customer | E-mail | Stage |
|---|---|---|
| Olivia Bennett | `olivia.bennett@example.com` | just started |
| Daniel Harper | `daniel.harper@example.com` | trust in progress (two trusts) |
| Margaret Collins | `margaret.collins@example.com` | trust completed |

- Password for all three: `DemoPortal2026`
- Verification code (the second login step, normally sent by e-mail): `123456`

You don't need to copy these. The login screen lists the three customers in a "Demo" box, and clicking one fills in the e-mail and password. The verification screen shows the code the same way. "Continue with Google" logs in as Daniel Harper without contacting Google. You can also register a new account, and it starts with a copy of Daniel's sample data.

## What you can try

- **Feed**: company news and consultant posts with attachments.
- **Trust Process**: the eight stages of a trust (completed, running, upcoming), with checklists and consultant comments.
- **Packages / Trusts**: the catalogue. "Buy" creates an invoice and opens a demo payment page. "Pay" makes it a purchase, and "Cancel" leaves it unpaid.
- **Invoices**: search, filters, sorting, pagination. A click on a row opens a PDF invoice that is generated in the browser.
- **My Purchases, My Files, FAQ**, the global search in the header, notifications (the bell icon).
- **Personal Information**: edit the profile, upload a photo, change the password (the new password works at the next login).
- **Chat**: the consultant cards and "Request Help" open a chat with canned replies.
- **Logged out**: "Forgot password" (the reset link appears on screen instead of being e-mailed), registration with the consultant picker, login by a link (`/user_auth?user=2`).

## How the backend is mocked

- [MSW (Mock Service Worker)](https://mswjs.io/) 2 intercepts the app's requests to `/api/v1/…` and answers them in the browser (`src/mocks/handlers/`). The API modules in `src/api/` are unchanged. They only point to a same-origin base URL.
- The sample data (`src/mocks/data/`) is invented: people, companies, consultants, files. Dates are counted back from the day you open the demo, so it never looks out of date.
- Changes are stored in your browser's `localStorage` under the `nexxess-demo:` prefix. Each visitor has their own copy. To start over, clear the site data in the browser (or remove the `nexxess-demo:*` keys and the `accessNexxessToken` / `refreshNexxessToken` keys).
- Access tokens expire after 5 minutes, so the app's own token refresh and retry logic runs for real.
- A short artificial delay keeps the loading skeletons visible.

Demo-only additions to the UI: the "Demo" hint boxes, the payment page, the chat window (it replaces a third-party live chat widget), and a notice page for the Terms and Privacy links. The phone number and e-mail in the footer are fictional.

## Stack

React 19, Create React App 5, React Router 7, Redux Toolkit, MUI 6, react-hook-form + yup, SCSS modules, DOMPurify; MSW 2 for the mock backend. It is deployed to GitHub Pages with GitHub Actions (`.github/workflows/deploy.yml`).

## Run locally

```bash
npm ci --legacy-peer-deps   # one dependency still declares React <= 18 as a peer
npm start                   # http://localhost:3000/nexxess_demo/
```

`CI=false npm run build` makes a production build in `build/`. The mock runs in the production build too, because it is the backend.
