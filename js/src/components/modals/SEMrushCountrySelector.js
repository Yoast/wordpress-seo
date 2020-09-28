/* External dependencies */
import PropTypes from "prop-types";
import { Component } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";
import { addQueryArgs } from "@wordpress/url";
import { __ } from "@wordpress/i18n";

/* Yoast dependencies */
import { ErrorBoundary, SingleSelect } from "@yoast/components";

/**
 * The ID of the SEMrush Country Selection component.
 *
 * @type {string} id The ID of the component.
 */
const id = "yoast-semrush-country-selector";

/**
 * List of all available database countries for the SEMrush API.
 * See: https://www.semrush.com/api-analytics/#databases
 * @type {*[]}
 */
const countries = [
	{ value: "us", name: "United States - US" },
	{ value: "uk", name: "United Kingdom - UK" },
	{ value: "ca", name: "Canada - CA" },
	{ value: "ru", name: "Russia - RU" },
	{ value: "de", name: "Germany - DE" },
	{ value: "fr", name: "France - FR" },
	{ value: "es", name: "Spain - ES" },
	{ value: "it", name: "Italy - IT" },
	{ value: "br", name: "Brazil - BR" },
	{ value: "au", name: "Australia - AU" },
	{ value: "ar", name: "Argentina - AR" },
	{ value: "be", name: "Belgium - BE" },
	{ value: "ch", name: "Switzerland - CH" },
	{ value: "dk", name: "Denmark - DK" },
	{ value: "fi", name: "Finland - FI" },
	{ value: "hk", name: "Hong Kong - HK" },
	{ value: "ie", name: "Ireland - IE" },
	{ value: "il", name: "Israel - IL" },
	{ value: "mx", name: "Mexico - MX" },
	{ value: "nl", name: "Netherlands - NL" },
	{ value: "no", name: "Norway - NO" },
	{ value: "pl", name: "Poland - PL" },
	{ value: "se", name: "Sweden - SE" },
	{ value: "sg", name: "Singapore - SG" },
	{ value: "tr", name: "Turkey - TR" },
	{ value: "jp", name: "Japan - JP" },
	{ value: "in", name: "India - IN" },
	{ value: "hu", name: "Hungary - HU" },
	{ value: "af", name: "Afghanistan - AF" },
	{ value: "al", name: "Albania - AL" },
	{ value: "dz", name: "Algeria - DZ" },
	{ value: "ao", name: "Angola - AO" },
	{ value: "am", name: "Armenia - AM" },
	{ value: "at", name: "Austria - AT" },
	{ value: "az", name: "Azerbaijan - AZ" },
	{ value: "bh", name: "Bahrain - BH" },
	{ value: "bd", name: "Bangladesh - BD" },
	{ value: "by", name: "Belarus - BY" },
	{ value: "bz", name: "Belize - BZ" },
	{ value: "bo", name: "Bolivia - BO" },
	{ value: "ba", name: "Bosnia and Herzegovina - BA" },
	{ value: "bw", name: "Botswana - BW" },
	{ value: "bn", name: "Brunei - BN" },
	{ value: "bg", name: "Bulgaria - BG" },
	{ value: "cv", name: "Cabo Verde - CV" },
	{ value: "kh", name: "Cambodia - KH" },
	{ value: "cm", name: "Cameroon - CM" },
	{ value: "cl", name: "Chile - CL" },
	{ value: "co", name: "Colombia - CO" },
	{ value: "cr", name: "Costa Rica - CR" },
	{ value: "hr", name: "Croatia - HR" },
	{ value: "cy", name: "Cyprus - CY" },
	{ value: "cz", name: "Czech Republic - CZ" },
	{ value: "cd", name: "Congo - CD" },
	{ value: "do", name: "Dominican Republic - DO" },
	{ value: "ec", name: "Ecuador - EC" },
	{ value: "eg", name: "Egypt - EG" },
	{ value: "sv", name: "El Salvador - SV" },
	{ value: "ee", name: "Estonia - EE" },
	{ value: "et", name: "Ethiopia - ET" },
	{ value: "ge", name: "Georgia - GE" },
	{ value: "gh", name: "Ghana - GH" },
	{ value: "gr", name: "Greece - GR" },
	{ value: "gt", name: "Guatemala - GT" },
	{ value: "gy", name: "Guyana - GY" },
	{ value: "ht", name: "Haiti - HT" },
	{ value: "hn", name: "Honduras - HN" },
	{ value: "is", name: "Iceland - IS" },
	{ value: "id", name: "Indonesia - ID" },
	{ value: "jm", name: "Jamaica - JM" },
	{ value: "jo", name: "Jordan - JO" },
	{ value: "kz", name: "Kazakhstan - KZ" },
	{ value: "kw", name: "Kuwait - KW" },
	{ value: "lv", name: "Latvia - LV" },
	{ value: "lb", name: "Lebanon - LB" },
	{ value: "lt", name: "Lithuania - LT" },
	{ value: "lu", name: "Luxembourg - LU" },
	{ value: "mg", name: "Madagascar - MG" },
	{ value: "my", name: "Malaysia - MY" },
	{ value: "mt", name: "Malta - MT" },
	{ value: "mu", name: "Mauritius - MU" },
	{ value: "md", name: "Moldova - MD" },
	{ value: "mn", name: "Mongolia - MN" },
	{ value: "me", name: "Montenegro - ME" },
	{ value: "ma", name: "Morocco - MA" },
	{ value: "mz", name: "Mozambique - MZ" },
	{ value: "na", name: "Namibia - NA" },
	{ value: "np", name: "Nepal - NP" },
	{ value: "nz", name: "New Zealand - NZ" },
	{ value: "ni", name: "Nicaragua - NI" },
	{ value: "ng", name: "Nigeria - NG" },
	{ value: "om", name: "Oman - OM" },
	{ value: "py", name: "Paraguay - PY" },
	{ value: "pe", name: "Peru - PE" },
	{ value: "ph", name: "Philippines - PH" },
	{ value: "pt", name: "Portugal - PT" },
	{ value: "ro", name: "Romania - RO" },
	{ value: "sa", name: "Saudi Arabia - SA" },
	{ value: "sn", name: "Senegal - SN" },
	{ value: "rs", name: "Serbia - RS" },
	{ value: "sk", name: "Slovakia - SK" },
	{ value: "si", name: "Slovenia - SI" },
	{ value: "za", name: "South Africa - ZA" },
	{ value: "kr", name: "South Korea - KR" },
	{ value: "lk", name: "Sri Lanka - LK" },
	{ value: "th", name: "Thailand - TH" },
	{ value: "bs", name: "Bahamas - BS" },
	{ value: "tt", name: "Trinidad and Tobago - TT" },
	{ value: "tn", name: "Tunisia - TN" },
	{ value: "ua", name: "Ukraine - UA" },
	{ value: "ae", name: "United Arab Emirates - AE" },
	{ value: "uy", name: "Uruguay - UY" },
	{ value: "ve", name: "Venezuela - VE" },
	{ value: "vn", name: "Vietnam - VN" },
	{ value: "zm", name: "Zambia - ZM" },
	{ value: "zw", name: "Zimbabwe - ZW" },
	{ value: "ly", name: "Libya - LY" },
];

