export type PaperFormat = 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'A6';
export type Orientation = 'VERTICAL' | 'LANDSCAPE';
export type AccessType = 'PRIVATE' | 'PUBLIC';

export interface TemplateProps {
  title: string;
  orientation: Orientation;
  format: PaperFormat;
  snapToGrid: boolean;
  background?: string;
  access: AccessType;
  authorID?: number;
}

export interface Template {
  id?: number;
  props: TemplateProps;
  columns: Column[];
}

export interface ElementProps {
  height?: number;
  width?: number;
  x?: number;
  y?: number;
  background?: string;
  color?: string;
  horizontalAlignment?: 'left' | 'center' | 'right';
  verticalAlignment?: 'top' | 'center' | 'bottom';
  font?: string;
  fontSize?: string;
  fontStyle?: Array<'regular' | 'bold' | 'italic' | 'underlined' | 'strikethrough'>;
  src?: string;
  opacity?: number;
  innerMargin?: number;
  outerMargin?: number;
  borders?: {
    width: number;
    color: string;
  };
  cornerRadius?: number;
  layer?: number;
  shadow?: string; // format: "size;color;intensity"
  glow?: string; // format: "size;color;intensity"
  rules?: {
    [elementId: string]: {
      condition: 'EQUALS' | 'CONTAINS' | 'STARTS_WITH' | 'ENDS_WITH' | 'NOT_EMPTY' | 'EMPTY';
      value?: string;
    };
  };
  // Additional properties for specific element types
  current?: boolean;
  date?: boolean;
  time?: boolean;
  format?: string;
  language?: string;
}

export interface Column {
  order: number;
  props: ElementProps;
  rows: Row[];
}

export interface Row {
  order: number;
  props: ElementProps;
  elements: TemplateElement[];
}

export type ElementType = 
  | 'text' 
  | 'image' 
  | 'shape' 
  | 'list' 
  | 'table' 
  | 'pagebreak' 
  | 'pagenumber' 
  | 'pagetotal' 
  | 'datetime' 
  | 'url' 
  | 'codeblock';

export interface TemplateElement {
  id: string;
  order: number;
  type: ElementType;
  values: any[];
  props: ElementProps;
}

// Helper function to create a new template with default values
export const createNewTemplate = (): Template => {
  return {
    props: {
      title: 'New Template',
      orientation: 'VERTICAL',
      format: 'A4',
      snapToGrid: false,
      access: 'PRIVATE',
      background: '#FFFFFF'
    },
    columns: [
      {
        order: 0,
        props: {
          height: 100,
          width: 100,
          x: 50,
          y: 50
        },
        rows: [
          {
            order: 0,
            props: {
              height: 100,
              width: 100,
              x: 50,
              y: 50
            },
            elements: []
          }
        ]
      }
    ]
  };
};

// Helper function to generate a unique element ID based on type
export const generateElementId = (type: ElementType, elements: TemplateElement[]): string => {
  const typeElements = elements.filter(element => element.type === type);
  const nextIndex = typeElements.length + 1;
  return `${type}-${nextIndex}`;
};

export interface TableColumn {
  id: string;
  name: string;
  order: number;
  props: ElementProps;
}

export interface TableRow {
  id: string;
  order: number;
  props: ElementProps;
  cells: { [columnId: string]: string };
}

export interface TableElementData {
  columns: TableColumn[];
  rows: TableRow[];
  settings: {
    borders: boolean;
    headerRow: boolean;
  };
}