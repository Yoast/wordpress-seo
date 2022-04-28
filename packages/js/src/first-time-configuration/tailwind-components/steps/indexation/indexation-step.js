import { Fragment } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";

import Alert, { FadeInAlert } from "../../base/alert";
import { addLinkToString } from "../../../../helpers/stringHelpers.js";
import { ConfigurationIndexation } from "./configuration-indexation";
import { ReactComponent as WorkoutStartImage } from "../../../../../images/motivated_bubble_woman_1_optim.svg";

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
				{ addLinkToString(
					sprintf(
						__( "Let’s analyze your site just like Google does and get those indexables into action by running the SEO data " +
							"optimization! Our indexables will immediately improve technical issues without you needing to do anything!\n" +
							"\nIf you have a lot of content, that optimization could take a while. But trust us, it’s worth it! " +
							"Want to read more, %1$scheck out the benefits of the indexables squad.%2$s", "wordpress-seo" ),
						"<a>",
						"</a>"
					),
					window.wpseoFirstTimeConfigurationData.shortlinks.indexData,
					"yoast-configuration-workout-index-data-link"
				)
				}
			</p>
			<WorkoutStartImage className="yst-h-28 yst-w-24 yst-mr-6" />
		</div>
		<div id="yoast-configuration-workout-indexing-container" className="indexation-container">
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
				sprintf( __( "This workout step is currently disabled, because you're not running the latest version of Yoast SEO Premium. " +
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
						"Once that is finished, please refresh this workout.", "wordpress-seo" ),
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
