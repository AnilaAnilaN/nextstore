# StarStore E-Commerce Application

A full-stack e-commerce application built with Next.js 16, MongoDB, and Tailwind CSS. Features a comprehensive admin dashboard, blog system with rich text editing, and complete shopping functionality.

## 🚀 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (Turbopack)
- **Database:** [MongoDB](https://www.mongodb.com/) (Mongoose)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Lucide React](https://lucide.dev/)
- **Image Storage:** [ImageKit.io](https://imagekit.io/)
- **Rich Text Editor:** [TipTap](https://tiptap.dev/)

## ✨ Features

### 🛍️ Customer Features
- **Product Browsing:** Filter by category, search, and view detailed product pages.
- **Shopping Cart:** Add items, adjust quantities, and proceed to checkout.
- **Wishlist:** Save favorite items for later.
- **User Accounts:** Register, login, view order history, and manage profile.
- **Blog:** Read articles with rich content and post comments.

### 🛡️ Admin Dashboard
- **Product Management:** Create, edit, and delete products with image uploads.
- **Blog Management:** Write and publish articles using a rich text editor.
- **Comment Moderation:** View and manage user comments.
- **Order Management:** Track and process customer orders.
- **Analytics:** Overview of sales, traffic, and user activity.

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Database
- ImageKit Account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AnilaAnilaN/StarStore.app.git
   cd StarStore.app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Copy the example environment file and fill in your credentials:
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your keys:
   - `MONGODB_URI`: Your MongoDB connection string.
   - `IMAGEKIT_*`: Your ImageKit credentials.
   - `NEXTAUTH_SECRET`: Generate a secure random string.
   - `ADMIN_*`: Credentials for the initial admin account.

4. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔐 Admin Access

To access the admin dashboard:
1. Navigate to `/admin/login`
2. Log in with the credentials configured in your `.env.local` file (or the initial admin setup).

## 📝 Script Commands

- `npm run dev`: Start development server (Turbopack)
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

## 📄 License

This project is licensed under the MIT License.
