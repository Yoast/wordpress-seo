/* External dependencies */
import PropTypes from "prop-types";
import { Component, Fragment } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";
import { addQueryArgs } from "@wordpress/url";

/* Internal dependencies */
import ErrorBoundary from "@yoast/components/src/internal/ErrorBoundary";
import FieldGroup from "@yoast/components/src/field-group/FieldGroup";

/**
 * The ID of the SEMrush Country Selection component.
 *
 * @type {string} id The ID of the component.
 */
const id = "semrush-country-selector";

/**
 * Renders a HTML option based on a name and value.
 *
 * @param {string} name The name of the option.
 * @param {string} value The value of the option.
 *
 * @returns {React.Component} An HTML option.
 */
const Option = ( { name, value } ) => <option key={ value } value={ value }>{ name }</option>;

Option.propTypes = {
	name: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
};

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
		// Make sure that both jQuery and select2 are defined on the global window.
		if ( typeof window.jQuery().select2 === "undefined" ) {
			throw new Error( "No Select2 found." );
		}

		super( props );

		this.onChangeHandler = this.onChangeHandler.bind( this );
		this.relatedKeyphrasesRequest = this.relatedKeyphrasesRequest.bind( this );
	}

	/**
	 * Creates a select2 component from the select and listen to the change action.
	 *
	 * @returns {void}
	 */
	componentDidMount() {
		this.select2 = jQuery( `#${ id }` );
		this.select2.select2( {
			theme: "default yoast-select2--inline",
			dropdownCssClass: "yoast-select__dropdown",
			dropdownParent: jQuery( ".yoast-related-keyphrases-modal__content" ),
		} );
		this.select2.on( "change.select2", this.onChangeHandler );
	}

	/**
	 * Handler for the onChange event.
	 *
	 * @returns {void}
	 */
	onChangeHandler() {
		const selection = this.select2.select2( "data" ).map( option => option.id )[ 0 ];

		this.props.setCountry( selection );
	}

	/**
	 * Sends a new related keyphrases request to SEMrush and updates the semrush_country_code value in the database.
	 *
	 * @returns {void}
	 */
	async relatedKeyphrasesRequest() {
		const { keyphrase, countrCode, newRequest } = this.props;

		newRequest( countrCode, keyphrase );

		const response = await this.doRequest( keyphrase, countrCode );

		// Store country code
		apiFetch( {
			path: "yoast/v1/semrush/country_code",
			method: "POST",
			// eslint-disable-next-line camelcase
			data: { country_code: this.props.countryCode },
		} );


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
			keyphrase,
			currentDatabase,
			setNoResultsFound,
			setRequestSucceeded,
		} = this.props;

		if ( response.results.rows.length === 0 ) {
			// No results found.
			setNoResultsFound( keyphrase, currentDatabase );

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

		if ( "error" in response === false ) {
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
	 * @param {string} keyphrase The keyphrase to send to SEMrush.
	 * @param {string} database The database country code to send to SEMrush.
	 *
	 * @returns {Object} The response object.
	 */
	async doRequest( keyphrase, database ) {
		return await apiFetch( {
			path: addQueryArgs(
				"/yoast/v1/semrush/related_keyphrases",
				{
					keyphrase,
					database,
				}
			),
		} );
	}

	/**
	 * Renders the SEMrush Country Selector.
	 *
	 * @returns {React.Element} The SEMrush Country Selector.
	 */
	render() {
		return (
			<Fragment>
				<div>
					<FieldGroup
						htmlFor={ id }
						label="Show results for:"
						wrapperClassName="yoast-field-group"
					>
						<select
							id={ id }
							name="semrush-country-code"
							defaultValue={ this.props.countryCode }
						>
							{ countries.map( Option ) }
						</select>
						<button
							className="yoast-button yoast-button--secondary"
							onClick={ this.relatedKeyphrasesRequest }
						>Change Country
						</button>
					</FieldGroup>
				</div>
			</Fragment>
		);
	}
}

SEMrushCountrySelector.propTypes = {
	keyphrase: PropTypes.string,
	countryCode: PropTypes.string,
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
