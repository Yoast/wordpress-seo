import { createInterpolateElement } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";

import { ReactComponent as WorkoutImage } from "../../../images/motivated_bubble_woman_1_optim.svg";
import { addLinkToString } from "../../helpers/stringHelpers.js";
import { Step, Steps } from "./Steps";
import Indexation from "../../components/Indexation";

window.yoastIndexingData = {};

/**
 * The configuration workout.
 *
 * @param {Object} props The props.
 *
 * @returns {WPElement} The ConfigurationWorkout compoinent.
 */
export default function ConfigurationWorkout( { seoDataOptimizationNeeded = "1", isStepFinished = () => {} } ) {
	/* eslint-disable max-len */
	return (
		<div className="card">
			<h2>{ __( "Configuration", "wordpress-seo" ) }</h2>
			<h3>{ __( "Configure Yoast SEO with optimal SEO settings for your site", "wordpress-seo" ) }</h3>
			{ seoDataOptimizationNeeded === "1" && <div>seoDataoptimization alert</div> }
			<p>
				{
					__(
						"This workout will guide you through the most important steps you need to take to configure the Yoast SEO plugin on your site.",
						"wordpress-seo"
					)
				}
			</p>
			<p>
				<em>
					{
						addLinkToString(
							sprintf(
								__(
									// translators: %1$s and %2$s are replaced by opening and closing anchor tags.
									"Need more guidance? We've covered every step in more detail in the %1$sYoast SEO configuration workout guide.%2$s",
									"wordpress-seo"
								),
								"<a>",
								"</a>"
							),
							"https://yoast.com"
						)
					}
				</em>
			</p>
			<hr />
			<p>
				{
					createInterpolateElement(
						sprintf(
							__(
								// translators: %1$s and %2$s are replaced by opening and closing <b> tags.
								"%1$sImportant:%2$s  After you’ve completed (or made any changes to) a step, please make sure to save your changes by clicking the ‘Save and continue’ button below that step.",
								"wordpress-seo"
							),
							"<b>",
							"</b>"
						),
						{
							b: <b />,
						}
					)
				}
			</p>
			<br />
			<Steps>
				<Step
					title={ __( "Optimize SEO data", "wordpress-seo" ) }
					subtitle={ addLinkToString(
						sprintf(
							__(
								"Speed up your site and get internal linking insights by clicking the button below! It will let us optimize how your SEO data is stored. Do you have a lot of content? " +
								"Then the optimization might take a while. But trust us, it's worth it. %1$sLearn more about the benefits of optimized SEO data.%2$s",
								"wordpress-seo"
							),
							"<a>",
							"</a>"
						),
						"https://yoast.com"
					) }
					finishText={ "FINISHINGINGENING!" }
					onFinishClick={ () => { console.log( "YOU FINSISHIHIEHDNIED IT!" ); } }
					isFinished={ isStepFinished( "configuration", "one" ) }
				>
					<div className="workflow__grid">
						<div>
							<Indexation />
						</div>
						<WorkoutImage
							className="workflow__image"
						/>
					</div>
				</Step>
				<Step
					title={ __( "Site representation", "wordpress-seo" ) }
					subtitle={ __( "Tell Google what kind of site you have. Select ‘Organization’ if you are working on a site for a business or an organization. Select ‘Person’ if you have, say, a personal blog.", "wordpress-seo" ) }
					finishText={ "FINISHINGINGENING!" }
					onFinishClick={ () => { console.log( "YOU FINSISHIHIEHDNIED IT!" ); } }
					isFinished={ isStepFinished( "configuration", "one" ) }
				>
					<div>
						<p>
							{ __(
								"Person org here.",
								"wordpress-seo"
							) }
						</p>
					</div>
				</Step>
			</Steps>
		</div>
		/* eslint-enable max-len */
	);
}
