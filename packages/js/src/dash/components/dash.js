import { PageTitle } from "./page-title";
import { ReadabilityScores } from "./readability-scores";
import { SeoScores } from "./seo-scores";

/**
 * @type {import("../index").ContentType} ContentType
 */

/**
 * @param {ContentType[]} contentTypes The content types.
 * @param {string} userName The user name.
 * @returns {JSX.Element} The element.
 */
export const Dash = ( { contentTypes, userName } ) => {
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
