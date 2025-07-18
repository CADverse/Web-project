# CADverse - Frontend Only

A modern, responsive frontend for CADverse - a 3D modeling and prototyping service website.

## 🚀 Features

- **Modern Design**: Clean, professional UI with dark/light theme support
- **Responsive Layout**: Optimized for all device sizes
- **Interactive Components**: Smooth animations and micro-interactions
- **Project Showcase**: Dynamic project gallery with detailed views
- **Service Sections**: File upload interfaces and contact forms
- **Frontend-Only**: No backend dependencies - pure client-side application

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- **React Router** for navigation

## 📦 Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## 🏃‍♂️ Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (theme, etc.)
├── data/              # Static data (projects, etc.)
├── pages/             # Page components
├── styles/            # Global styles
└── main.tsx           # Application entry point
```

## 🎨 Key Components

- **Navigation**: Responsive navigation with theme toggle
- **Hero**: Animated landing section with engineering tools
- **Projects**: Interactive project gallery with routing
- **Services**: File upload simulation and contact forms
- **Contact**: Contact form with validation (frontend-only)

## 🔧 Frontend-Only Features

This version has been converted to be completely frontend-only:

- ✅ All forms work with client-side validation
- ✅ File uploads simulate backend interaction
- ✅ Contact forms show success/error messages
- ✅ No external API dependencies
- ✅ Safe to deploy anywhere (Netlify, Vercel, etc.)

## 🚀 Deployment

This is a static frontend application that can be deployed to:

- **Netlify**: Drag and drop the `dist` folder
- **Vercel**: Connect your Git repository
- **GitHub Pages**: Use the built files
- **Any static hosting service**

## 📝 Notes

- All backend functionality has been removed
- Forms simulate submission with success messages
- File uploads validate files but don't actually upload
- Console logs show form/file data for development
- Easy to reconnect to a backend later if needed

## 🔮 Future Backend Integration

To reconnect to a backend later:

1. Restore the `src/utils/api.ts` and `src/config/api.ts` files
2. Update the API endpoints in the configuration
3. Replace simulation functions with actual API calls
4. Add proper error handling for network requests

## 📄 License

This project is for demonstration purposes.