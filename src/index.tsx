import React from "react";
import { createRoot } from "react-dom/client";
import dayjs from "dayjs";
import "dayjs/locale/id";
import App from "./App";
import "./index.css";

// Set default locale Dayjs ke bahasa Indonesia
dayjs.locale("id");

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
