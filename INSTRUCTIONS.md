# Getting Spotify API Credentials

To connect the VibeSync app to Spotify, you need to get a **Client ID** and **Client Secret**.

Follow these steps:

1.  **Go to the Spotify Developer Dashboard:**
    *   Open your web browser and navigate to [https://developer.spotify.com/dashboard/](https://developer.spotify.com/dashboard/).
    *   Log in with your Spotify account. If you don't have one, you'll need to create one.

2.  **Create a New App:**
    *   Once you're logged in, click the "**Create app**" button.
    *   A dialog box will appear. Give your app a **Name** (e.g., "VibeSync") and a short **Description**.
    *   Agree to the terms and conditions, then click "**Create**".

3.  **Get Your Credentials:**
    *   After creating the app, you will be taken to its dashboard.
    *   You will see your **Client ID** displayed. Click "**Show client secret**" to reveal your **Client Secret**.

4.  **Add Credentials to Your Project:**
    *   Copy the **Client ID** and **Client Secret**.
    *   Open the `.env` file in this project.
    *   Paste your credentials into the corresponding variables:
        ```
        SPOTIFY_CLIENT_ID=YOUR_CLIENT_ID_HERE
        SPOTIFY_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
        ```

5.  **Save and Restart:**
    *   Save the `.env` file.
    *   If your development server is running, you will need to restart it for the new environment variables to be loaded.

That's it! Your application should now be able to connect to the Spotify API and fetch real playlists.
