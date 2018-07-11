import './index.css';
import App from './App';
import configureStore from "./redux/utils/store";
import { renderReactApp } from "./redux/utils/render";

const store = configureStore();
const targetElement = document.getElementById( "root" );

renderReactApp( targetElement, App, store );
