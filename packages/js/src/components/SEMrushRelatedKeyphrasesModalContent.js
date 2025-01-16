import { useCallback, useState } from "@wordpress/element";
import { CountrySelector, KeyphrasesTable, UserMessage, PremiumUpsell } from "@yoast/related-keyphrase-suggestions";
import { Root } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";

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
		keyphrase = "",
		relatedKeyphrases = [],
		renderAction = null,
		requestLimitReached = false,
		countryCode = "us",
		setCountry,
		newRequest,
		response = {},
		isRtl = false,
		userLocale = "en_US",
		isPending = false,
		isPremium = false,
		semrushUpsellLink = "",
		premiumUpsellLink = "",
	} = props;

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
	response: PropTypes.object,
	isRtl: PropTypes.bool,
	userLocale: PropTypes.string,
	isPending: PropTypes.bool,
	isPremium: PropTypes.bool,
	semrushUpsellLink: PropTypes.string,
	premiumUpsellLink: PropTypes.string,
};
