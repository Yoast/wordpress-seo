import { createPortal, Fragment } from "@wordpress/element";
import { Collapsible } from "@yoast/components";
import { Slot } from "@wordpress/components";
import FacebookPreviewSlot from "./slots/FacebookPreviewSlot";
import TwitterPreviewSlot from "./slots/TwitterPreviewSlot";

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
				<FacebookPreviewSlot />
			</Collapsible>
			<Collapsible
				hasPadding={ true }
				hasSeparator={ true }
				title="Twitter"
			>
				<TwitterPreviewSlot />
			</Collapsible>
		</Fragment>,
		document.getElementById( "wpseo-section-social" )
	);
};

export default Social;


