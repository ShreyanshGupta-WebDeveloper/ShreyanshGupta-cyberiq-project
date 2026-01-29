# ShreyanshGupta-cyberiq-project
# CyberIQ - Cybersecurity Training Platform

CyberIQ is an advanced cybersecurity logical puzzle platform designed to sharpen your hacking awareness, security logic, and defensive thinking. Test your knowledge of firewalls, phishing, encryption, passwords, network security, and ethical hacking concepts in a fun but realistic way.

## Features

- Interactive cybersecurity quiz with multiple difficulty levels
- Real-time Matrix-style background animation
- Leaderboard system to track top performers
- Professional, responsive design with cyber theme
- Keyboard navigation support
- Accessibility features with ARIA labels

## Current Implementation

The current version stores leaderboard data in browser memory (window.leaderboard). The sample leaderboard includes:
- 1st place: Neon with score 10/10
- 2nd place: Null with score 8/10
- 3rd place: Romio with score 2/10

## Requirements

- A modern web browser

## Installation

1. Clone or download this repository to your local machine
2. Navigate to the project directory
3. Install the required dependencies:

```bash
npm install http-server -g
```

## Running the Application

Simply double-click on `index.html` to open it directly in your browser.

## Data Persistence

The leaderboard data is now stored in the browser's localStorage, which means scores will persist between browser sessions but are specific to each browser/device.

## Project Structure

```
CyberIQ/
├── index.html          # Main HTML file
├── Style.css           # CSS styling
├── Script.js           # JavaScript functionality
├── README.md           # This file
└── (No backend files - all data stored in browser localStorage)
```

## Keyboard Shortcuts

- `1` - Navigate to Home
- `2` - Navigate to Puzzle Test
- `3` - Navigate to Leaderboard
- `4` - Navigate to About
- `Escape` - Return to Home

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Canvas API (for Matrix background)
- Node.js (for backend - optional)
- SQLite (for database - optional)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
