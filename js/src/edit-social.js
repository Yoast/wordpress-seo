import { createPortal } from "@wordpress/element";
import { Collapsible } from "@yoast/components";
import { Slot } from "@wordpress/components";
import { registerPlugin } from "@wordpress/plugins";
import { registerStore, AsyncModeProvider } from "@wordpress/data";
import isGutenbergDataAvailable from "./helpers/isGutenbergDataAvailable";
import { registerReactComponent } from "./helpers/classicEditor";

/**
 * Component that renders the social metadata collapsibles.
 *
 * @returns {React.Component} The social metadata collapsibles.
 */
const Social = () => {
	return createPortal(
		<AsyncModeProvider>
			<Collapsible
				hasPadding={ true }
				hasSeparator={ true }
				title="Facebook"
			>
				<Slot name="YoastFacebookPreview" />
			</Collapsible>
			<Collapsible
				hasPadding={ true }
				hasSeparator={ true }
				title="Twitter"
			>
				<Slot name="YoastTwitterPreview" />
			</Collapsible>
		</AsyncModeProvider>,
		document.getElementById( "wpseo-section-social" ) );
};

registerStore( "yoast/social-metadata", {
	reducer: state => state,
} );

if ( isGutenbergDataAvailable() ) {
	registerPlugin( "yoast-seo-social-metadata", {
		render: Social,
	} );
} else {
	registerReactComponent(
		"yoast-seo-social-metadata",
		Social
	);
}


