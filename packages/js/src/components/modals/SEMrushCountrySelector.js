/* External dependencies */
import PropTypes from "prop-types";
import { useCallback, useState } from "@wordpress/element";

/* Yoast dependencies */
import { CountrySelector } from "@yoast/related-keyphrase-suggestions";

/**
 * The SEMrush Country Selector wrapper component.
 *
 * @param {string} [countryCode] The country code.
 * @param {Function} setCountry The function to set the country code.
 * @param {Function} newRequest The function to fire a new request.
 * @param {string} [keyphrase] The keyphrase.
 * @param {string} userLocale The user locale.
 *
 * @returns {JSX.Element} The SEMrush Country Selector component.
 */
const SEMrushCountrySelector = ( {
	countryCode,
	setCountry,
	newRequest,
	keyphrase,
	userLocale,
} ) => {
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
		<CountrySelector
			countryCode={ countryCode }
			activeCountryCode={ activeCountryCode }
			onChange={ setCountry }
			onClick={ relatedKeyphrasesRequest }
			className="yst-mb-4"
			userLocale={ userLocale }
		/>
	);
};

SEMrushCountrySelector.propTypes = {
	keyphrase: PropTypes.string,
	countryCode: PropTypes.string,
	setCountry: PropTypes.func.isRequired,
	newRequest: PropTypes.func.isRequired,
	userLocale: PropTypes.string,
};

SEMrushCountrySelector.defaultProps = {
	keyphrase: "",
	countryCode: "us",
	userLocale: null,
};

export default SEMrushCountrySelector;
