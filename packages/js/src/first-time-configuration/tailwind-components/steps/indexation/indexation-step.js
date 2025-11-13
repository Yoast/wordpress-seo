import { __, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";
import { FadeInAlert } from "../../base/alert";
import { ConfigurationIndexation } from "./configuration-indexation";
import { safeCreateInterpolateElement } from "../../../../helpers/i18n";
import UpsellNotice from "../../base/upsell-notice";
import { Button } from "@yoast/ui-library";
import { ExternalLinkIcon, SearchIcon } from "@heroicons/react/solid";

/**
 * The indexation step.
 *
 * @param {Object}   state                  The state
 * @param {string}   indexingState          The indexing state.
 * @param {function}  setIndexingState       A callback to set the indexing state.
 * @param {boolean}  [showRunIndexationAlert=false] Whether the alert to run indexation needs to be shown.
 * @param {boolean}  [isStepperFinished=false] Whether the stepper is finished.
 *
 * @returns {JSX.Element} The indexation step.
 */
export default function IndexationStep( {
	state,
	indexingState,
	setIndexingState,
	showRunIndexationAlert = false,
	isStepperFinished = false,
} ) {
	return <div className="yst-@container">
		<div className="yst-mb-4">
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
		{ ! state.isPremium && <UpsellNotice className="yst-mt-6 yst-gap-2">
			<div className="yst-flex yst-flex-col yst-gap-1">
				<div className="yst-flex yst-gap-2 yst-items-center">
					<SearchIcon className="yst-text-primary-300 yst-w-4 yst-h-4 yst-inline-block" />
					<p className="yst-font-medium yst-text-slate-800">
						{ __( "Want deeper insights?", "wordpress-seo" ) }
					</p>
				</div>
				<p>
					{
						sprintf(
							/* translators: %s expands to Yoast SEO Premium. */
							__( "%s gives you in-depth analysis and guidance for every post, helping you write content that ranks even better.", "wordpress-seo" ),
							"Yoast SEO Premium"
						)
					}
				</p>
			</div>
			<p className="yst-mt-4">
				<Button
					id="ftc-indexing-learn-more"
					as="a"
					href={ window.wpseoFirstTimeConfigurationData.shortlinks.indexationLearnMore }
					variant="tertiary"
					target="_blank"
					className="yst-p-0"
				>
					{ __( "Learn more about Premium", "wordpress-seo" ) }
					<span className="yst-sr-only">
						{
							/* translators: Hidden accessibility text. */
							__( "(Opens in a new browser tab)", "wordpress-seo" )
						}
					</span>
					<ExternalLinkIcon className="yst-ms-1 yst-w-4 yst-h-4 yst-icon-rtl" />
				</Button>
			</p>
		</UpsellNotice> }
	</div>;
}

IndexationStep.propTypes = {
	indexingState: PropTypes.string.isRequired,
	setIndexingState: PropTypes.func.isRequired,
	showRunIndexationAlert: PropTypes.bool,
	isStepperFinished: PropTypes.bool,
};
