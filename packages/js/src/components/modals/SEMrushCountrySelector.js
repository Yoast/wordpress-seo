/* External dependencies */
import PropTypes from "prop-types";
import { useEffect, useCallback, useState } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";
import { addQueryArgs } from "@wordpress/url";

/* Yoast dependencies */
import { CountrySelector } from "@yoast/related-keyphrase-suggestions";
import { Root } from "@yoast/ui-library";

/**
 * The SEMrush Country Selector wrapper component.
 *
 * @param {string} [countryCode] The country code.
 * @param {Function} setCountry The function to set the country code.
 * @param {Function} newRequest The function to fire a new request.
 * @param {string} [keyphrase] The keyphrase.
 * @param {Function} setRequestFailed The function to set the request as failed.
 * @param {Function} setNoResultsFound The function to set the request as having no results.
 * @param {Function} setRequestSucceeded The function to set the request as succeeded.
 * @param {Function} setRequestLimitReached The function to set the request as having reached the limit.
 * @param {Object} response The response object.
 * @param {string} lastRequestKeyphrase The last requested keyphrase.
 * @param {boolean} isRtl Whether the site is in RTL mode.
 * @param {string} userLocale The user locale.
 *
 * @returns {JSX.Element} The SEMrush Country Selector component.
 */
const SEMrushCountrySelector = ( {
	countryCode,
	setCountry,
	newRequest,
	keyphrase,
	setRequestFailed,
	setNoResultsFound,
	setRequestSucceeded,
	setRequestLimitReached,
	response,
	lastRequestKeyphrase,
	isRtl,
	userLocale,
} ) => {
	const [ activeCountryCode, setActiveCountryCode ] = useState( countryCode );

	/**
	 * Handles a failed response.
	 *
	 * @param {Object} res The response object.
	 *
	 * @returns {void}
	 */
	const handleFailedResponse = useCallback( ( res ) => {
		if ( ! ( "error" in res ) ) {
			return;
		}

		if ( res.error.includes( "TOTAL LIMIT EXCEEDED" ) ) {
			setRequestLimitReached();

			return;
		}

		setRequestFailed( res );
	}, [ setRequestLimitReached, setRequestFailed ] );

	/**
	 * Sends a new related keyphrases request to SEMrush and updates the semrush_country_code value in the database.
	 *
	 * @returns {void}
	 */
	const relatedKeyphrasesRequest = useCallback( async() => {
		newRequest( countryCode, keyphrase );

		apiFetch( {
			path: "yoast/v1/semrush/country_code",
			method: "POST",
			// eslint-disable-next-line camelcase
			data: { country_code: countryCode },
		} );

		const res = await apiFetch( {
			path: addQueryArgs(
				"/yoast/v1/semrush/related_keyphrases",
				{
					keyphrase,
					// eslint-disable-next-line camelcase
					country_code: countryCode,
				}
			),
		} );

		if ( res.status === 200 ) {
			if ( res.results.rows.length === 0 ) {
				// No results found.
				setNoResultsFound();
				return;
			}

			setRequestSucceeded( res );
			setActiveCountryCode( countryCode );
			return;
		}

		handleFailedResponse( res );
	}, [ countryCode, keyphrase, newRequest ] );

	// Listens to the change action and fires the SEMrush request.
	// Fire a new request when the modal is first opened and when the keyphrase has been changed.
	// Should only fire once at the start.
	useEffect( ()=>{
		if ( ! response || keyphrase !== lastRequestKeyphrase ) {
			relatedKeyphrasesRequest();
		}
	}, [] );

	return (
		<Root context={ { isRtl } }>
			<CountrySelector
				countryCode={ countryCode }
				activeCountryCode={ activeCountryCode }
				onChange={ setCountry }
				onClick={ relatedKeyphrasesRequest }
				className="yst-my-5 lg:yst-w-4/5"
				userLocale={ userLocale }
			/>
		</Root>
	);
};

SEMrushCountrySelector.propTypes = {
	keyphrase: PropTypes.string,
	countryCode: PropTypes.string,
	response: PropTypes.object,
	lastRequestKeyphrase: PropTypes.string,
	setCountry: PropTypes.func.isRequired,
	newRequest: PropTypes.func.isRequired,
	setNoResultsFound: PropTypes.func.isRequired,
	setRequestSucceeded: PropTypes.func.isRequired,
	setRequestLimitReached: PropTypes.func.isRequired,
	setRequestFailed: PropTypes.func.isRequired,
	isRtl: PropTypes.bool.isRequired,
	userLocale: PropTypes.string,
};

SEMrushCountrySelector.defaultProps = {
	keyphrase: "",
	countryCode: "us",
	response: {},
	lastRequestKeyphrase: "",
	userLocale: null,
};

export default SEMrushCountrySelector;
