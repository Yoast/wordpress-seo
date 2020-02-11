import { SlotFillProvider } from "@wordpress/components";
import { render } from "@wordpress/element";
import { PluginArea } from "@wordpress/plugins";

function isBlockEditor() {
	return document.querySelector( ".block-editor" ) !== null;
}

if ( ! isBlockEditor() ) {
	const container = document.createElement( "div" );
	container.id = "wpseo-wp-plugins-port";

	console.log( SlotFillProvider, PluginArea );

	document.body.append( container );

	render(
		<SlotFillProvider>
			<PluginArea />
		</SlotFillProvider>,
		container
	);
}

