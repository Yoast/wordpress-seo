import { createPortal, Fragment } from "@wordpress/element";
import { Collapsible } from "@yoast/components";
import { Slot } from "@wordpress/components";

/**
 * Component that renders the social metadata collapsibles.
 *
 * @returns {React.Component} The social metadata collapsibles.
 */
const Social = () => {
	return createPortal(
		<Fragment>
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
		</Fragment>,
		document.getElementById( "wpseo-section-social" )
	);
};

export default Social;


