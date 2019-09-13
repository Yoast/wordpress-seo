import { render } from "@wordpress/element";
import { Provider } from "react-redux";
import configureStore from "./install-plugin/configureStore";
import PluginInstallation from "./components/PluginInstallation";

const store = configureStore();

const el = document.createElement( "div" );
el.setAttribute( "id", "wpseo-app-element" );
document.getElementById( "extensions" ).append( el );

window.onbeforeunload = () => {
	if ( store.getState().pluginInstallation.installing ) {
		return "Installing plugins!";
	}
};

render(
	<Provider store={ store }>
		<PluginInstallation />
	</Provider>,
	el
);
