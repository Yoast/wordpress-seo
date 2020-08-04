/* External dependencies */
import { Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";

/* Internal dependencies */
import SemRushLoading from "./modals/SemRushLoading";
import SemRushLimitReached from "./modals/SemRushLimitReached";
import SemRushCountrySelector from "./modals/SemRushCountrySelector";
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
 * Renders the SEMrush related keyphrases modal content.
 *
 * @param {Object} props The props to use within the content.
 *
 * @returns {wp.Element} The SEMrush related keyphrases modal content.
 */
export default function RelatedKeyphraseModalContent( props ) {
	const {
		isPending,
		isSuccess,
		keyphrase,
		relatedKeyphrases,
		renderAction,
		currentDatabase,
		setDatabase,
		newRequest,
		requestLimitReached,
		setRequestSucceeded,
		setRequestLimitReached,
		setRequestFailed,
		response,
		setNoResultsFound,
		requestHasData,
	} = props;

	// Return table etc. All content based on props etc.
	return (
		<Fragment>
			{ isPending && <SemRushLoading /> }
			<SemRushUpsellAlert />
			{ requestLimitReached && <SemRushLimitReached /> }
			{ ! isSuccess && hasError( response ) && <SemRushRequestFailed /> }
			{ ! requestLimitReached && ! requestHasData &&
			  <p> { __( "Sorry, there's no data available for that keyphrase/country combination.", "wordpress-seo" ) } </p>
			}
			<SemRushCountrySelector
				{ ...{
					keyphrase,
					currentDatabase,
					setDatabase,
					newRequest,
					setRequestSucceeded,
					setRequestLimitReached,
					setRequestFailed,
					setNoResultsFound,
				} }
			/>
			<KeyphrasesTable
				keyphrase={ keyphrase }
				relatedKeyphrases={ relatedKeyphrases }
				renderAction={ renderAction }
				data={ response }
			/>
			<h2>Content debug info</h2>
			<p>
				The keyphrase is: { keyphrase }<br />
				The current database is: { currentDatabase }
			</p>
		</Fragment>
	);
}

RelatedKeyphraseModalContent.propTypes = {
	isLoading: PropTypes.bool,
	isPending: PropTypes.bool.isRequired,
	isSuccess: PropTypes.bool.isRequired,
	requestLimitReached: PropTypes.bool.isRequired,
	requestHasData: PropTypes.bool.isRequired,
	keyphrase: PropTypes.string,
	relatedKeyphrases: PropTypes.array,
	renderAction: PropTypes.func,
	currentDatabase: PropTypes.string.isRequired,
	setDatabase: PropTypes.func.isRequired,
	newRequest: PropTypes.func.isRequired,
	setRequestSucceeded: PropTypes.func.isRequired,
	setRequestLimitReached: PropTypes.func.isRequired,
	setRequestFailed: PropTypes.func.isRequired,
	setNoResultsFound: PropTypes.func.isRequired,
	response: PropTypes.object,
};

RelatedKeyphraseModalContent.defaultProps = {
	isLoading: true,
	keyphrase: "",
	relatedKeyphrases: [],
	renderAction: null,
	response: {},
};
