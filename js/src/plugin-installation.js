import { render } from "@wordpress/element";
import configureStore from "./install-plugin/configureStore";
import * as actions from "./install-plugin/actions";

const store = configureStore();

const el = document.createElement( "div" );
document.getElementById( "extensions" ).append( el );

render(
	<button
		onClick={ () => {
			store.dispatch( actions.installPlugins( [ "wordpress-seo-premium" ] ) );
		} }
	>
		Install premium
	</button>,
	el
);
