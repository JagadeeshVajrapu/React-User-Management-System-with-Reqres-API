# User Management Application

A React application that integrates with the Reqres API to perform basic user management functions.

## Features

- User authentication
- View paginated list of users
- Edit user details
- Delete users
- Responsive design
- Toast notifications for actions
- Protected routes

## Technologies Used

- React
- TypeScript
- React Router for navigation
- React Query for data fetching
- React Hook Form for form handling
- Tailwind CSS for styling
- Axios for API requests
- React Toastify for notifications

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Login using the following credentials:
   - Email: eve.holt@reqres.in
   - Password: cityslicka

2. After logging in, you'll be redirected to the users page where you can:
   - View the list of users
   - Navigate through pages
   - Edit user details
   - Delete users

## Project Structure

```
src/
  ├── components/      # Reusable components
  ├── context/        # Context providers
  ├── pages/          # Page components
  ├── services/       # API services
  ├── types/          # TypeScript types
  ├── App.tsx         # Main App component
  └── main.tsx        # Entry point
```

## API Integration

This application integrates with the Reqres API (https://reqres.in/) for:
- User authentication
- Fetching users
- Updating user details
- Deleting users

## Error Handling

- Form validation for login and edit forms
- Toast notifications for success/error messages
- Protected routes for authenticated users only
- Graceful error handling for API requests