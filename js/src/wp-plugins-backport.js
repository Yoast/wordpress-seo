import { SlotFillProvider } from "@wordpress/components";
import { render } from "@wordpress/element";
import { PluginArea } from "@wordpress/plugins";

/**
 * Checks if the block editor is loaded.
 *
 * @returns {boolean} Whether the block editor is loaded.
 */
function isBlockEditor() {
	return document.querySelector( ".block-editor" ) !== null;
}

if ( ! isBlockEditor() ) {
	const container = document.createElement( "div" );
	container.id = "wpseo-wp-plugins-port";

	document.body.append( container );

	render(
		<SlotFillProvider>
			<PluginArea />
		</SlotFillProvider>,
		container
	);
}

