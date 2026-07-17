# 🏡 A Square Homes

Welcome to **A Square Homes** — a premium, luxury interior design and architecture web platform tailored for clients in Lucknow. 

This project was built to deliver a highly polished, animated frontend experience backed by a secure, serverless API architecture for seamless client communication.

🌟 **Experience the live site:** [a-square-homes.vercel.app](https://a-square-homes.vercel.app/)

---

## ✨ Project Highlights

*   **Premium User Experience:** A visually striking marketing site designed to reflect the luxury of the physical spaces we build, featuring smooth Framer Motion scroll effects and responsive design.
*   **Built for Search (SEO):** Heavy focus on discoverability. The `<head>` is packed with dynamic titles, descriptions, Open Graph tags for social sharing, Twitter cards, local geo-tags, and JSON-LD structured data for Google Business optimization.
*   **Instant WhatsApp Integration:** A floating "Click-to-Chat" button dynamically generates a pre-filled message, allowing visitors to reach out the exact moment they feel inspired.
*   **Secure Serverless Contact Flow:** A fully integrated contact form powered by Next.js API routes and delivered seamlessly to the business inbox via the Resend API.
*   **Backend Security:** The API endpoint features payload validation and strict error handling to ensure only clean, actionable inquiries make it through.

---

## 🛠️ The Tech Stack

This platform was engineered using a modern JavaScript ecosystem to ensure lightning-fast load times and high reliability:

*   **Framework:** Next.js 14, React 18
*   **Language:** TypeScript
*   **Styling & Motion:** Tailwind CSS 3, PostCSS, Framer Motion
*   **API & Email:** Next.js Serverless Route Handlers, Resend API
*   **Deployment:** Vercel (Edge Network)

---

## 📂 Architecture Overview

*   **`public/` & `app/`** — Houses the main frontend UI components, global stylesheets, SEO metadata, and static assets (like logos and project imagery).
*   **`app/api/contact/route.ts`** — The serverless backend route that intercepts contact form submissions, validates the data, and securely triggers the Resend email API without exposing sensitive credentials to the client.
*   **`components/`** — Modular, reusable React components including the WhatsApp floating action button and the interactive contact form.

---

### 📬 Contact & Inquiries
If you are interested in the code, the architecture, or want to discuss a similar build, feel free to reach out via the contact form on the live site!
