import { render } from "@wordpress/element";
// import { Provider } from "react-redux";
// import configureStore from "./install-plugin/configureStore";
import AddonInstallation from "./components/AddonInstallation";

// const store = configureStore();

const element = document.createElement( "div" );
element.setAttribute( "id", "wpseo-app-element" );
document.getElementById( "extensions" ).append( element );

// window.onbeforeunload = () => {
// 	if ( store.getState().pluginInstallation.installing ) {
// 		return "Installing plugins!";
// 	}
// };

render(
	// <Provider store={ store }>
	<AddonInstallation />,
	// </Provider>,
	element
);
