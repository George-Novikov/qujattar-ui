import React from 'react';
import { ElementType } from '../../models/Template';
import PaletteElement from './PaletteElement';
import { useAppSettings } from '../../context/AppSettingsContext';
import './Palette.css';

// SVG content for palette elements
const elementIcons: Record<ElementType, string> = {
  'text': '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m0 0h24v24h-24z" fill="#fff" opacity="0"/><path d="m20 4h-16a1 1 0 0 0 -1 1v3a1 1 0 0 0 2 0v-2h6v13h-2a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-2v-13h6v2a1 1 0 0 0 2 0v-3a1 1 0 0 0 -1-1z" fill="#231f20"/></svg>',
  'image': '<svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><g stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m2 6c0-2.20914 1.79086-4 4-4h12c2.2091 0 4 1.79086 4 4v12c0 2.2091-1.7909 4-4 4h-12c-2.20914 0-4-1.7909-4-4z"/><circle cx="8.5" cy="8.5" r="2.5"/><path d="m14.5262 12.6211-8.5262 9.3789h12.2708c2.0596 0 3.7292-1.6696 3.7292-3.7292 0-.4666-.1749-.9161-.4901-1.26l-4.0295-4.3958c-.7949-.8671-2.1628-.8643-2.9542.0061z"/></g></svg>',
  'shape': '<svg height="32" viewBox="0 0 32 32" width="32" xmlns="http://www.w3.org/2000/svg"><g fill="#090909"><path d="m7.7 4.7a14.7029 14.7029 0 0 0 -3 3.1l1.6 1.2a13.2634 13.2634 0 0 1 2.6-2.7z"/><path d="m4.6 12.3-1.9-.6a12.5111 12.5111 0 0 0 -.7 4.3h2a11.4756 11.4756 0 0 1 .6-3.7z"/><path d="m2.7 20.4a14.4029 14.4029 0 0 0 2 3.9l1.6-1.2a12.8867 12.8867 0 0 1 -1.7-3.3z"/><path d="m7.8 27.3a14.4029 14.4029 0 0 0 3.9 2l.6-1.9a12.8867 12.8867 0 0 1 -3.3-1.7z"/><path d="m11.7 2.7.6 1.9a11.4756 11.4756 0 0 1 3.7-.6v-2a12.5111 12.5111 0 0 0 -4.3.7z"/><path d="m24.2 27.3a15.18 15.18 0 0 0 3.1-3.1l-1.6-1.2a11.526 11.526 0 0 1 -2.7 2.7z"/><path d="m27.4 19.7 1.9.6a15.4747 15.4747 0 0 0 .7-4.3h-2a11.4756 11.4756 0 0 1 -.6 3.7z"/><path d="m29.2 11.6a14.4029 14.4029 0 0 0 -2-3.9l-1.6 1.2a12.8867 12.8867 0 0 1 1.7 3.3z"/><path d="m24.1 4.6a14.4029 14.4029 0 0 0 -3.9-2l-.6 1.9a12.8867 12.8867 0 0 1 3.3 1.7z"/><path d="m20.3 29.3-.6-1.9a11.4756 11.4756 0 0 1 -3.7.6v2a21.4206 21.4206 0 0 0 4.3-.7z"/><path d="m16 26a10 10 0 1 1 10-10 10.0115 10.0115 0 0 1 -10 10zm0-18a8 8 0 1 0 8 8 8.0092 8.0092 0 0 0 -8-8z"/></g><path d="m0 0h32v32h-32z" fill="none"/></svg>',
  'list': '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-list" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><line x1="9" y1="6" x2="20" y2="6" /><line x1="9" y1="12" x2="20" y2="12" /><line x1="9" y1="18" x2="20" y2="18" /><line x1="5" y1="6" x2="5" y2="6.01" /><line x1="5" y1="12" x2="5" y2="12.01" /><line x1="5" y1="18" x2="5" y2="18.01" /></svg>',
  'table': '<svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="m2 5.5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v13a2 2 0 0 1 -2 2h-16a2 2 0 0 1 -2-2zm9 0h-7v3h7zm2 0v3h7v-3zm7 5h-7v3h7zm0 5h-7v3h7zm-9 3v-3h-7v3zm-7-5h7v-3h-7z" fill="#0d0d0d"/></svg>',
  'pagebreak': '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-page-break" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M19 18v1a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-1" /><path d="M3 14h3m4.5 0h3m4.5 0h3" /><path d="M5 10v-5a2 2 0 0 1 2 -2h7l5 5v2" /></svg>',
  'pagenumber': '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-number-1" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><circle cx="12" cy="12" r="9" /><path d="M10 10l2 -2v8" /></svg>',
  'pagetotal': '<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path d="m128 24a104 104 0 1 0 104 104 104.11791 104.11791 0 0 0 -104-104zm12 152a8 8 0 0 1 -16 0v-77.05566l-11.56348 7.70605a8.00008 8.00008 0 1 1 -8.873-13.31445l24-15.99317a8.00039 8.00039 0 0 1 12.43648 6.65723z"/></svg>',
  'datetime': '<svg height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><g style="stroke:#000;stroke-width:2;fill:none;fill-rule:evenodd;stroke-linecap:round;stroke-linejoin:round" transform="translate(-2 -2)"><circle cx="15.5" cy="15.5" r="5.5"/><path d="m15.5 13.3440934v2.1559066l1.5 1.5"/><path d="m17 3v2"/><path d="m7 3v2"/><path d="m8.03064542 21c-.60514416 0-1.51286041 0-2.72314874 0-.80236687 0-1.09332448-.0781689-1.38665781-.2249539-.29333334-.1467849-.52354305-.3621858-.68041944-.6366497-.15687638-.274464-.24041943-.546705-.24041943-1.2974576v-11.68187758c0-.75075262.08354305-1.02299366.24041943-1.2974576.15687639-.27446394.3870861-.48986484.68041944-.63664976.29333333-.14678492.58429094-.22495386 1.38665781-.22495386h13.38500662c.8023669 0 1.0933245.07816894 1.3866578.22495386.2933334.14678492.5235431.36218582.6804195.63664976.1568763.27446394.2404194 1.38511527.2404194 2.1358679"/></g></svg>',
  'url': '<svg height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="m103.7248 1125.0442-5.45-5.733c-.189-.198-.451-.311-.725-.311h-11.55c-1.104 0-2 .896-2 2v7c0 .552.448 1 1 1 .553 0 1-.448 1-1v-6c0-.552.448-1 1-1h9v4c0 1.105.896 2 2 2h4v1c0 .552.448 1 1 1 .553 0 1-.448 1-1v-2.267c0-.256-.098-.503-.275-.689m-8.725 8.956c0-.552-.447-1-1-1h-1v2h1c.553 0 1-.447 1-1m.725 2.449.631 1.263c.296.592-.134 1.288-.796 1.288h-.01c-.337 0-.645-.19-.796-.492l-.754-1.508h-1v1.11c0 .492-.398.89-.89.89h-.22c-.491 0-.89-.398-.89-.89v-6.22c0-.491.399-.89.89-.89h1.963c1.562 0 2.971 1.13 3.131 2.684.118 1.142-.41 2.166-1.259 2.765m7.275.551h-2.5c-.276 0-.5-.224-.5-.5v-4.5c0-.552-.447-1-1-1-.552 0-1 .448-1 1v5 1c0 .552.448 1 1 1h1 3c.553 0 1-.448 1-1s-.447-1-1-1m-13-5.11v4.11c0 1.711-1.431 3.087-3.161 2.996-1.622-.085-2.839-1.541-2.839-3.166v-3.94c0-.491.399-.89.89-.89h.22c.492 0 .89.399.89.89v4.11c0 .552.448 1 1 1 .553 0 1-.448 1-1v-4.11c0-.491.399-.89.89-.89h.22c.492 0 .89.399.89.89" fill-rule="evenodd" transform="translate(-84 -1119)"/></svg>',
  'codeblock': '<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path d="m71.68213 97.21875-36.9375 30.78125 36.9375 30.78125a12 12 0 0 1 -15.36426 18.4375l-48-40a12.00005 12.00005 0 0 1 0-18.4375l48-40a12 12 0 1 1 15.36426 18.4375zm176 21.5625-48-40a12 12 0 1 0 -15.36426 18.4375l36.9375 30.78125-36.9375 30.78125a12 12 0 0 0 15.36426 18.4375l48-40a12.00005 12.00005 0 0 0 0-18.4375zm-83.58106-90.05859a12.0021 12.0021 0 0 0 -15.37841 7.17675l-64 176a11.99972 11.99972 0 1 0 22.55468 8.20118l64-176a11.99923 11.99923 0 0 0 -7.17627-15.37793z"/></svg>'
};

const Palette: React.FC = () => {
  const { settings } = useAppSettings();
  
  if (!settings.showPalette) {
    return null;
  }
  
  const elements: ElementType[] = [
    'text',
    'image',
    'shape',
    'list',
    'table',
    'pagebreak',
    'pagenumber',
    'pagetotal',
    'datetime',
    'url',
    'codeblock'
  ];
  
  return (
    <div className="palette">
      <div className="palette-header">
        <span>Palette</span>
      </div>
      <div className="palette-elements">
        {elements.map(type => (
          <PaletteElement
            key={type}
            type={type}
            icon={elementIcons[type]}
            label={type.charAt(0).toUpperCase() + type.slice(1)}
          />
        ))}
      </div>
    </div>
  );
};

export default Palette;