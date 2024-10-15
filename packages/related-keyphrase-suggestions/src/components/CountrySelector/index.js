import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import { Button, Select } from "@yoast/ui-library";

/**
 * The ID of the related keyphrase suggestions Country Selection component.
 *
 * @type {string} id The ID of the component.
 */
const id = "yst-semrush-country-selector";

/**
 * List of all available database countries for the Semrush API.
 * See: https://www.semrush.com/api-analytics/#databases
 * @type {*[]}
 */
const countries = [
	{ value: "us", id: "country-us", label: "United States - US" },
	{ value: "uk", id: "country-uk", label: "United Kingdom - UK" },
	{ value: "ca", id: "country-ca", label: "Canada - CA" },
	{ value: "ru", id: "country-ru", label: "Russia - RU" },
	{ value: "de", id: "country-de", label: "Germany - DE" },
	{ value: "fr", id: "country-fr", label: "France - FR" },
	{ value: "es", id: "country-es", label: "Spain - ES" },
	{ value: "it", id: "country-it", label: "Italy - IT" },
	{ value: "br", id: "country-br", label: "Brazil - BR" },
	{ value: "au", id: "country-au", label: "Australia - AU" },
	{ value: "ar", id: "country-ar", label: "Argentina - AR" },
	{ value: "be", id: "country-be", label: "Belgium - BE" },
	{ value: "ch", id: "country-ch", label: "Switzerland - CH" },
	{ value: "dk", id: "country-dk", label: "Denmark - DK" },
	{ value: "fi", id: "country-fi", label: "Finland - FI" },
	{ value: "hk", id: "country-hk", label: "Hong Kong - HK" },
	{ value: "ie", id: "country-ie", label: "Ireland - IE" },
	{ value: "il", id: "country-il", label: "Israel - IL" },
	{ value: "mx", id: "country-mx", label: "Mexico - MX" },
	{ value: "nl", id: "country-nl", label: "Netherlands - NL" },
	{ value: "no", id: "country-no", label: "Norway - NO" },
	{ value: "pl", id: "country-pl", label: "Poland - PL" },
	{ value: "se", id: "country-se", label: "Sweden - SE" },
	{ value: "sg", id: "country-sg", label: "Singapore - SG" },
	{ value: "tr", id: "country-tr", label: "Turkey - TR" },
	{ value: "jp", id: "country-jp", label: "Japan - JP" },
	{ value: "in", id: "country-in", label: "India - IN" },
	{ value: "hu", id: "country-hu", label: "Hungary - HU" },
	{ value: "af", id: "country-af", label: "Afghanistan - AF" },
	{ value: "al", id: "country-al", label: "Albania - AL" },
	{ value: "dz", id: "country-dz", label: "Algeria - DZ" },
	{ value: "ao", id: "country-ao", label: "Angola - AO" },
	{ value: "am", id: "country-am", label: "Armenia - AM" },
	{ value: "at", id: "country-at", label: "Austria - AT" },
	{ value: "az", id: "country-az", label: "Azerbaijan - AZ" },
	{ value: "bh", id: "country-bh", label: "Bahrain - BH" },
	{ value: "bd", id: "country-bd", label: "Bangladesh - BD" },
	{ value: "by", id: "country-by", label: "Belarus - BY" },
	{ value: "bz", id: "country-bz", label: "Belize - BZ" },
	{ value: "bo", id: "country-bo", label: "Bolivia - BO" },
	{ value: "ba", id: "country-ba", label: "Bosnia and Herzegovina - BA" },
	{ value: "bw", id: "country-bw", label: "Botswana - BW" },
	{ value: "bn", id: "country-bn", label: "Brunei - BN" },
	{ value: "bg", id: "country-bg", label: "Bulgaria - BG" },
	{ value: "cv", id: "country-cv", label: "Cabo Verde - CV" },
	{ value: "kh", id: "country-kh", label: "Cambodia - KH" },
	{ value: "cm", id: "country-cm", label: "Cameroon - CM" },
	{ value: "cl", id: "country-cl", label: "Chile - CL" },
	{ value: "co", id: "country-co", label: "Colombia - CO" },
	{ value: "cr", id: "country-cr", label: "Costa Rica - CR" },
	{ value: "hr", id: "country-hr", label: "Croatia - HR" },
	{ value: "cy", id: "country-cy", label: "Cyprus - CY" },
	{ value: "cz", id: "country-cz", label: "Czech Republic - CZ" },
	{ value: "cd", id: "country-cd", label: "Congo - CD" },
	{ value: "do", id: "country-do", label: "Dominican Republic - DO" },
	{ value: "ec", id: "country-ec", label: "Ecuador - EC" },
	{ value: "eg", id: "country-eg", label: "Egypt - EG" },
	{ value: "sv", id: "country-sv", label: "El Salvador - SV" },
	{ value: "ee", id: "country-ee", label: "Estonia - EE" },
	{ value: "et", id: "country-et", label: "Ethiopia - ET" },
	{ value: "ge", id: "country-ge", label: "Georgia - GE" },
	{ value: "gh", id: "country-gh", label: "Ghana - GH" },
	{ value: "gr", id: "country-gr", label: "Greece - GR" },
	{ value: "gt", id: "country-gt", label: "Guatemala - GT" },
	{ value: "gy", id: "country-gy", label: "Guyana - GY" },
	{ value: "ht", id: "country-ht", label: "Haiti - HT" },
	{ value: "hn", id: "country-hn", label: "Honduras - HN" },
	{ value: "is", id: "country-is", label: "Iceland - IS" },
	{ value: "id", id: "country-id", label: "Indonesia - ID" },
	{ value: "jm", id: "country-jm", label: "Jamaica - JM" },
	{ value: "jo", id: "country-jo", label: "Jordan - JO" },
	{ value: "kz", id: "country-kz", label: "Kazakhstan - KZ" },
	{ value: "kw", id: "country-kw", label: "Kuwait - KW" },
	{ value: "lv", id: "country-lv", label: "Latvia - LV" },
	{ value: "lb", id: "country-lb", label: "Lebanon - LB" },
	{ value: "lt", id: "country-lt", label: "Lithuania - LT" },
	{ value: "lu", id: "country-lu", label: "Luxembourg - LU" },
	{ value: "mg", id: "country-mg", label: "Madagascar - MG" },
	{ value: "my", id: "country-my", label: "Malaysia - MY" },
	{ value: "mt", id: "country-mt", label: "Malta - MT" },
	{ value: "mu", id: "country-mu", label: "Mauritius - MU" },
	{ value: "md", id: "country-md", label: "Moldova - MD" },
	{ value: "mn", id: "country-mn", label: "Mongolia - MN" },
	{ value: "me", id: "country-me", label: "Montenegro - ME" },
	{ value: "ma", id: "country-ma", label: "Morocco - MA" },
	{ value: "mz", id: "country-mz", label: "Mozambique - MZ" },
	{ value: "na", id: "country-na", label: "Namibia - NA" },
	{ value: "np", id: "country-np", label: "Nepal - NP" },
	{ value: "nz", id: "country-nz", label: "New Zealand - NZ" },
	{ value: "ni", id: "country-ni", label: "Nicaragua - NI" },
	{ value: "ng", id: "country-ng", label: "Nigeria - NG" },
	{ value: "om", id: "country-om", label: "Oman - OM" },
	{ value: "py", id: "country-py", label: "Paraguay - PY" },
	{ value: "pe", id: "country-pe", label: "Peru - PE" },
	{ value: "ph", id: "country-ph", label: "Philippines - PH" },
	{ value: "pt", id: "country-pt", label: "Portugal - PT" },
	{ value: "ro", id: "country-ro", label: "Romania - RO" },
	{ value: "sa", id: "country-sa", label: "Saudi Arabia - SA" },
	{ value: "sn", id: "country-sn", label: "Senegal - SN" },
	{ value: "rs", id: "country-rs", label: "Serbia - RS" },
	{ value: "sk", id: "country-sk", label: "Slovakia - SK" },
	{ value: "si", id: "country-si", label: "Slovenia - SI" },
	{ value: "za", id: "country-za", label: "South Africa - ZA" },
	{ value: "kr", id: "country-kr", label: "South Korea - KR" },
	{ value: "lk", id: "country-lk", label: "Sri Lanka - LK" },
	{ value: "th", id: "country-th", label: "Thailand - TH" },
	{ value: "bs", id: "country-bs", label: "Bahamas - BS" },
	{ value: "tt", id: "country-tt", label: "Trinidad and Tobago - TT" },
	{ value: "tn", id: "country-tn", label: "Tunisia - TN" },
	{ value: "ua", id: "country-ua", label: "Ukraine - UA" },
	{ value: "ae", id: "country-ae", label: "United Arab Emirates - AE" },
	{ value: "uy", id: "country-uy", label: "Uruguay - UY" },
	{ value: "ve", id: "country-ve", label: "Venezuela - VE" },
	{ value: "vn", id: "country-vn", label: "Vietnam - VN" },
	{ value: "zm", id: "country-zm", label: "Zambia - ZM" },
	{ value: "zw", id: "country-zw", label: "Zimbabwe - ZW" },
	{ value: "ly", id: "country-ly", label: "Libya - LY" },
];

