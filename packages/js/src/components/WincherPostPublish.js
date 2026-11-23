/* global wpseoAdminL10n */
import { Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { FieldGroup, NewButton } from "@yoast/components";
import { noop } from "lodash";
import WincherSEOPerformanceModal from "../containers/WincherSEOPerformanceModal";
import WincherExplanation from "./modals/WincherExplanation";

/**
 * Renders the WincherPostPublish Yoast integration.
 *
 * @param {Object} props Component props.
 * @param {Function} [props.trackAll=noop] Callback to track all keyphrases.
 * @param {boolean} [props.hasTrackedKeyphrases=false] Whether there are tracked keyphrases.
 *
 * @returns {JSX.Element} The WincherPostPublish panel.
 */
export default function WincherPostPublish( { trackAll = noop, hasTrackedKeyphrases = false } ) {
	return (
		<Fragment>
			<FieldGroup
				label={ __( "SEO performance", "wordpress-seo" ) }
				linkTo={ wpseoAdminL10n[ "shortlinks.wincher.seo_performance" ] }
				linkText={
					/* translators: Hidden accessibility text. */
					__( "Learn more about the SEO performance feature.", "wordpress-seo" ) }
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
