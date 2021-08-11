/* External dependencies */
import { Fragment } from "@wordpress/element";
import {__, _n, sprintf} from "@wordpress/i18n";
import PropTypes from "prop-types";
import { isEmpty } from "lodash-es";

/* Internal dependencies */
import WincherSEOPerformanceLoading from "./modals/WincherSEOPerformanceLoading";
import WincherLimitReached from "./modals/WincherLimitReached";
import WincherRequestFailed from "./modals/WincherRequestFailed";
import WincherConnectedAlert from "./modals/WincherConnectedAlert";
import WincherCurrentlyTrackingAlert from "./modals/WincherCurrentlyTrackingAlert";
import { FieldGroup } from "@yoast/components";
import { makeOutboundLink } from "@yoast/helpers";
import WincherKeyphrasesTable from "./modals/WincherKeyphrasesTable";
import WincherExplanation from "./modals/WincherExplanation";
import getL10nObject from "../analysis/getL10nObject";

/**
 * Determines whether the error property is present in the passed response object.
 *
 * @param {Object} response The response object.
 *
 * @returns {boolean} Whether or not the error property is present.
 */
export function hasError( response ) {
	return ! isEmpty( response ) && "error" in response;
}

/**
 * Gets a user message based on the passed props' values.
 *
 * @param {Object} props The props to use.
 *
 * @returns {wp.Element} The user message.
 */
export function getUserMessage( props ) {
	const {
		isPending,
		requestLimitReached,
		isSuccess,
		response,
		requestHasData,
	} = props;

	if ( isPending ) {
		return <WincherSEOPerformanceLoading />;
	}

	if ( requestLimitReached ) {
		return <WincherLimitReached />;
	}

	if ( ! isSuccess && hasError( response ) ) {
		return <WincherRequestFailed />;
	}

	if ( ! requestHasData ) {
		return <p>{ __( "Sorry, there's no data available for that keyphrase.", "wordpress-seo" ) }</p>;
	}
}

/**
 * Determines whether the maximum amount of related keyphrases has been reached.
 *
 * @param {array} relatedKeyphrases The related keyphrases. Can be empty.
 *
 * @returns {boolean} Whether or not the maximum limit has been reached.
 */
export function hasMaximumRelatedKeyphrases( relatedKeyphrases ) {
	return relatedKeyphrases && relatedKeyphrases.length >= 4;
}

function generate_random_numbers() {
	return Array.from( { length: 90 }, ( _, i ) => i + 1 ).map( ( i ) => {
		return Math.random();
	} );
}

export function getTrackableKeyphrases( props ) {
	const isPremium = getL10nObject().isPremium;

	if ( isPremium ) {
		return [
			props.keyphrase,
			...window.wp.data.select( "yoast-seo-premium/editor" ).getKeywords(),
		];
	}

	return [ props.keyphrase ];
}

/**
 * Renders the Wincher SEO Performance modal content.
 *
 * @param {Object} props The props to use within the content.
 *
 * @returns {wp.Element} The Wincher SEO Performance modal content.
 */
export default function WincherSEOPerformanceModalContent( props ) {
	const {
		response,
		lastRequestKeyphrase,
		keyphrase,
		newRequest,
		renderAction,
		requestLimitReached,
		setRequestFailed,
		setNoResultsFound,
		relatedKeyphrases,
		setRequestSucceeded,
		setRequestLimitReached,
		setTrackingKeyphrase,
		toggleKeyphraseTracking,
		trackedKeyphrases,
		setTrackingKeyphrases,
	} = props;


	// Collect keyphrases
	const keyphrases = getTrackableKeyphrases( props );

	console.log(keyphrases, trackedKeyphrases)

	// If data is present, we need to match it to whatever keyphrases are set from the live data.

	// TODO: Remove this upon implementation of the API.
	const testData = {
		results: {
			rows: [
				[ true, keyphrase, 1, generate_random_numbers().join( "," ) ],
				[ false, "graaa", 10, generate_random_numbers().join( "," ) ],
				[ false, "no", 55, generate_random_numbers().join( "," ) ],
				[ true, "hello world", 100, generate_random_numbers().join( "," ) ],
			],
		},
	};

	return (
		<Fragment>
			{ true && <WincherConnectedAlert />  }

			<FieldGroup
				label={ __( "SEO performance", "wordpress-seo" ) }
				linkTo={ "https://google.com" }
				linkText={ __( "Learn more about the SEO performance feature.", "wordpress-seo" ) }
			/>
			<WincherExplanation />

			{ true && <WincherCurrentlyTrackingAlert />  }

			{ getUserMessage( props ) }

			<Fragment>
				<p>{ __( "You can enable / disable tracking the SEO performance for each keyphrase below.", "wordpress-seo" ) }</p>

				{ true && <WincherLimitReached /> }

				<WincherKeyphrasesTable
					keyphrases={ getTrackableKeyphrases( props ) }
					trackedKeyphrases={ trackedKeyphrases }
					renderAction={ renderAction }
					data={ testData }
					toggleAction={ toggleKeyphraseTracking }
				/>
			</Fragment>
		</Fragment>
	);
}

WincherSEOPerformanceModalContent.propTypes = {
	keyphrase: PropTypes.string,
	relatedKeyphrases: PropTypes.array,
	renderAction: PropTypes.func,
	requestLimitReached: PropTypes.bool,
	newRequest: PropTypes.func.isRequired,
	setRequestSucceeded: PropTypes.func.isRequired,
	setRequestLimitReached: PropTypes.func.isRequired,
	setRequestFailed: PropTypes.func.isRequired,
	setNoResultsFound: PropTypes.func.isRequired,
	response: PropTypes.object,
	lastRequestKeyphrase: PropTypes.string,
};

WincherSEOPerformanceModalContent.defaultProps = {
	keyphrase: "",
	relatedKeyphrases: [],
	renderAction: null,
	requestLimitReached: false,
	response: {},
	lastRequestKeyphrase: "",
};
