# A Square Homes

A Square Homes is a luxury interior design and architecture website for Lucknow. The project combines a polished frontend experience, strong SEO metadata, a custom Express backend, and Resend-based contact form email delivery.

## Features

- Premium marketing website for interior design and architecture services in Lucknow.
- SEO-focused `<head>` content with title, description, canonical URL, Open Graph tags, Twitter card metadata, geo tags, and JSON-LD structured data.
- WhatsApp Click-to-Chat floating action button for instant visitor contact.
- Contact form submission flow backed by an Express API route and Resend email delivery.
- Validation, security, and rate limiting on the backend contact endpoint.
- Responsive layout with a custom visual design and motion effects.
- Static asset hosting from `public/` with a custom server entrypoint.

## Tech Stack

- Next.js 14.2.3
- React 18.3.1
- TypeScript 5.4.5
- Express 5.2.1
- Resend email API
- dotenv
- cors
- helmet
- express-rate-limit
- express-validator
- Framer Motion
- Tailwind CSS 3.4.3
- PostCSS and Autoprefixer
- ESLint with `eslint-config-next`

## Project Structure

- `public/index.html` - Main frontend page, SEO metadata, structured data, WhatsApp integration, and contact form.
- `server/server.js` - Custom Express server that serves the site and exposes the contact API.
- `server/routes/contact.js` - Contact form route with validation and rate limiting.
- `server/utils/sendEmail.js` - Resend email helper.
- `app/` - Next.js application files present in the repo.
- `package.json` - Scripts and dependencies.

## Prerequisites

- Node.js 18 or newer.
- npm.
- A Resend account and valid API key.
- A configured `.env` file in the project root.

Recommended `.env` values:

```env
RESEND_API_KEY=your_resend_api_key
TO_EMAIL=you@example.com
FROM_EMAIL=onboarding@resend.dev
PORT=3000
```

## Local Setup / Installation

From the project root:

```bash
npm install
```

Start the custom Express server that serves the site and handles contact form email delivery:

```bash
npm run dev:server
```

Open the site in your browser:

```text
http://localhost:3000
```

If you want to run the Next.js dev server instead, use:

```bash
npm run dev
```

Note: both servers default to port 3000, so only one can run at a time unless you change `PORT`.

## Backend and Email Flow

The backend starts in `server/server.js`, which loads environment variables, configures security middleware, serves the `public/` directory, and mounts the contact route at `/api/contact`.

The contact form flow is:

1. The frontend form in `public/index.html` submits JSON to `/api/contact`.
2. `server/routes/contact.js` validates the payload with `express-validator`.
3. The route applies rate limiting with `express-rate-limit`.
4. `server/utils/sendEmail.js` sends the message through Resend.
5. The email is delivered to the address in `TO_EMAIL`.

## Frontend Highlights

- WhatsApp Click-to-Chat button using a `wa.me` link.
- Structured data using JSON-LD for the business, website, and FAQ content.
- Open Graph and Twitter metadata for social sharing.
- Local SEO details such as geo metadata, canonical URL, and service-area copy.
- Contact form wired to the custom backend API.

## Testing the Email Functionality

With the server running, submit the contact form from the homepage or send a test request directly to the API endpoint.

Example request:

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"phone\":\"+919999999999\",\"projectType\":\"New Home\",\"budget\":\"Test\",\"message\":\"Testing the email flow\"}"
```

## Deployment Notes

This repository includes a custom Express server in `server/server.js` for local development and email delivery testing.

- For local use, run `npm run dev:server`.
- The Express server is not a typical long-running production target for Vercel.
- If you deploy the frontend to Vercel, treat the Next.js app as the deployment target and move the email endpoint to a serverless function or separate backend service.
- Keep your Resend API key and recipient email as environment variables in the deployment platform.
- If you keep a custom server deployment outside Vercel, use the `start:server` script instead.

## Available Scripts

- `npm run dev:server` - Start the Express server with nodemon.
- `npm run start:server` - Start the Express server with Node.
- `npm run dev` - Start the Next.js development server.
- `npm run build` - Build the Next.js app.
- `npm run start` - Start the Next.js production server.
- `npm run lint` - Run Next.js linting.
