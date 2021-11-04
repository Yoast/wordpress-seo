import { render, StrictMode } from "@wordpress/element";
import App from "./App";
import "./index.css";

render(
	<StrictMode>
		<App />
	</StrictMode>,
	document.getElementById( "root" ),
);
