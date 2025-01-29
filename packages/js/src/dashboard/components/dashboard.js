import { Scores } from "../scores/components/scores";
import { PageTitle } from "./page-title";
import { GoogleSiteKitConnectionWidget } from "./google-site-kit-connection-widget";
import { get } from "lodash";
import { useCallback } from "@wordpress/element";
import { useToggleState } from "@yoast/ui-library";
import { useSelect } from "@wordpress/data";

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
 *
 * @returns {JSX.Element} The element.
 */
// The complexity is cause by the google site kit feature flag which is temporary.
// eslint-disable-next-line complexity
export const Dashboard = ( { contentTypes, userName, features, endpoints, headers, links } ) => {
	const googleSiteKitConfiguration = get( window, "wpseoScriptData.dashboard.googleSiteKit", {
		isInstalled: false,
		isActive: false,
		isSetup: false,
		isConnected: false,
		installUrl: "",
		activateUrl: "",
		setupUrl: "",
		featureActive: false,
	} );
	const [ showGoogleSiteKit, , , , setRemoveGoogleSiteKit ] = useToggleState( true );
	const learnMorelink = useSelect( select => select( "@yoast/general" ).selectLink( "https://yoa.st/google-site-kit-learn-more" ), [] );
	const handleRemovePermanently = useCallback( ()=>{
		/* eslint-disable-next-line */
		// TODO: Implement the remove permanently functionality.
		setRemoveGoogleSiteKit();
	}, [ setRemoveGoogleSiteKit ] );

	return (
		<>
			<PageTitle userName={ userName } features={ features } links={ links } />
			<div className="yst-flex yst-flex-col @7xl:yst-flex-row yst-gap-6 yst-my-6">
				{ showGoogleSiteKit && googleSiteKitConfiguration.featureActive && <GoogleSiteKitConnectionWidget
					{ ...googleSiteKitConfiguration } learnMoreLink={ learnMorelink }
					onRemove={ setRemoveGoogleSiteKit } onRemovePermanently={ handleRemovePermanently }
				/> }
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
