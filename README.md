# 🏢 Bookit - Room Booking Platform

A modern, full-stack room booking application built with Next.js 15, Appwrite, and Tailwind CSS. Bookit allows users to discover, book, and manage meeting rooms and event spaces with real-time availability checking.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Components Overview](#-components-overview)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🔐 Authentication & Authorization

- **User Registration & Login** with Appwrite Auth
- **Session Management** with secure cookies
- **Protected Routes** with middleware
- **Role-based Access** (Users can create rooms and manage bookings)

### 🏠 Room Management

- **Room Discovery** with search and filtering
- **Room Creation** with image upload support
- **Room Details** with comprehensive information
- **My Rooms** dashboard for room owners
- **Room Deletion** with confirmation

### 📅 Booking System

- **Real-time Availability Checking** with overlap detection
- **Dynamic Schedule Display** showing time slot availability
- **Booking Form** with date/time selection
- **Booking Management** (view, cancel bookings)
- **Availability Status** with visual indicators

### 📱 Responsive Design

- **Mobile-first Design** with Tailwind CSS
- **Responsive Header** with hamburger menu
- **Adaptive Layouts** for all screen sizes
- **Touch-friendly Interface** for mobile devices

### 🎨 User Experience

- **Toast Notifications** for user feedback
- **Loading States** and animations
- **Form Validation** with error handling
- **Image Optimization** with Next.js Image component
- **Real-time Updates** with revalidation

## 🛠 Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 18** - UI library with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Icon library
- **React Toastify** - Toast notifications
- **Luxon** - Date/time manipulation

### Backend & Database

- **Appwrite** - Backend-as-a-Service
- **Appwrite Database** - NoSQL database
- **Appwrite Storage** - File storage for images
- **Appwrite Auth** - Authentication service

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

## 📁 Project Structure

```
bookit/
├── app/                          # Next.js App Router
│   ├── actions/                  # Server Actions
│   │   ├── bookRoom.js          # Room booking logic
│   │   ├── cancelBooking.js     # Booking cancellation
│   │   ├── checkAuth.js         # Authentication check
│   │   ├── checkRoomAvailability.js # Availability checking
│   │   ├── createRoom.js        # Room creation
│   │   ├── createSession.js     # Session management
│   │   ├── createUser.js        # User registration
│   │   ├── deleteRoom.js        # Room deletion
│   │   ├── destroySession.jsx   # Logout functionality
│   │   ├── getAllRooms.js       # Fetch all rooms
│   │   ├── getMyBookings.js     # User's bookings
│   │   ├── getMyRooms.js        # User's rooms
│   │   └── getSingleRoom.js     # Single room details
│   ├── bookings/                # Bookings page
│   ├── login/                   # Login page
│   ├── register/                # Registration page
│   ├── rooms/                   # Room pages
│   │   ├── [id]/               # Individual room page
│   │   ├── add/                # Add room page
│   │   └── my/                 # My rooms page
│   ├── layout.jsx              # Root layout
│   ├── page.jsx                # Home page
│   └── favicon.ico
├── components/                  # React Components
│   ├── AuthWrapper.jsx         # Authentication wrapper
│   ├── BookingCard.jsx         # Booking display card
│   ├── BookingForm.jsx         # Room booking form
│   ├── CancelBookingButton.jsx # Booking cancellation
│   ├── DeleteRoomButton.jsx    # Room deletion
│   ├── DynamicSchedule.jsx     # Real-time schedule
│   ├── Footer.jsx              # Site footer
│   ├── Header.jsx              # Navigation header
│   ├── Heading.jsx             # Page headings
│   ├── MyRoomCard.jsx          # User's room card
│   └── RoomCard.jsx            # Room display card
├── config/                     # Configuration
│   └── appwrite.js             # Appwrite client setup
├── context/                    # React Context
│   └── authContext.js          # Authentication context
├── assets/                     # Static assets
│   ├── images/                 # Image files
│   └── styles/                 # Global styles
├── public/                     # Public assets
├── middleware.js               # Next.js middleware
├── next.config.mjs             # Next.js configuration
├── package.json                # Dependencies
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Appwrite account

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/bookit.git
   cd bookit
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up Appwrite**

   - Create a new project in [Appwrite Console](https://cloud.appwrite.io)
   - Create a database named `bookit-db`
   - Create collections: `rooms`, `bookings`, `users`
   - Create storage bucket for room images
   - Generate API keys

4. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your Appwrite credentials (see [Environment Variables](#-environment-variables))

5. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT=your-project-id
NEXT_PUBLIC_APPWRITE_DATABASE=bookit-db
NEXT_PUBLIC_APPWRITE_TABLES_Rooms=rooms
NEXT_PUBLIC_APPWRITE_TABLES_BOOKINGS=bookings
NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ROOMS=room-images
APPWRITE_API_KEY=your-api-key
```

### Required Appwrite Setup

1. **Database**: `bookit-db`
2. **Collections**:
   - `rooms` - Room information
   - `bookings` - Booking records
3. **Storage**: `room-images` bucket for room photos
4. **Auth**: Enable email/password authentication

## 📚 API Documentation

### Server Actions

#### `bookRoom(formData)`

Creates a new room booking with availability checking.

**Parameters:**

- `room_id` - Room identifier
- `check_in_date` - Check-in date (YYYY-MM-DD)
- `check_in_time` - Check-in time (HH:MM)
- `check_out_date` - Check-out date (YYYY-MM-DD)
- `check_out_time` - Check-out time (HH:MM)

**Returns:**

```javascript
{
  success: boolean,
  message?: string,
  error?: string
}
```

#### `checkRoomAvailability(roomId, checkIn, checkOut)`

Checks if a room is available for the specified time period.

**Parameters:**

- `roomId` - Room identifier
- `checkIn` - Check-in datetime (ISO string)
- `checkOut` - Check-out datetime (ISO string)

**Returns:**

```javascript
boolean; // true if available, false if not
```

#### `getMyBookings()`

Fetches all bookings for the authenticated user.

**Returns:**

```javascript
Array<{
  $id: string,
  room_id: string,
  check_in: string,
  check_out: string,
  userId: string,
  room_name: string,
  room_location: string
}>
```

## 🧩 Components Overview

### Core Components

#### `Header.jsx`

Responsive navigation header with:

- Logo and branding
- Desktop/mobile navigation
- Authentication state
- Hamburger menu for mobile

#### `RoomCard.jsx`

Room display card featuring:

- Room image and details
- Dynamic availability status
- Real-time schedule display
- Responsive design

#### `BookingForm.jsx`

Advanced booking form with:

- Real-time availability checking
- Form validation
- Date/time pickers
- Dynamic status updates

#### `DynamicSchedule.jsx`

Real-time schedule component showing:

- Time slot availability
- Visual status indicators
- Live updates
- Color-coded status

### Authentication Components

#### `AuthWrapper.jsx`

Authentication wrapper providing:

- Route protection
- Loading states
- Redirect handling

## 🗄 Database Schema

### Rooms Collection

```javascript
{
  $id: string,           // Document ID
  name: string,          // Room name
  description: string,   // Room description
  sqft: number,          // Room size
  capacity: number,      // Max occupancy
  location: string,      // Room location
  address: string,       // Full address
  availability: string,  // General availability
  price_per_hour: number, // Hourly rate
  amenities: string,     // Room amenities
  image: string,         // Image file ID
  user_id: string        // Owner ID
}
```

### Bookings Collection

```javascript
{
  $id: string,           // Document ID
  room_id: string,       // Room reference
  check_in: string,       // Check-in datetime
  check_out: string,     // Check-out datetime
  userId: string         // User reference
}
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically on push

### Manual Deployment

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

### Environment Setup for Production

Ensure all environment variables are set in your deployment platform:

- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Environment Variables
- Railway: Project Settings → Variables

## 🔒 Security Features

- **Server-side validation** for all forms
- **Authentication middleware** for protected routes
- **CSRF protection** with Next.js
- **Secure session management** with Appwrite
- **Input sanitization** and validation
- **File upload security** with type checking

## 🎨 Styling & Design

- **Tailwind CSS** for utility-first styling
- **Responsive design** with mobile-first approach
- **Dark/light mode** support (ready for implementation)
- **Custom components** with consistent design system
- **Accessibility** features with proper ARIA labels

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Room creation and management
- [ ] Booking creation and cancellation
- [ ] Availability checking
- [ ] Responsive design on mobile/tablet/desktop
- [ ] Image upload functionality
- [ ] Error handling and validation

### Automated Testing (Future Enhancement)

```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react

# Run tests
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Appwrite](https://appwrite.io/) for the backend services
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [React Icons](https://react-icons.github.io/react-icons/) for the icon library

## 📞 Support

If you have any questions or need help with the project:

- Create an issue on GitHub
- Check the documentation
- Review the code comments

---

**Made with ❤️ by [Your Name]**

_Happy Booking! 🏢✨_
