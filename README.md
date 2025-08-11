# VibeSync: Your Mood-Based Playlist Generator

VibeSync is a smart music discovery web application that creates personalized Spotify playlists based on your current mood. You can either describe how you're feeling in your own words or let the app use your camera to instantly detect your emotion and find the perfect soundtrack for your moment.

This project is built with Next.js, TypeScript, Tailwind CSS, ShadCN for UI components, and Google's Genkit for the AI-powered mood analysis.

## ✨ Features

- **AI-Powered Mood Analysis**: Describe your mood using text (e.g., "energetic and happy," "a bit tired," "perfect for a rainy day"), and our AI will determine the ideal musical vibe.
- **Camera-Based Emotion Detection**: Grant camera access and let the app detect your facial expression to automatically suggest a mood.
- **Spotify Integration**: Connects directly to the Spotify API to fetch real, high-quality playlists that you can listen to immediately.
- **Multi-Language Support**: Find playlists in a wide variety of languages, including many Indian languages.
- **Sleek, Modern UI**: A clean, responsive, and user-friendly interface built with ShadCN components and Tailwind CSS.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- **Node.js**: Make sure you have Node.js (version 18 or later) installed. You can download it from [nodejs.org](https://nodejs.org/).
- **npm** or **yarn**: This project uses `npm` for package management, which is included with Node.js.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-folder>
    ```

2.  **Install dependencies:**
    This will install all the necessary packages defined in `package.json`.
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    The application requires API keys to connect to Spotify and Google's AI services.

    - Create a file named `.env` in the root of the project.
    - Copy the contents of the existing `INSTRUCTIONS.md` or the example below into your `.env` file.

    ```env
    # Get your Spotify credentials from https://developer.spotify.com/dashboard/
    SPOTIFY_CLIENT_ID=YOUR_CLIENT_ID_HERE
    SPOTIFY_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE

    # Get your Google AI API Key from https://aistudio.google.com/app/apikey
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
    ```

    - Replace the placeholder values with your actual keys. See `INSTRUCTIONS.md` for a step-by-step guide on getting Spotify keys.

## ▶️ Running the Application

Once the setup is complete, you can run the development server:

```bash
npm run dev
```

This will start the application on `http://localhost:9002` (or another port if 9002 is busy). Open this URL in your web browser to use VibeSync.

## 🛠️ Built With

- [Next.js](https://nextjs.org/) - The React Framework for the Web.
- [TypeScript](https://www.typescriptlang.org/) - Strongly typed programming language that builds on JavaScript.
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapid UI development.
- [ShadCN/UI](https://ui.shadcn.com/) - Re-usable components built using Radix UI and Tailwind CSS.
- [Genkit (Google AI)](https://firebase.google.com/docs/genkit) - The AI toolkit for building powerful, production-ready AI features.
- [Spotify Web API](https://developer.spotify.com/documentation/web-api) - Provides access to Spotify's vast music library.
