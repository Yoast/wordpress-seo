import { Fragment } from "@wordpress/element";
import { Collapsible } from "@yoast/components";
import FacebookPreviewSlot from "./slots/FacebookPreviewSlot";
import TwitterPreviewSlot from "./slots/TwitterPreviewSlot";

/**
 * Component that renders the social metadata collapsibles.
 *
 * @returns {React.Component} The social metadata collapsibles.
 */
const SocialMetadata = () => {
	return (
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
		</Fragment>
	);
};

export default SocialMetadata;
