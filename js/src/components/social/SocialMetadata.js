/* External dependencies */
import { createPortal, Fragment } from "@wordpress/element";
import { Collapsible } from "@yoast/components";

/* Internal dependencies */
import FacebookContainer from "../../containers/Facebook";
// import TwitterContainer from "../../containers/Twitter";

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
				<FacebookContainer />
			</Collapsible>
			<Collapsible
				hasPadding={ true }
				hasSeparator={ true }
				title="Twitter"
			>
				{/* <TwitterContainer /> */}
			</Collapsible>
		</Fragment>,
		document.getElementById( "wpseo-section-social" )
	);
};

export default Social;


