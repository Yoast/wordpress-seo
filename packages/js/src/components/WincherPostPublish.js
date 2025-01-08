/* global wpseoAdminL10n */

/* External dependencies */
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import { Fragment } from "@wordpress/element";

/* Yoast dependencies */
import { FieldGroup, NewButton } from "@yoast/components";

/* Internal dependencies */
import WincherExplanation from "./modals/WincherExplanation";
import WincherSEOPerformanceModal from "../containers/WincherSEOPerformanceModal";

/**
 * Renders the WincherPostPublish Yoast integration.
 *
 * @param {Object} props The props to use.
 *
 * @returns {wp.Element} The WincherPostPublish panel.
 */
export default function WincherPostPublish( props ) {
	const {
		hasTrackedKeyphrases,
		trackAll,
	} = props;

	return (
		<Fragment>
			<FieldGroup
				label={ __( "SEO performance", "wordpress-seo" ) }
				linkTo={ wpseoAdminL10n[ "shortlinks.wincher.seo_performance" ] }
				/* translators: Hidden accessibility text. */
				linkText={ __( "Learn more about the SEO performance feature.", "wordpress-seo" ) }
				wrapperClassName={ "yoast-field-group yoast-wincher-post-publish" }
			/>

			<WincherExplanation />

			{ hasTrackedKeyphrases && <p>
				{ __(
					"Tracking has already been enabled for one or more keyphrases of this page. Clicking the button below will enable tracking for all of its keyphrases.",
					"wordpress-seo"
				) }
			</p> }

			<div className="yoast">
				<NewButton
					variant="secondary"
					small={ true }
					onClick={ trackAll }
				>
					{ __( "Track all keyphrases on this page", "wordpress-seo" ) }
				</NewButton>
			</div>

			<WincherSEOPerformanceModal location="postpublish" />
		</Fragment>
	);
}

WincherPostPublish.propTypes = {
	trackAll: PropTypes.func,
	hasTrackedKeyphrases: PropTypes.bool,
};

WincherPostPublish.defaultProps = {
	trackAll: () => {},
	hasTrackedKeyphrases: false,
};
