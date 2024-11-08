/* External dependencies */
import PropTypes from "prop-types";
import { useEffect, useCallback, useState } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";
import { addQueryArgs } from "@wordpress/url";
import { __ } from "@wordpress/i18n";

/* Yoast dependencies */
import { CountrySelector } from "@yoast/related-keyphrase-suggestions";
import { Root } from "@yoast/ui-library";

/**
 * The SEMrush Country Selector component.
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
	lastRequestKeyphrase
} ) => {
	const [ activeCountryCode, setActiveCountryCode ] = useState( countryCode );

	// Listens to the change action and fires the SEMrush request.
	// Fire a new request when the modal is first opened and when the keyphrase has been changed.
	useEffect(()=>{
		if ( ! response || keyphrase !== lastRequestKeyphrase ) {
			relatedKeyphrasesRequest();
		}
	},[]);

	/**
	 * Stores the country code via a REST API call.
	 *
	 * @param {string} countryCode The country code to store.
	 *
	 * @returns {void}
	 */
	const storeCountryCode = useCallback(( countryCode ) => {
		apiFetch( {
			path: "yoast/v1/semrush/country_code",
			method: "POST",
			// eslint-disable-next-line camelcase
			data: { country_code: countryCode },
		} );
	},[]);

	/**
	 * Sends a new related keyphrases request to SEMrush and updates the semrush_country_code value in the database.
	 *
	 * @returns {void}
	 */
	const relatedKeyphrasesRequest = useCallback( async () => {

		newRequest( countryCode, keyphrase );

		storeCountryCode( countryCode );

		const response = await doRequest( keyphrase, countryCode );

		if ( response.status === 200 ) {
			handleSuccessResponse( response );
			setActiveCountryCode( countryCode );
			return;
		}

		handleFailedResponse( response );
	}, [ countryCode, keyphrase, newRequest ] );

	/**
	 * Handles a success response.
	 *
	 * @param {Object} response The response object.
	 *
	 * @returns {void}
	 */
	const handleSuccessResponse = useCallback( ( response ) => {

		if ( response.results.rows.length === 0 ) {
			// No results found.
			setNoResultsFound();
			return;
		}
		
		setRequestSucceeded( response );
	}, [ setNoResultsFound, setRequestSucceeded ] );

	/**
	 * Handles a failed response.
	 *
	 * @param {Object} response The response object.
	 *
	 * @returns {void}
	 */
	const handleFailedResponse = useCallback( ( response ) => {

		if ( ! ( "error" in response ) ) {
			return;
		}

		if ( response.error.includes( "TOTAL LIMIT EXCEEDED" ) ) {
			setRequestLimitReached();

			return;
		}

		setRequestFailed( response );
	} , [ setRequestLimitReached, setRequestFailed ] );

	/**
	 * Performs the related keyphrases API request.
	 *
	 * @param {string} keyphrase   The keyphrase to send to SEMrush.
	 * @param {string} countryCode The database country code to send to SEMrush.
	 *
	 * @returns {Object} The response object.
	 */
	const doRequest = useCallback( async ( keyphrase, countryCode ) => {
		return await apiFetch( {
			path: addQueryArgs(
				"/yoast/v1/semrush/related_keyphrases",
				{
					keyphrase,
					// eslint-disable-next-line camelcase
					country_code: countryCode,
				}
			),
		} );
	}, [] );

	/**
	 * Save the selected value in the store.
	 *
	 * @param {string} selected The user selection.
	 *
	 * @returns {void}
	 */
	const onChangeHandler = useCallback( ( selected ) => {
		setCountry( selected );
	}, []);


	return (
			<Root context={ { isRtl } }>
				<CountrySelector
					countryCode={ countryCode }
					activeCountryCode={ activeCountryCode }
					onChange={ onChangeHandler }
					onClick={ relatedKeyphrasesRequest }
					className="yst-my-5 lg:yst-w-4/5"
					userLocale={ userLcale }
				/>
			</Root>
	);
}

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
};

SEMrushCountrySelector.defaultProps = {
	keyphrase: "",
	countryCode: "us",
	response: {},
	lastRequestKeyphrase: "",
};

export default SEMrushCountrySelector;
