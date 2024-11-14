import { ReadabilityScores } from "../scores/readability/readability-scores";
import { SeoScores } from "../scores/seo/seo-scores";
import { PageTitle } from "./page-title";

/**
 * @type {import("../index").ContentType} ContentType
 */

/**
 * @param {ContentType[]} contentTypes The content types.
 * @param {string} userName The user name.
 * @returns {JSX.Element} The element.
 */
export const Dashboard = ( { contentTypes, userName } ) => {
	return (
		<div className="yst-@container">
			<PageTitle userName={ userName } />
			<div className="yst-flex yst-flex-col @7xl:yst-flex-row yst-gap-6 yst-mt-6">
				<SeoScores contentTypes={ contentTypes } />
				<ReadabilityScores contentTypes={ contentTypes } />
			</div>
		</div>
	);
};
