/* External dependencies */
import { Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";

/* Internal dependencies */
import SemRushLoading from "./modals/SemRushLoading";
import SemRushLimitReached from "./modals/SemRushLimitReached";
import SEMrushCountrySelector from "./modals/SEMrushCountrySelector";
import KeyphrasesTable from "./modals/KeyphrasesTable";
import SemRushUpsellAlert from "./modals/SemRushUpsellAlert";
import SemRushRequestFailed from "./modals/SemRushRequestFailed";

/**
 * Determines whether the error property is present in the passed response object.
 *
 * @param {Object} response The response object.
 *
 * @returns {boolean} Whether or not the error property is present.
 */
function hasError( response ) {
	return response && "error" in response;
}

/**
 * Gets a user message based on the passed props' values.
 *
 * @param {Object} props The props to use.
 *
 * @returns {wp.Element} The user message.
 */
function getUserMessage( props ) {
	const {
		isPending,
		requestLimitReached,
		isSuccess,
		response,
		requestHasData,
	} = props;

	if ( isPending ) {
		return <SemRushLoading />;
	}

	if ( requestLimitReached ) {
		return <SemRushLimitReached />;
	}

	if ( ! isSuccess && hasError( response ) ) {
		return <SemRushRequestFailed />;
	}

	if ( ! requestHasData ) {
	   return <p> { __( "Sorry, there's no data available for that keyphrase/country combination.", "wordpress-seo" ) } </p>;
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
		keyphrase,
		newRequest,
		setCountry,
		renderAction,
		countryCode,
		setRequestFailed,
		setNoResultsFound,
		relatedKeyphrases,
		setRequestSucceeded,
		setRequestLimitReached,
	} = props;

	return (
		<Fragment>
			<SemRushUpsellAlert />
			<SemRushLimitReached />
			<SemRushRequestFailed />
			{ getUserMessage( props ) }
			<SEMrushCountrySelector
				countryCode={ countryCode }
				setCountry={ setCountry }
				newRequest={ newRequest }
				keyphrase={ keyphrase }
				newRequest={ newRequest }
				setRequestFailed={ setRequestFailed }
				setNoResultsFound={ setNoResultsFound }
				setRequestSucceeded={ setRequestSucceeded }
				setRequestLimitReached={ setRequestLimitReached }
			/>

			<KeyphrasesTable
				keyphrase={ keyphrase }
				relatedKeyphrases={ relatedKeyphrases }
				countryCode={ countryCode }
				renderAction={ renderAction }
				data={ response }
			/>

			<h2>Content debug info</h2>
			<p>
				The keyphrase is: { keyphrase }<br />
			</p>
		</Fragment>
	);
}

RelatedKeyphraseModalContent.propTypes = {
	keyphrase: PropTypes.string,
	relatedKeyphrases: PropTypes.array,
	renderAction: PropTypes.func,
	countryCode: PropTypes.string.isRequired,
	setCountry: PropTypes.func.isRequired,
	newRequest: PropTypes.func.isRequired,
	setRequestSucceeded: PropTypes.func.isRequired,
	setRequestLimitReached: PropTypes.func.isRequired,
	setRequestFailed: PropTypes.func.isRequired,
	setNoResultsFound: PropTypes.func.isRequired,
	response: PropTypes.object,
};

RelatedKeyphraseModalContent.defaultProps = {
	keyphrase: "",
	relatedKeyphrases: [],
	renderAction: null,
	response: {},
};
