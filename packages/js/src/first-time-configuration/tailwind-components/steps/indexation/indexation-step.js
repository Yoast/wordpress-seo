import { __, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";
import { FadeInAlert } from "../../base/alert";
import { ConfigurationIndexation } from "./configuration-indexation";
import { safeCreateInterpolateElement } from "../../../../helpers/i18n";

/**
 * The indexation step.
 *
 * @param {string}   indexingState          The indexing state.
 * @param {function}  setIndexingState       A callback to set the indexing state.
 * @param {boolean}  [showRunIndexationAlert=false] Whether the alert to run indexation needs to be shown.
 * @param {boolean}  [isStepperFinished=false] Whether the stepper is finished.
 *
 * @returns {JSX.Element} The indexation step.
 */
export default function IndexationStep( {
	indexingState,
	setIndexingState,
	showRunIndexationAlert = false,
	isStepperFinished = false,
} ) {
	return <div className="yst-@container">
		<div className="yst-mb-8">
			<p className="yst-text-sm yst-whitespace-pre-line">
				{
					__(
						"Let's start by running the SEO data optimization. That means we'll scan your site and create a database with optimized SEO data. It won't change any content or settings on your site and you don't need to do anything, just hit start!",
						"wordpress-seo"
					)
				}
			</p>
			<p className="yst-text-sm yst-whitespace-pre-line yst-mt-4">
				{
					safeCreateInterpolateElement(
						sprintf(
							/* translators: %1$s expands to opening 'span' HTML tag, %2$s expands to closing 'span' HTML tag. */
							__(
								"%1$sNote%2$s: If you have a lot of content, this optimization could take a moment. But trust us, it's worth it!",
								"wordpress-seo"
							),
							"<span>",
							"</span>"
						),
						{
							span: <span className="yst-text-slate-800 yst-font-medium" />,
						}
					)
				}
			</p>
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
