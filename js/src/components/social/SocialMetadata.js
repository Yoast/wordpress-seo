/* External dependencies */
import { Fragment } from "@wordpress/element";
import { Collapsible } from "@yoast/components";
import { get } from "lodash-es";

/* Internal dependencies */
import FacebookContainer from "../../containers/FacebookEditor";
import TwitterContainer from "../../containers/TwitterEditor";

const isPremium = get( window, [ "wpseoPostScraperL10n.isPremium" ], false ) || get( window, [ "wpseoTermScraperL10n.isPremium" ], false );

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
				<FacebookContainer isPremium={ isPremium } />
			</Collapsible>
			<Collapsible
				hasPadding={ true }
				hasSeparator={ true }
				title="Twitter"
			>
				<TwitterContainer isPremium={ isPremium } />
			</Collapsible>
		</Fragment>
	);
};

export default SocialMetadata;
