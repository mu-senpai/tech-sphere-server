
# TechSphere

**TechSphere** is an IT/Tech-related blogging website designed to deliver a seamless and engaging user experience for tech enthusiasts. Built with modern web technologies, it enables users to explore, post, and interact with blogs in a visually appealing and highly functional environment.

## Live Demo

[Visit TechSphere Server Side Live](https://tech-sphere-server.vercel.app/)

## Features

### General
- Fully responsive design for mobile, tablet, and desktop devices.
- Eye-catching UI/UX with proper alignment, spacing, and color contrast.
- Secure Firebase configuration and MongoDB credentials via environment variables.

### Pages
1. **Home Page**
   - Hero section and recent blogs display.
   - Tips and newsletter sections for user engagement.
   - Includes a "wishlist" functionality.

2. **All Blogs Page**
   - View all blogs with category filters and a search field.
   - "Details" and "Wishlist" options for each blog.

3. **Blog Details Page**
   - Displays comprehensive blog information.
   - Comment section for user interactions.
   - Conditional comment and update options for blog authors.

4. **Add Blog Page**
   - Form to submit blogs with fields for title, image URL, category, and descriptions.

5. **Update Blog Page**
   - Private page for editing user-added blogs with pre-filled form fields.

6. **Featured Blogs Page**
   - Displays top 10 blogs by word count in a sortable table using `Tanstack Table`.

7. **Wishlist Page**
   - Users can view, manage, and remove wishlisted blogs.

### Authentication
- Email and password-based authentication.
- Google login as an alternative method.
- Secure JWT authentication for private routes.

### Additional Enhancements
- Skeleton loading states for data fetching.
- Full-screen photo preview for blog images.
- Animations powered by `Framer Motion` and `React Intersection Observer`.

## Technologies Used

### Front-End
- React
- Daisy UI (component library)
- Tailwind CSS (styling)
- Framer Motion (animations)

### Back-End
- Firebase (authentication and hosting)
- MongoDB (database)
- Node.js & Express.js (API)

### Deployment
- Firebase for the client-side.
- Vercel for the server-side.

## Installation & Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd TechSphere
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Add your Firebase and MongoDB credentials in a `.env` file.

4. Run the development server:
   ```bash
   npm start
   ```

5. Navigate to `http://localhost:3000` in your browser.

## Deployment Instructions
- Ensure all environment variables are set correctly in production.
- Add the live domain to Firebase authorization.
- Test private routes and ensure no reload errors on navigation.
