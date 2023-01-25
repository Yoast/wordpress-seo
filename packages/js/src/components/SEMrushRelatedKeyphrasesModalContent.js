/* External dependencies */
import { Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";
import { isEmpty } from "lodash-es";

/* Internal dependencies */
import SEMrushLoading from "./modals/SEMrushLoading";
import SEMrushLimitReached from "./modals/SEMrushLimitReached";
import SEMrushCountrySelector from "./modals/SEMrushCountrySelector";
import SEMrushKeyphrasesTable from "./modals/SEMrushKeyphrasesTable";
import SEMrushUpsellAlert from "./modals/SEMrushUpsellAlert";
import SEMrushRequestFailed from "./modals/SEMrushRequestFailed";
import SEMrushMaxRelatedKeyphrases from "./modals/SEMrushMaxRelatedKeyphrases";
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
		return <SEMrushLoading />;
	}

	if ( requestLimitReached ) {
		return <SEMrushLimitReached />;
	}

	if ( ! isSuccess && hasError( response ) ) {
		return <SEMrushRequestFailed />;
	}

	if ( ! requestHasData ) {
		return <p>{ __( "Sorry, there's no data available for that keyphrase/country combination.", "wordpress-seo" ) }</p>;
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
	} = props;

	const isPremium = getL10nObject().isPremium;

	return (
		<Fragment>
			{ ! requestLimitReached && (
				<Fragment>
					{ ! isPremium && <SEMrushUpsellAlert /> }
					{ isPremium && hasMaximumRelatedKeyphrases( relatedKeyphrases ) && <SEMrushMaxRelatedKeyphrases /> }
					<SEMrushCountrySelector
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
					/>
				</Fragment>
			) }

			{ getUserMessage( props ) }

			<SEMrushKeyphrasesTable
				keyphrase={ keyphrase }
				relatedKeyphrases={ relatedKeyphrases }
				countryCode={ countryCode }
				renderAction={ renderAction }
				data={ response }
			/>
		</Fragment>
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
};

RelatedKeyphraseModalContent.defaultProps = {
	keyphrase: "",
	relatedKeyphrases: [],
	renderAction: null,
	requestLimitReached: false,
	response: {},
	lastRequestKeyphrase: "",
};
