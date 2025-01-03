import { __ } from "@wordpress/i18n";
import { Scores } from "../scores/components/scores";
import { SiteKitTable } from "../scores/components/site-kit-table";
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

	const columnsNames = [ 
		__( "Landing page", "wordpress-seo" ), 
		__( "Clicks", "wordpress-seo" ), 
		__( "Impressions", "wordpress-seo" ), 
		__( "CTR", "wordpress-seo" ), 
		__( "Average position", "wordpress-seo" ),
		__( "SEO score", "wordpress-seo" ),
	 ];

	 const data = [
		[  "https://example.com",
			100,
			1000,
			10,
			1,
			100,
		],
		[  "https://example.com",
			100,
			1000,
			10,
			1,
			100,
		],
		[  "https://example.com",
			100,
			1000,
			10,
			1,
			100,
		],
		[  "https://example.com",
			100,
			1000,
			10,
			1,
			100,
		],
		[  "https://example.com",
			100,
			1000,
			10,
			1,
			100,
		],
	 ];
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

				<SiteKitTable title={ __( "Top 5 most popular content", "wordpress-seo" ) } columnsNames={ columnsNames } data={ data } />
			</div>

		</>
	);
};
