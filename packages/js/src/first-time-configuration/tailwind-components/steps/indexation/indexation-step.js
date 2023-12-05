import { Fragment } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";

import Alert, { FadeInAlert } from "../../base/alert";
import { addLinkToString } from "../../../../helpers/stringHelpers.js";
import { ConfigurationIndexation } from "./configuration-indexation";
import { ReactComponent as ConfigurationStartImage } from "../../../../../images/indexables_1_left_bubble_optm.svg";

/* eslint-disable complexity */

/**
 * The indexation step.
 *
 * @param {string}   indexingState          The indexing state.
 * @param {Function} setIndexingState       A callback to set the indexing state.
 * @param {boolean}  showRunIndexationAlert Whether the alert to run indexation needs to be shown.
 * @param {boolean}  isStepperFinished      Whether the stepper is finished.
 *
 * @returns {WPElement} The indexation step.
 */
export default function IndexationStep( { indexingState, setIndexingState, showRunIndexationAlert, isStepperFinished } ) {
	return <Fragment>
		<div className="yst-flex yst-flex-row yst-justify-between yst-flex-wrap yst-mb-8">
			<p className="yst-text-sm yst-whitespace-pre-line yst-w-[463px]">
				{ __( "Let's start by running the SEO data optimization. That means we'll scan your site and create a database with " +
				"optimized SEO data. It won't change any content or settings on your site and you don't need to do anything, just hit start!\n" +
				"\nNote: If you have a lot of content, this optimization could take a moment. But trust us, it's worth it!", "wordpress-seo" ) }
			</p>
			<ConfigurationStartImage className="yst-h-28 yst-w-24 yst-mr-6" />
		</div>
		<div id="yoast-configuration-indexing-container" className="indexation-container">
			<ConfigurationIndexation
				indexingStateCallback={ setIndexingState }
				isEnabled={ ! window.wpseoFirstTimeConfigurationData.shouldUpdatePremium }
				indexingState={ indexingState }
				isStepperFinished={ isStepperFinished }
			/>
		</div>
		{ ( window.wpseoFirstTimeConfigurationData.shouldUpdatePremium && indexingState !== "completed" ) && <Alert type="warning">
			<p>{
				// translators: %1$s is replaced by a version number.
				sprintf( __( "This configuration step is currently disabled, because you're not running the latest version of Yoast SEO Premium. " +
				"Please update to the latest version (at least %1$s). ",
				"wordpress-seo"
				), "17.7"
				)
			}</p>
			<p>{
				addLinkToString(
					sprintf(
						// translators: %1$s and %2$s are replaced by anchor tags to make a link to the tool section.
						__( "You can still run the SEO data optimization in the %1$sTools section%2$s. " +
						"Once that is finished, please refresh this page.", "wordpress-seo" ),
						"<a>",
						"</a>"
					),
					window.wpseoFirstTimeConfigurationData.toolsPageUrl
				) }
			</p>
		</Alert> }
		<FadeInAlert
			id="indexation-alert"
			isVisible={ indexingState === "idle" && showRunIndexationAlert }
			expandDuration={ 400 }
			type="info"
		>
			{
				__( "Be aware that you should run the SEO data optimization for this configuration to take maximum effect.",
					"wordpress-seo" )
			}
		</FadeInAlert>
	</Fragment>;
}

IndexationStep.propTypes = {
	indexingState: PropTypes.string.isRequired,
	setIndexingState: PropTypes.func.isRequired,
	showRunIndexationAlert: PropTypes.bool,
	isStepperFinished: PropTypes.bool,
};
IndexationStep.defaultProps = {
	showRunIndexationAlert: false,
	isStepperFinished: false,
};