/**
 * The SEMrush Country Selector component.
 */
class SEMrushCountrySelector extends Component {
	/**
	 * Constructs the CountrySelector.
	 *
	 * @param {Object} props The props for the CountrySelector.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.relatedKeyphrasesRequest = this.relatedKeyphrasesRequest.bind( this );
		this.onChangeHandler = this.onChangeHandler.bind( this );
	}

	/**
	 * Listens to the change action and fires the SEMrush request.
	 *
	 * @returns {void}
	 */
	componentDidMount() {
		// Fire a new request when the modal is first opened and when the keyphrase has been changed.
		if ( ! this.props.response || this.props.keyphrase !== this.props.lastRequestKeyphrase ) {
			this.relatedKeyphrasesRequest();
		}
	}

	/**
	 * Stores the country code via a REST API call.
	 *
	 * @param {string} countryCode The country code to store.
	 *
	 * @returns {void}
	 */
	storeCountryCode( countryCode ) {
		apiFetch( {
			path: "yoast/v1/semrush/country_code",
			method: "POST",
			// eslint-disable-next-line camelcase
			data: { country_code: countryCode },
		} );
	}

	/**
	 * Sends a new related keyphrases request to SEMrush and updates the semrush_country_code value in the database.
	 *
	 * @returns {void}
	 */
	async relatedKeyphrasesRequest() {
		const { keyphrase, countryCode, newRequest } = this.props;

		newRequest( countryCode, keyphrase );

		this.storeCountryCode( countryCode );

		const response = await this.doRequest( keyphrase, countryCode );

		if ( response.status === 200 ) {
			this.handleSuccessResponse( response );

			return;
		}

		this.handleFailedResponse( response );
	}

