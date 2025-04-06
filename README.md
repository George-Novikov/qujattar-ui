# Document Template Editor

A dynamic document template creation web application built with React, TypeScript, and Vite.

## Features

- Dynamic document template creation with intuitive UI
- Various template elements: text, images, shapes, lists, tables, etc.
- Drag-and-drop functionality for easy template editing
- Resizable elements with customizable properties
- Template structure management with tree view
- Export/import templates in various formats (JSON, ODT, DOC)
- Undo/Redo support
- Theme customization
- Auto-save functionality
- User authentication

## Tech Stack

- React 18
- TypeScript
- Vite
- CSS (no external UI libraries)

## Getting Started

### Prerequisites

- Node.js 20.11.1 or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/document-template-editor.git
cd document-template-editor
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Building for Production

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `build/` directory.

## Project Structure

```
src/
├── assets/            # Static assets like icons
├── components/        # UI components
│   ├── Canvas/        # Canvas and element rendering
│   ├── Header/        # Application header with menus
│   ├── Palette/       # Element palette
│   ├── Properties/    # Property panels
│   ├── Tree/          # Structure tree view
│   └── UI/            # Reusable UI components
├── context/           # React context providers
├── hooks/             # Custom React hooks
├── models/            # TypeScript data models
├── services/          # API services
├── utils/             # Utility functions
├── App.tsx            # Main App component
└── main.tsx           # Entry point
```

## Future Development

- Backend integration with Java 21 / Spring Boot / PostgreSQL
- Enhanced element placement with snapping and alignment guides
- Template preview functionality
- More export formats (PDF, HTML)
- Advanced template features like conditional rendering
- Collaborative editing

## License

This project is licensed under the MIT License - see the LICENSE file for details.