import React, { useState } from 'react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import './Header.css';

interface HelpMenuProps {
  onClose: () => void;
}

const HelpMenu: React.FC<HelpMenuProps> = ({ onClose }) => {
  const [isDocumentationOpen, setIsDocumentationOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  
  return (
    <>
      <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
        <div className="dropdown-menu-item" onClick={() => setIsDocumentationOpen(true)}>
          <span>Documentation</span>
        </div>
        
        <div className="dropdown-menu-item" onClick={() => setIsShortcutsOpen(true)}>
          <span>Shortcuts</span>
        </div>
        
        <div className="dropdown-menu-divider"></div>
        
        <div className="dropdown-menu-item" onClick={() => setIsAboutOpen(true)}>
          <span>About</span>
        </div>
      </div>
      
      {/* Documentation Modal */}
      <Modal
        isOpen={isDocumentationOpen}
        onClose={() => setIsDocumentationOpen(false)}
        title="Documentation"
        size="large"
        footer={
          <Button onClick={() => setIsDocumentationOpen(false)}>Close</Button>
        }
      >
        <div className="documentation-content">
          <h3>Getting Started</h3>
          <p>Welcome to the Template Editor! This application allows you to create dynamic document templates with a variety of elements.</p>
          
          <h4>Basic Usage</h4>
          <ul>
            <li>Drag elements from the Palette at the bottom of the screen onto the Canvas.</li>
            <li>Use the Properties panel on the right to customize elements.</li>
            <li>Use the Tree view on the left to navigate the template structure.</li>
            <li>Save your work using File → Save.</li>
          </ul>
          
          <h4>Template Elements</h4>
          <p>The following elements are available in the Palette:</p>
          <ul>
            <li><strong>Text:</strong> Add text content to your template.</li>
            <li><strong>Image:</strong> Insert images from URLs or uploaded files.</li>
            <li><strong>Shape:</strong> Add various shapes like lines, circles, and rectangles.</li>
            <li><strong>List:</strong> Create bulleted or numbered lists.</li>
            <li><strong>Table:</strong> Insert data tables with multiple columns.</li>
            <li><strong>Page Break:</strong> Force a new page in the document.</li>
            <li><strong>Page Number:</strong> Show the current page number.</li>
            <li><strong>Total Pages:</strong> Show the total number of pages.</li>
            <li><strong>Date/Time:</strong> Insert current date and/or time.</li>
            <li><strong>URL:</strong> Add clickable hyperlinks.</li>
            <li><strong>Code Block:</strong> Insert code with syntax highlighting.</li>
          </ul>
        </div>
      </Modal>
      
      {/* Shortcuts Modal */}
      <Modal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        title="Keyboard Shortcuts"
        size="medium"
        footer={
          <Button onClick={() => setIsShortcutsOpen(false)}>Close</Button>
        }
      >
        <div className="shortcuts-content">
          <h4>File Operations</h4>
          <ul className="shortcut-list">
            <li><span className="shortcut-key">Ctrl+N</span> New Template</li>
            <li><span className="shortcut-key">Ctrl+O</span> Open Template</li>
            <li><span className="shortcut-key">Ctrl+S</span> Save Template</li>
          </ul>
          
          <h4>Editing</h4>
          <ul className="shortcut-list">
            <li><span className="shortcut-key">Ctrl+Z</span> Undo</li>
            <li><span className="shortcut-key">Ctrl+Y</span> Redo</li>
            <li><span className="shortcut-key">Ctrl+X</span> Cut</li>
            <li><span className="shortcut-key">Ctrl+C</span> Copy</li>
            <li><span className="shortcut-key">Ctrl+V</span> Paste</li>
            <li><span className="shortcut-key">Delete</span> Delete Selected Element</li>
          </ul>
          
          <h4>View</h4>
          <ul className="shortcut-list">
            <li><span className="shortcut-key">Ctrl++</span> Zoom In</li>
            <li><span className="shortcut-key">Ctrl+-</span> Zoom Out</li>
            <li><span className="shortcut-key">Ctrl+0</span> Reset Zoom</li>
          </ul>
        </div>
      </Modal>
      
      {/* About Modal */}
      <Modal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        title="About Template Editor"
        size="small"
        footer={
          <Button onClick={() => setIsAboutOpen(false)}>Close</Button>
        }
      >
        <div className="about-content">
          <h3>Template Editor</h3>
          <p>Version 1.0.0</p>
          <p>A dynamic document template editor built with React and TypeScript.</p>
          <p>© 2025 All Rights Reserved</p>
        </div>
      </Modal>
    </>
  );
};

export default HelpMenu;