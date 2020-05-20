/* External dependencies */
import { Fragment } from "@wordpress/element";
import { Collapsible } from "@yoast/components";
import { __, sprintf } from "@wordpress/i18n";

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
			<Collapsible
				hasPadding={ true }
				hasSeparator={ true }
				/* Translators: $s expands to Facebook. */
				title={ sprintf( __( "$s preview", "wordpress-seo" ), "Facebook" ) }
				initialIsOpen={ true }
			>
				<FacebookContainer />
			</Collapsible>
			<Collapsible
				hasPadding={ true }
				hasSeparator={ true }
				/* Translators: $s expands to Twitter. */
				title={ sprintf( __( "$s preview", "wordpress-seo" ), "Twitter" ) }
				initialIsOpen={ true }
			>
				<TwitterContainer />
			</Collapsible>
		</Fragment>
	);
};

export default SocialMetadata;
