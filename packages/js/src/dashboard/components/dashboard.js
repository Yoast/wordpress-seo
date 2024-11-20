import { ReadabilityScores } from "../scores/readability/readability-scores";
import { SeoScores } from "../scores/seo/seo-scores";
import { PageTitle } from "./page-title";

/**
 * @type {import("../index").ContentType} ContentType
 * @type {import("../index").Features} Features
 */

/**
 * @param {ContentType[]} contentTypes The content types.
 * @param {string} userName The user name.
 * @param {Features} features Whether features are enabled.
 * @returns {JSX.Element} The element.
 */
export const Dashboard = ( { contentTypes, userName, features } ) => {
	return (
		<>
			<PageTitle userName={ userName } features={ features } />
			<div className="yst-flex yst-flex-col @7xl:yst-flex-row yst-gap-6 yst-my-6">
				{ features.indexables && features.seoAnalysis && <SeoScores contentTypes={ contentTypes } /> }
				{ features.indexables && features.readabilityAnalysis && <ReadabilityScores contentTypes={ contentTypes } /> }
			</div>
		</>
	);
};
