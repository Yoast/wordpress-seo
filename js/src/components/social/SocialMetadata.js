/* External dependencies */
import { Fragment } from "@wordpress/element";
import MetaboxCollapsible from "../MetaboxCollapsible";

/* Internal dependencies */
import FacebookContainer from "../../containers/FacebookEditor";
import TwitterContainer from "../../containers/TwitterEditor";

/**
 * Component that renders the social metadata collapsibles.
 *
 * @returns {React.Component} The social metadata collapsibles.
 */
const SocialMetadata = () => {
	return (
		<Fragment>
			<MetaboxCollapsible
				title="Facebook"
			>
				<FacebookContainer />
			</MetaboxCollapsible>
			<MetaboxCollapsible
				title="Twitter"
			>
				<TwitterContainer />
			</MetaboxCollapsible>
		</Fragment>
	);
};

export default SocialMetadata;