/**
 * The Country Selector component.
 *
 * @returns {JSX.Element} The country selector.
 */
const CountrySelector = (
	{
		countryCode = "us",
		activeCountryCode = "us",
		onChange,
		onSelect,
	},
) => {
	const [ buttonVariant, setButtonVariant ] = useState( "secondary" );

	useEffect( () => {
		if ( activeCountryCode === countryCode ) {
			setButtonVariant( "secondary" );
			return;
		}

		setButtonVariant( "primary" );
	}, [ activeCountryCode, countryCode ] );

	/**
	 * Renders the Country Selector.
	 *
	 * @returns {JSX.Element} The Country Selector.
	 */

	return (
		<div className="yst-flex yst-items-end yst-mb-4">
			<div className="yst-w-1/2">
				<Select
					id={ id + "-select" }
					label={ __( "Show results for:", "wordpress-seo" ) }
					options={ countries }
					value={ countryCode }
					onChange={ onChange }
				/>
			</div>
			<Button
				id={ id + "-button" }
				className="yst-ml-2"
				size="large"
				variant={ buttonVariant }
				onClick={ onSelect }
			>{ __( "Change country", "wordpress-seo" ) }</Button>
		</div>
	);
};

CountrySelector.propTypes = {
	countryCode: PropTypes.string,
	activeCountryCode: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	onSelect: PropTypes.func.isRequired,
};

export default CountrySelector;
