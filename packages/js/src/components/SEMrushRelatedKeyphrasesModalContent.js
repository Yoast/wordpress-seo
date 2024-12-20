/* External dependencies */
import { KeyphrasesTable, UserMessage, PremiumUpsell } from "@yoast/related-keyphrase-suggestions";
import { Root } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";

/* Internal dependencies */
import SEMrushCountrySelector from "./modals/SEMrushCountrySelector";

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
 * Determines whether the maximum amount of related keyphrases has been reached.
 *
 * @param {array} relatedKeyphrases The related keyphrases. Can be empty.
 *
 * @returns {boolean} Whether or not the maximum limit has been reached.
 */
export function hasMaximumRelatedKeyphrases( relatedKeyphrases ) {
	return relatedKeyphrases && relatedKeyphrases.length >= 4;
}

/**
 * Gets a user message variant.
 *
 * @param {object} props The props to use within the content.
 *
 * @returns {string} The user message variant.
 */
export function getUserMessage( props ) {
	const {
		requestLimitReached,
		isSuccess,
		response,
		requestHasData,
		relatedKeyphrases,
	} = props;

	if ( requestLimitReached ) {
		return "requestLimitReached";
	}

	if ( ! isSuccess && hasError( response ) ) {
		return "requestFailed";
	}

	if ( ! requestHasData ) {
		return "requestEmpty";
	}

	if ( hasMaximumRelatedKeyphrases( relatedKeyphrases ) ) {
		return "maxRelatedKeyphrases";
	}
}

/**
 * Renders the SEMrush related keyphrases modal content.
 *
 * @param {Object} props The props to use within the content.
 *
 * @returns {wp.Element} The SEMrush related keyphrases modal content.
 */
export default function RelatedKeyphraseModalContent( props ) {
	const {
		response = {},
		lastRequestKeyphrase = "",
		keyphrase = "",
		newRequest,
		setCountry,
		renderAction = null,
		countryCode,
		requestLimitReached = false,
		setRequestFailed,
		setNoResultsFound,
		relatedKeyphrases = [],
		setRequestSucceeded,
		setRequestLimitReached,
		isPending,
		isRtl = false,
		isPremium = false,
		userLocale = "en_US",
		semrushUpsellLink = "",
		premiumUpsellLink = "",
	} = props;

	return (
		<Root context={ { isRtl } }>

			{ ! requestLimitReached && ! isPremium && <PremiumUpsell
				url={ premiumUpsellLink }
				className="yst-mb-4"
			/> }

			{ ! requestLimitReached && <SEMrushCountrySelector
				countryCode={ countryCode }
				setCountry={ setCountry }
				newRequest={ newRequest }
				keyphrase={ keyphrase }
				setRequestFailed={ setRequestFailed }
				setNoResultsFound={ setNoResultsFound }
				setRequestSucceeded={ setRequestSucceeded }
				setRequestLimitReached={ setRequestLimitReached }
				response={ response }
				lastRequestKeyphrase={ lastRequestKeyphrase }
				userLocale={ userLocale.split( "_" )[ 0 ] }
			/> }

			{ ! isPending && <UserMessage
				variant={ getUserMessage( props ) }
				upsellLink={ semrushUpsellLink }
			/> }

			<KeyphrasesTable
				relatedKeyphrases={ relatedKeyphrases }
				columnNames={ response?.results?.columnNames }
				data={ response?.results?.rows }
				isPending={ isPending }
				renderButton={ renderAction }
				className="yst-mt-4"
			/>
		</Root>
	);
}

RelatedKeyphraseModalContent.propTypes = {
	keyphrase: PropTypes.string,
	relatedKeyphrases: PropTypes.array,
	renderAction: PropTypes.func,
	requestLimitReached: PropTypes.bool,
	countryCode: PropTypes.string.isRequired,
	setCountry: PropTypes.func.isRequired,
	newRequest: PropTypes.func.isRequired,
	setRequestSucceeded: PropTypes.func.isRequired,
	setRequestLimitReached: PropTypes.func.isRequired,
	setRequestFailed: PropTypes.func.isRequired,
	setNoResultsFound: PropTypes.func.isRequired,
	response: PropTypes.object,
	lastRequestKeyphrase: PropTypes.string,
	isRtl: PropTypes.bool,
	userLocale: PropTypes.string,
	isPending: PropTypes.bool,
	isPremium: PropTypes.bool,
	semrushUpsellLink: PropTypes.string,
	premiumUpsellLink: PropTypes.string,
};
