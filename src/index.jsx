import React from 'react';
import { createRoot } from 'react-dom/client';

// Global styles and third-party libraries
import 'assets/style.css'; // Your custom global styles
import 'simplebar-react/dist/simplebar.min.css'; // Custom scrollbar styles
import 'assets/third-party/apex-chart.css'; // Apex Chart styles
import 'assets/third-party/react-table.css'; // React Table styles

// Font imports (Google Fonts via @fontsource)
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/700.css';

import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

import '@fontsource/public-sans/400.css';
import '@fontsource/public-sans/500.css';
import '@fontsource/public-sans/600.css';
import '@fontsource/public-sans/700.css';

// React App imports
import App from './App'; // Your main App component
import reportWebVitals from './reportWebVitals'; // Performance measurement

// ==============================|| MAIN - REACT DOM RENDER ||============================== //

const container = document.getElementById('root');
const root = createRoot(container);

// Rendering the React App
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log); // Optionally log performance metrics
