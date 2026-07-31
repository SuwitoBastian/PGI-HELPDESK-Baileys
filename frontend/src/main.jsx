import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import './styles/global.css'
import './styles/helpdesk.css'

import "./styles/theme.css";
import "./styles/utilities.css";
import "./styles/cards.css";
import "./styles/badge.css";
import "./styles/progress.css";
import "./styles/heatmap.css";
import "./styles/section.css";
import "./styles/dashboard.css";
import "./styles/teamRotation.css";
import "./styles/dark.css";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)