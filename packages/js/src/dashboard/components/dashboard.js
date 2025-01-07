import { Scores } from "../scores/components/scores";
import { PageTitle } from "./page-title";

/**
 * @type {import("../index").ContentType} ContentType
 * @type {import("../index").Features} Features
 * @type {import("../index").Endpoints} Endpoints
 * @type {import("../index").Links} Links
 */

/**
 * @param {ContentType[]} contentTypes The content types.
 * @param {string} userName The user name.
 * @param {Features} features Whether features are enabled.
 * @param {Endpoints} endpoints The endpoints.
 * @param {Object<string,string>} headers The headers for the score requests.
 * @param {Links} links The links.
 * @returns {JSX.Element} The element.
 */
export const Dashboard = ( { contentTypes, userName, features, endpoints, headers, links } ) => {
	return (
		<>
			<PageTitle userName={ userName } features={ features } links={ links } />
			<div className="yst-flex yst-flex-col @7xl:yst-flex-row yst-gap-6 yst-my-6">
				{ features.indexables && features.seoAnalysis && (
					<Scores analysisType="seo" contentTypes={ contentTypes } endpoint={ endpoints.seoScores } headers={ headers } />
				) }
				{ features.indexables && features.readabilityAnalysis && (
					<Scores analysisType="readability" contentTypes={ contentTypes } endpoint={ endpoints.readabilityScores } headers={ headers } />
				) }
			</div>
		</>
	);
};
