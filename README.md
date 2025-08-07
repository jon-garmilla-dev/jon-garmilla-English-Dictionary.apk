# English Dictionary Mobile App

An intuitive mobile application built with Expo to help you search for English words, view their definitions, and maintain a history of your searches.

## Features

*   **Word Search:** Look up English words using the Datamuse and DictionaryAPI.
*   **Detailed Definitions:** View comprehensive details including phonetics, definitions, and synonyms.
*   **Search History:** Save words to a daily list and review your search history over time.
*   **Light & Dark Mode:** The app adapts to your system's theme.

## App Installation (Android)

You can download and install the latest version of the app directly from the releases page:

*   [**Latest Release**](https://github.com/jon-garmilla-dev/jon-garmilla-English-Dictionary-mobile/releases)

## Project Structure

The project is organized into the following main directories:

*   **/app:** Contains all the screens and navigation logic, managed by Expo Router.
*   **/components:** Reusable React components used throughout the app.
*   **/constants:** Global constants like theme colors.
*   **/context:** React Context providers for state management.
*   **/hooks:** Custom React hooks for shared logic.
*   **/assets:** Static assets like fonts and images.

## Development Setup

### Prerequisites

*   Node.js (v18 or newer)
*   npm or yarn
*   Expo CLI

### Project Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/jon-garmilla-dev/jon-garmilla-English-Dictionary-mobile.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd jon-garmilla-English-Dictionary-mobile
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the App for Development

To run the app on your local device for testing, ensure your computer and mobile device are on the same network. Then, run the following command to start the Expo development server:

```bash
npm start -- --clear
```

Scan the QR code with the Expo Go app on your device to launch the app.

## Development Workflow & Contributing

The contribution workflow is designed to be simple and efficient.

1.  **Sync with the latest changes:**
    Before starting any work, pull the latest changes from the `main` branch.
    ```bash
    git pull origin main --no-rebase
    ```
2.  **Make your changes:**
    Work on your feature or bugfix and make commits as you go.
3.  **Push your changes:**
    Once you are done, push your commits to the repository.
    ```bash
    git push
    ```
4.  **Run CI/CD Actions:**
    After pushing, you must manually trigger the "Build and Release Android APK" GitHub Actions workflow to run tests and build the app.

## Changelog

All notable changes to this project are documented in the [CHANGELOG.md](CHANGELOG.md) file.

## Tech Stack

*   **React Native:** A framework for building native apps using React.
*   **Expo:** A platform for making universal React applications.
*   **Expo Router:** A file-based router for React Native and web applications.
*   **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript.

## License

This project is licensed under the MIT License.
