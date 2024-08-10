
# Available - A React Kiosk App with Google Calendar and Giphy Integration

Available is a React-based web application designed to run in kiosk mode on a Raspberry Pi. It displays whether you are currently in a meeting or available by fetching data from your Google Calendar and displaying relevant GIFs using the Giphy API.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Clone the Repository](#clone-the-repository)
  - [Get Google Auth Key](#get-google-auth-key)
  - [Get Giphy API Key](#get-giphy-api-key)
  - [Set Up Environment Variables](#set-up-environment-variables)
- [Running the Project](#running-the-project)
  - [Using Dev Container](#using-dev-container)
  - [Running Locally](#running-locally)
- [Deploying on Raspberry Pi](#deploying-on-raspberry-pi)
  - [Running in Kiosk Mode](#running-in-kiosk-mode)
- [License](#license)

## Features

- **Google Calendar Integration**: Checks your Google Calendar for upcoming events and determines your availability.
- **Giphy Integration**: Displays GIFs from Giphy based on your availability status.
- **Kiosk Mode**: Designed to run full-screen on a Raspberry Pi in kiosk mode.

## Prerequisites

- Node.js and npm
- Google Account for Calendar API
- Giphy Account for API access
- Docker and VS Code (for using the development container)

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/your-username/available.git
cd available
```

### Get Google Auth Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project.
3. Enable the **Google Calendar API** for your project.
4. Go to the **Credentials** section.
5. Create **OAuth 2.0 Client IDs** credentials:
   - Application type: **Web application**
   - Authorized redirect URIs: `http://localhost`
6. Download the credentials JSON file and extract your **Client ID**.

### Get Giphy API Key

1. Sign up or log in to [Giphy Developers](https://developers.giphy.com/).
2. Create a new app.
3. Copy the **API Key** provided by Giphy.

### Set Up Environment Variables

Create a `.env` file in the root of the project with the following content:

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
VITE_GIPHY_API_KEY=your-giphy-api-key-here
```

Replace `your-google-client-id-here` and `your-giphy-api-key-here` with the actual keys obtained from Google and Giphy.

## Running the Project

### Using Dev Container

This project is configured to use a development container for a consistent development environment.

1. **Open the project in VS Code**.
2. **Reopen the project in a Dev Container**:
   - Press `F1`, type "Remote-Containers: Reopen in Container" and select it.
3. **The container will automatically build and start**, installing all dependencies.

### Running Locally

If you prefer running the project locally:

1. **Install dependencies**:

    ```bash
    npm install
    ```

2. **Run the project**:

    ```bash
    npm run dev
    ```

3. **Open your browser** and navigate to `http://localhost:5147` to see the app in action.

## Deploying on Raspberry Pi

### Running in Kiosk Mode

1. **Build the project**:

    ```bash
    npm run build
    ```

2. **Serve the app using pm2**:

    ```bash
    sudo npm install -g pm2
    pm2 serve dist 5000 --name "available"
    pm2 startup
    pm2 save
    ```

3. **Set up Chromium in kiosk mode**:
   - Edit the autostart file:

     ```bash
     sudo nano /etc/xdg/lxsession/LXDE-pi/autostart
     ```

   - Add the following lines:

     ```bash
     @xset s off
     @xset -dpms
     @xset s noblank
     @chromium-browser --noerrdialogs --disable-infobars --kiosk http://localhost:5000
     ```

4. **Reboot the Raspberry Pi**:

    ```bash
    sudo reboot
    ```

5. Your app should now automatically start in kiosk mode on boot.

## License

<p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><a property="dct:title" rel="cc:attributionURL" href="https://github.com/DavidBates/available">Available</a> by <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://github.com/DavidBates">David Bates</a> is licensed under <a href="https://creativecommons.org/licenses/by/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">CC BY 4.0<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1" alt=""><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1" alt=""></a></p>
