import React, { useState } from 'react';
import './Tree.css';

interface TreeItemProps {
  label: string;
  children?: React.ReactNode;
  isSelected?: boolean;
  isExpanded?: boolean;
  isTemplate?: boolean;
  onClick?: () => void;
}

const TreeItem: React.FC<TreeItemProps> = ({
  label,
  children,
  isSelected = false,
  isExpanded: initialExpanded = false,
  isTemplate = false,
  onClick
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const hasChildren = !!children;
  
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };
  
  const getIconType = () => {
    if (isTemplate) return 'template';
    
    // Determine icon based on label prefix
    if (label.startsWith('Column')) return 'column';
    if (label.startsWith('Row')) return 'row';
    if (label.startsWith('Text')) return 'text';
    if (label.startsWith('Image')) return 'image';
    if (label.startsWith('Shape')) return 'shape';
    if (label.startsWith('List')) return 'list';
    if (label.startsWith('Table')) return 'table';
    if (label.startsWith('Page break')) return 'pagebreak';
    if (label.startsWith('Page number')) return 'pagenumber';
    if (label.startsWith('Total pages')) return 'pagetotal';
    if (label.startsWith('Date')) return 'datetime';
    if (label.startsWith('URL')) return 'url';
    if (label.startsWith('Code')) return 'codeblock';
    
    return 'item';
  };
  
  return (
    <div className="tree-item-container">
      <div 
        className={`tree-item ${isSelected ? 'selected' : ''}`}
        onClick={onClick}
      >
        {hasChildren && (
          <span className="tree-item-toggle" onClick={handleToggle}>
            {isExpanded ? '▼' : '►'}
          </span>
        )}
        
        <span className={`tree-item-icon ${getIconType()}`}></span>
        <span className="tree-item-label">{label}</span>
      </div>
      
      {hasChildren && isExpanded && (
        <div className="tree-item-children">
          {children}
        </div>
      )}
    </div>
  );
};

export default TreeItem;