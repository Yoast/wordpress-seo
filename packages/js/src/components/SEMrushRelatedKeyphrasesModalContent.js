/* eslint-disable complexity */
import { useCallback, useState } from "@wordpress/element";
import { CountrySelector, KeyphrasesTable, PremiumUpsell, UserMessage } from "@yoast/related-keyphrase-suggestions";
import { Root } from "@yoast/ui-library";
import { isEmpty } from "lodash";
import PropTypes from "prop-types";

/**
 * Determines whether the error property is present in the passed response object.
 *
 * @param {Object} response The response object.
 *
 * @returns {boolean} Whether or not the error property is present.
 */
export function hasError( response ) {
	if ( response?.code === "invalid_json" || response?.code === "fetch_error" ) {
		return true;
	}
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
 * @param {boolean} requestLimitReached Whether the request limit is reached.
 * @param {boolean} isSuccess Whether the request was successful.
 * @param {Object} response The response object.
 * @param {boolean} requestHasData Whether the request has data.
 * @param {Array} relatedKeyphrases The related keyphrases.
 *
 * @returns {?string} The user message variant, or null if no message is needed.
 */
export function getUserMessage( {
	requestLimitReached,
	isSuccess,
	response,
	requestHasData,
	relatedKeyphrases,
} ) {
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

	return null;
}

/**
 * Renders the SEMrush related keyphrases modal content.
 *
 * @param {string} [keyphrase=""] The main keyphrase.
 * @param {Array} [relatedKeyphrases=[]] The related keyphrases.
 * @param {Function} [renderAction=null] Function to render an action button.
 * @param {boolean} [requestLimitReached=false] Whether the request limit is reached.
 * @param {string} countryCode The selected country code.
 * @param {Function} setCountry Callback to set the country.
 * @param {Function} newRequest Callback to request new keyphrases.
 * @param {Object} [response={}] The response object.
 * @param {boolean} [isRtl=false] Whether RTL mode is enabled.
 * @param {string} [userLocale="en_US"] The user locale.
 * @param {boolean} [isPending=false] Whether a request is pending.
 * @param {boolean} [isSuccess=false] Whether the last request was successful.
 * @param {boolean} [requestHasData=true] Whether the last request has data.
 * @param {boolean} [isPremium=false] Whether the user has premium.
 * @param {string} [semrushUpsellLink=""] The SEMrush upsell link.
 * @param {string} [premiumUpsellLink=""] The premium upsell link.
 *
 * @returns {JSX.Element} The SEMrush related keyphrases modal content.
 */
export default function RelatedKeyphraseModalContent( {
	keyphrase = "",
	relatedKeyphrases = [],
	renderAction = null,
	requestLimitReached = false,
	countryCode,
	setCountry,
	newRequest,
	response = {},
	isRtl = false,
	userLocale = "en_US",
	isPending = false,
	isSuccess = false,
	requestHasData = true,
	isPremium = false,
	semrushUpsellLink = "",
	premiumUpsellLink = "",
} ) {
	const [ activeCountryCode, setActiveCountryCode ] = useState( countryCode );

	/**
	 * Sends a new related keyphrases request to SEMrush and updates the semrush_country_code value in the database.
	 *
	 * @returns {void}
	 */
	const relatedKeyphrasesRequest = useCallback( async() => {
		newRequest( countryCode, keyphrase );
		setActiveCountryCode( countryCode );
	}, [ countryCode, keyphrase, newRequest ] );

	return (
		<Root context={ { isRtl } }>

			{ ! requestLimitReached && ! isPremium && <PremiumUpsell
				url={ premiumUpsellLink }
				className="yst-mb-4"
			/> }

			{ ! requestLimitReached && <CountrySelector
				countryCode={ countryCode }
				activeCountryCode={ activeCountryCode }
				onChange={ setCountry }
				onClick={ relatedKeyphrasesRequest }
				className="yst-mb-4"
				userLocale={ userLocale.split( "_" )[ 0 ] }
			/> }

			{ ! isPending && <UserMessage
				variant={ getUserMessage( {
					requestLimitReached,
					isSuccess,
					response,
					requestHasData,
					relatedKeyphrases,
				} ) }
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
	response: PropTypes.object,
	isRtl: PropTypes.bool,
	userLocale: PropTypes.string,
	isPending: PropTypes.bool,
	isSuccess: PropTypes.bool,
	requestHasData: PropTypes.bool,
	isPremium: PropTypes.bool,
	semrushUpsellLink: PropTypes.string,
	premiumUpsellLink: PropTypes.string,
};
