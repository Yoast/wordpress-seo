import { render } from "@wordpress/element";
import { Provider } from "react-redux";
import configureStore from "./install-plugin/configureStore";
import PluginInstallation from "./components/PluginInstallation";

const store = configureStore();

const el = document.createElement( "div" );
document.getElementById( "extensions" ).append( el );

store.subscribe( () => {
	console.log( store.getState().pluginInstallation );
} );

render(
	<Provider store={ store }>
		<PluginInstallation />
	</Provider>,
	el
);