	/**
	 * Handles a success response.
	 *
	 * @param {Object} response The response object.
	 *
	 * @returns {void}
	 */
	handleSuccessResponse( response ) {
		const {
			setNoResultsFound,
			setRequestSucceeded,
		} = this.props;

		if ( response.results.rows.length === 0 ) {
			// No results found.
			setNoResultsFound();

			return;
		}

		setRequestSucceeded( response );
	}

	/**
	 * Handles a failed response.
	 *
	 * @param {Object} response The response object.
	 *
	 * @returns {void}
	 */
	handleFailedResponse( response ) {
		const { setRequestLimitReached, setRequestFailed } = this.props;

		if ( ! ( "error" in response ) ) {
			return;
		}

		if ( response.error.includes( "TOTAL LIMIT EXCEEDED" ) ) {
			setRequestLimitReached();

			return;
		}

		setRequestFailed( response );
	}

	/**
	 * Performs the related keyphrases API request.
	 *
	 * @param {string} keyphrase   The keyphrase to send to SEMrush.
	 * @param {string} countryCode The database country code to send to SEMrush.
	 *
	 * @returns {Object} The response object.
	 */
	async doRequest( keyphrase, countryCode ) {
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
	}

	/**
	 * Save the selected value in the store.
	 *
	 * @param {string} selected The user selection.
	 *
	 * @returns {void}
	 */
	onChangeHandler( selected ) {
		this.props.setCountry( selected );
	}

	/**
	 * Renders the SEMrush Country Selector.
	 *
	 * @returns {wp.Element} The SEMrush Country Selector.
	 */
	render() {
		return (
			<div id={ id }>
				<SingleSelect
					id={ id + "-select" }
					label={ __( "Show results for:", "wordpress-seo" ) }
					name="semrush-country-code"
					options={ countries }
					selected={ this.props.countryCode }
					onChange={ this.onChangeHandler }
					wrapperClassName={ "yoast-field-group yoast-field-group--inline" }
				/>
				<button
					id={ id + "-button" }
					className="yoast-button yoast-button--secondary"
					onClick={ this.relatedKeyphrasesRequest }
				>
					{ __( "Select country", "wordpress-seo" ) }
				</button>
			</div>
		);
	}
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

/**
 * Renders the CountrySelector inside its own ErrorBoundary to prevent errors from bubbling up.
 *
 * @param {object} props The props for the CountrySelector.
 *
 * @returns {React.Component} The CountrySelector wrapped in an ErrorBoundary.
 */
const CountrySelectorWithErrorBoundary = ( props ) => (
	<ErrorBoundary>
		<SEMrushCountrySelector { ...props } />
	</ErrorBoundary>
);

export { CountrySelectorWithErrorBoundary as SEMrushCountrySelector };
export default SEMrushCountrySelector;
