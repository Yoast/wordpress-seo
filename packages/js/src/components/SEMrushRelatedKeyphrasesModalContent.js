/* External dependencies */
import { KeyphrasesTable, UserMessage } from "@yoast/related-keyphrase-suggestions";
import { Root } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";

/* Internal dependencies */
import SEMrushCountrySelector from "./modals/SEMrushCountrySelector";
import SEMrushUpsellAlert from "./modals/SEMrushUpsellAlert";

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
		response,
		lastRequestKeyphrase,
		keyphrase,
		newRequest,
		setCountry,
		renderAction,
		countryCode,
		requestLimitReached,
		setRequestFailed,
		setNoResultsFound,
		relatedKeyphrases,
		setRequestSucceeded,
		setRequestLimitReached,
		isPending,
		isRtl,
		isPremium,
		userLocale,
	} = props;

	return (
		<Root context={ { isRtl } }>

			{ ! requestLimitReached && ! isPremium && <SEMrushUpsellAlert /> }

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
				upsellLink={ window.wpseoAdminL10n[ "shortlinks.semrush.prices" ] }
				className="yst-my-2"
			/> }

			<KeyphrasesTable
				relatedKeyphrases={ relatedKeyphrases }
				columnNames={ response?.results?.columnNames }
				data={ response?.results?.rows }
				isPending={ isPending }
				renderButton={ renderAction }
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
};

RelatedKeyphraseModalContent.defaultProps = {
	keyphrase: "",
	relatedKeyphrases: [],
	renderAction: null,
	requestLimitReached: false,
	response: {},
	lastRequestKeyphrase: "",
	isRtl: false,
	userLocale: "en_US",
	isPending: false,
	isPremium: false,
};
