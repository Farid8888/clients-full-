import React from "react";
import ReactDOM from "react-dom/client";
import SettingsProvider from "contexts/settingsContext";
import App from "./App";

// third-party library css
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "nprogress/nprogress.css";
import "react-quill/dist/quill.snow.css";
import "simplebar-react/dist/simplebar.min.css";
import "pure-react-carousel/dist/react-carousel.es.css";
import "react-credit-cards-2/dist/es/styles-compiled.css";
const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

//<React.StrictMode> вызывает двойной рендер компонентов и соответственно дублирует запросы
root.render(
    <SettingsProvider>
      <App />
    </SettingsProvider>
  );

// // https://github.com/atlassian/react-beautiful-dnd/issues/2407
// root.render(
//   <SettingsProvider>
//     <App />
//   </SettingsProvider>
// );