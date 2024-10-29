import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";
import { ReactComponent as ConfigurationStartImage } from "../../../../../images/indexables_1_left_bubble_optm.svg";
import { FadeInAlert } from "../../base/alert";
import { ConfigurationIndexation } from "./configuration-indexation";

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
	return <div className="yst-@container">
		<div className="yst-flex yst-flex-col @lg:yst-flex-row yst-gap-6 yst-mb-8">
			<p className="yst-text-sm yst-whitespace-pre-line">
				{ __(
					"Let's start by running the SEO data optimization. That means we'll scan your site and create a database with " +
					"optimized SEO data. It won't change any content or settings on your site and you don't need to do anything, just hit start!\n" +
					"\nNote: If you have a lot of content, this optimization could take a moment. But trust us, it's worth it!",
					"wordpress-seo"
				) }
			</p>
			<ConfigurationStartImage className="yst-shrink-0 yst-h-28 yst-w-24" />
		</div>
		<div id="yoast-configuration-indexing-container" className="indexation-container">
			<ConfigurationIndexation
				indexingStateCallback={ setIndexingState }
				indexingState={ indexingState }
				isStepperFinished={ isStepperFinished }
			/>
		</div>
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
	</div>;
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
