# Floorball Scoreboard

This project is a simple floorball scoreboard application designed for touchscreen devices. It allows users to manage the scores of two teams and control the game timer.

## Features

- Input team names
- Increment and decrement scores for each team
- Start, pause, and reset the game timer
- Responsive design suitable for touchscreen devices

## Project Structure

```
floorball-scoreboard
├── src
│   ├── App.tsx
│   ├── components
│   │   ├── Scoreboard.tsx
│   │   ├── TeamPanel.tsx
│   │   └── Controls.tsx
│   ├── styles
│   │   └── index.css
│   └── index.tsx
├── public
│   └── index.html
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd floorball-scoreboard
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Usage

To start the application, run:
```
npm start
```
This will launch the application in your default web browser.

## Development

- The main application logic is contained in `src/App.tsx`.
- The scoreboard display is handled by `src/components/Scoreboard.tsx`.
- Team management is done in `src/components/TeamPanel.tsx`.
- Timer controls are implemented in `src/components/Controls.tsx`.
- Styles are defined in `src/styles/index.css`.

## License

This project is licensed under the MIT License.