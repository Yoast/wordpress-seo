import { Scores } from "../scores/components/scores";
import { PageTitle } from "./page-title";
import { MostPopularTable } from "./most-popular-table";

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
	const data = [
		{
			subject: "https://example.com/page1",
			clicks: 100,
			impressions: 1000,
			ctr: 0.020383459755,
			averagePosition: 5.568768,
			seoScore: "good",
		},
		{
			subject: "https://example.com/page2",
			clicks: 200,
			impressions: 2000,
			ctr: 0.62448974546,
			averagePosition: 10.5479879879,
			seoScore: "ok",
		},
		{
			subject: "https://example.com/page3",
			clicks: 300,
			impressions: 3000,
			ctr: 0.05897354354,
			averagePosition: 15.3216544,
			seoScore: "bad",
		},
		{
			subject: "https://example.com/page4",
			clicks: 400,
			impressions: 4000,
			ctr: 0.98456465,
			averagePosition: 20.6756456,
			seoScore: "good",
		},
		{
			subject: "https://example.com/page5",
			clicks: 500,
			impressions: 5000,
			ctr: 0.1256465465,
			averagePosition: 25.467686,
			seoScore: "ok",
		},
	];
	return (
		<>
			<PageTitle userName={ userName } features={ features } links={ links } />
			<MostPopularTable data={ data } />
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
