import './index.css';
import App from './App';
import configureStore from "./redux/utils/store";
import { renderReactApp } from "./redux/utils/render";

const state = {
	paper: {
		text: "",
		title: "",
		description: "",
		keyword: "",
		synonyms: "",
		locale: "",
		url: "https://example.org/",
		permalink: "example-post",
	},
};
const store = configureStore( state );
const targetElement = document.getElementById( "root" );

renderReactApp( targetElement, App, store );
