
import { __, sprintf } from "@wordpress/i18n";

import { addLinkToString } from "../../helpers/stringHelpers";
import IconAdjustments from "../../../images/icon-adjustments.svg";

/**
 * Renders a page in case SEO analysis, readability analysis and text link counter features are deactivated.
 *
 * @returns {WPElement} The AllFeaturesDisabled component.
 */
function AllFeaturesDisabled() {
	return <div
		id="all-features-disabled-view"
		className="yst-max-w-full yst-mt-6 yst-flex"
	>
		<div
			className="yst-flex yst-flex-col yst-max-w-6xl yst-w-full yst-items-center yst-bg-white yst-rounded-lg yst-px-8 yst-py-10 yst-shadow"
		>
			<img src={ IconAdjustments } alt="Magnifying lens icon" className="yst-mb-4" />
			<h4 className="yst-mb-2 yst-text-base yst-text-gray-900 yst-font-medium yst-leading-tight">{ __( "You've disabled features that are needed to show data", "wordpress-seo" ) }</h4>
			<div className="yst-flex yst-flex-col yst-items-center">
				<p className="yst-gray-500 yst-font-normal yst-leading-normal yst-px-10 yst-text-center">
					{
						addLinkToString(
							// translators: %1$s and %2$s are the opening and closing anchor tags.
							sprintf(
								__(
									"We use features like our 'SEO analysis', 'Readability analysis' and 'Text link counter' to calculate how your content is performing. " +
									"You can enable these features on the %1$sFeatures tab%2$s.",
									"wordpress-seo"
								),
								"<a>",
								"</a>"
							), "/wp-admin/admin.php?page=wpseo_dashboard#top#features"

						)
					}
				</p>
			</div>
		</div>
	</div>;
}

export default AllFeaturesDisabled;
