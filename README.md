# AI-Powered Invoice Processing Backend

This is a Node.js backend for an AI-powered invoice processing system, designed to integrate with mobile apps (Kotlin/KMP). The backend provides user authentication, invoice management, AI-based invoice parsing, reminder generation, and dashboard insights.

---

## Features

- **User Authentication**
  - Register new users
  - Login with JWT token
  - Profile retrieval and update

- **Invoice Management**
  - Create, update, delete, and fetch invoices
  - Invoice calculations: subtotal, tax, total
  - Supports multiple invoice items with tax percentages

- **AI-Based Features**
  - Parse text into structured invoice data using Google Gemini AI
  - Generate friendly reminder emails for overdue invoices
  - Provide dashboard insights and summaries for business analytics

- **Security**
  - JWT-based authentication
  - Password hashing with bcrypt
  - Protected routes for invoices and AI features

- **Integration**
  - Designed to work with Kotlin/KMP mobile apps
  - REST API endpoints for all features

---

## Tech Stack

- Node.js
- Express.js
- MongoDB (via Mongoose)
- JWT Authentication
- Bcrypt for password hashing
- Google Gemini AI API
- CORS enabled for mobile app integration

---

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd <project-folder>
