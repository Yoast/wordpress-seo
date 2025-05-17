import React, { useCallback, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import { Button, AutocompleteField } from "@yoast/ui-library";
import classNames from "classnames";
import { filter } from "lodash";

/**
 * List of all available database countries for the Semrush API. We do not use the label but it is included for reference.
@link https://www.semrush.com/api-analytics/#databases
@type {{value: string, label: string}[]}
 */
const COUNTRIES = [
	{ value: "us", label: "United States - US" },
	{ value: "uk", label: "United Kingdom - UK" },
	{ value: "ca", label: "Canada - CA" },
	{ value: "ru", label: "Russia - RU" },
	{ value: "de", label: "Germany - DE" },
	{ value: "fr", label: "France - FR" },
	{ value: "es", label: "Spain - ES" },
	{ value: "it", label: "Italy - IT" },
	{ value: "br", label: "Brazil - BR" },
	{ value: "au", label: "Australia - AU" },
	{ value: "ar", label: "Argentina - AR" },
	{ value: "be", label: "Belgium - BE" },
	{ value: "ch", label: "Switzerland - CH" },
	{ value: "dk", label: "Denmark - DK" },
	{ value: "fi", label: "Finland - FI" },
	{ value: "hk", label: "Hong Kong - HK" },
	{ value: "ie", label: "Ireland - IE" },
	{ value: "il", label: "Israel - IL" },
	{ value: "mx", label: "Mexico - MX" },
	{ value: "nl", label: "Netherlands - NL" },
	{ value: "no", label: "Norway - NO" },
	{ value: "pl", label: "Poland - PL" },
	{ value: "se", label: "Sweden - SE" },
	{ value: "sg", label: "Singapore - SG" },
	{ value: "tr", label: "Turkey - TR" },
	{ value: "jp", label: "Japan - JP" },
	{ value: "in", label: "India - IN" },
	{ value: "hu", label: "Hungary - HU" },
	{ value: "af", label: "Afghanistan - AF" },
	{ value: "al", label: "Albania - AL" },
	{ value: "dz", label: "Algeria - DZ" },
	{ value: "ao", label: "Angola - AO" },
	{ value: "am", label: "Armenia - AM" },
	{ value: "at", label: "Austria - AT" },
	{ value: "az", label: "Azerbaijan - AZ" },
	{ value: "bh", label: "Bahrain - BH" },
	{ value: "bd", label: "Bangladesh - BD" },
	{ value: "by", label: "Belarus - BY" },
	{ value: "bz", label: "Belize - BZ" },
	{ value: "bo", label: "Bolivia - BO" },
	{ value: "ba", label: "Bosnia and Herzegovina - BA" },
	{ value: "bw", label: "Botswana - BW" },
	{ value: "bn", label: "Brunei - BN" },
	{ value: "bg", label: "Bulgaria - BG" },
	{ value: "cv", label: "Cabo Verde - CV" },
	{ value: "kh", label: "Cambodia - KH" },
	{ value: "cm", label: "Cameroon - CM" },
	{ value: "cl", label: "Chile - CL" },
	{ value: "co", label: "Colombia - CO" },
	{ value: "cr", label: "Costa Rica - CR" },
	{ value: "hr", label: "Croatia - HR" },
	{ value: "cy", label: "Cyprus - CY" },
	{ value: "cz", label: "Czech Republic - CZ" },
	{ value: "cd", label: "Congo - CD" },
	{ value: "do", label: "Dominican Republic - DO" },
	{ value: "ec", label: "Ecuador - EC" },
	{ value: "eg", label: "Egypt - EG" },
	{ value: "sv", label: "El Salvador - SV" },
	{ value: "ee", label: "Estonia - EE" },
	{ value: "et", label: "Ethiopia - ET" },
	{ value: "ge", label: "Georgia - GE" },
	{ value: "gh", label: "Ghana - GH" },
	{ value: "gr", label: "Greece - GR" },
	{ value: "gt", label: "Guatemala - GT" },
	{ value: "gy", label: "Guyana - GY" },
	{ value: "ht", label: "Haiti - HT" },
	{ value: "hn", label: "Honduras - HN" },
	{ value: "is", label: "Iceland - IS" },
	{ value: "id", label: "Indonesia - ID" },
	{ value: "jm", label: "Jamaica - JM" },
	{ value: "jo", label: "Jordan - JO" },
	{ value: "kz", label: "Kazakhstan - KZ" },
	{ value: "kw", label: "Kuwait - KW" },
	{ value: "lv", label: "Latvia - LV" },
	{ value: "lb", label: "Lebanon - LB" },
	{ value: "lt", label: "Lithuania - LT" },
	{ value: "lu", label: "Luxembourg - LU" },
	{ value: "mg", label: "Madagascar - MG" },
	{ value: "my", label: "Malaysia - MY" },
	{ value: "mt", label: "Malta - MT" },
	{ value: "mu", label: "Mauritius - MU" },
	{ value: "md", label: "Moldova - MD" },
	{ value: "mn", label: "Mongolia - MN" },
	{ value: "me", label: "Montenegro - ME" },
	{ value: "ma", label: "Morocco - MA" },
	{ value: "mz", label: "Mozambique - MZ" },
	{ value: "na", label: "Namibia - NA" },
	{ value: "np", label: "Nepal - NP" },
	{ value: "nz", label: "New Zealand - NZ" },
	{ value: "ni", label: "Nicaragua - NI" },
	{ value: "ng", label: "Nigeria - NG" },
	{ value: "om", label: "Oman - OM" },
	{ value: "py", label: "Paraguay - PY" },
	{ value: "pe", label: "Peru - PE" },
	{ value: "ph", label: "Philippines - PH" },
	{ value: "pt", label: "Portugal - PT" },
	{ value: "ro", label: "Romania - RO" },
	{ value: "sa", label: "Saudi Arabia - SA" },
	{ value: "sn", label: "Senegal - SN" },
	{ value: "rs", label: "Serbia - RS" },
	{ value: "sk", label: "Slovakia - SK" },
	{ value: "si", label: "Slovenia - SI" },
	{ value: "za", label: "South Africa - ZA" },
	{ value: "kr", label: "South Korea - KR" },
	{ value: "lk", label: "Sri Lanka - LK" },
	{ value: "th", label: "Thailand - TH" },
	{ value: "bs", label: "Bahamas - BS" },
	{ value: "tt", label: "Trinidad and Tobago - TT" },
	{ value: "tn", label: "Tunisia - TN" },
	{ value: "ua", label: "Ukraine - UA" },
	{ value: "ae", label: "United Arab Emirates - AE" },
	{ value: "uy", label: "Uruguay - UY" },
	{ value: "ve", label: "Venezuela - VE" },
	{ value: "vn", label: "Vietnam - VN" },
	{ value: "zm", label: "Zambia - ZM" },
	{ value: "zw", label: "Zimbabwe - ZW" },
	{ value: "ly", label: "Libya - LY" },
];

/**
 * The Country Selector component.
 *
 * @param {string} [countryCode="en"] The country code.
 * @param {string} [activeCountryCode="en"] The active country code.
 * @param {Function} onChange The change handler for the select.
 * @param {Function} onClick The click handler for the button.
 * @param {string} [className] The class name.
 * @param {string} [userLocale] The user locale, only the language code.
 *
 * @returns {JSX.Element} The country selector.
 */
export const CountrySelector = (
	{
		countryCode = "us",
		activeCountryCode = "us",
		onChange,
		onClick,
		className,
		userLocale,
	},
) => {
	let regionNames;
	try {
		regionNames = new Intl.DisplayNames( [ userLocale ], { type: "region" } );
	} catch ( e ) {
		// Fallback to the browser language.
		regionNames = new Intl.DisplayNames( [ navigator.language.split( "-" )[ 0 ] ], { type: "region" } );
	}

	const [ query, setQuery ] = useState( "" );

	const filteredOptions = useMemo( () => filter( COUNTRIES, option => query
		? regionNames.of( option.value.toUpperCase() ).toLowerCase().startsWith( query )
		: true ), [ query ] );

	const handleQueryChange = useCallback( event => {
		setQuery( event.target.value.toLowerCase() );
	}, [ setQuery ] );

	return (
		<div className={ classNames( "yst-flex yst-items-end yst-gap-2", className ) }>
			<AutocompleteField
				id="yst-country-selector__select"
				label={ __( "Show results for:", "wordpress-seo" ) }
				value={ countryCode }
				selectedLabel={ countryCode ? regionNames.of( countryCode.toUpperCase() ) : "" }
				onChange={ onChange }
				onQueryChange={ handleQueryChange }
				className="sm:yst-w-96"
			>
				{ filteredOptions.map( option => (
					<AutocompleteField.Option key={ option.value } value={ option.value }>
						{ regionNames.of( option.value.toUpperCase() )  }
					</AutocompleteField.Option>
				) ) }

			</AutocompleteField>
			<Button
				id="yst-country-selector__button"
				size="large"
				variant={ activeCountryCode === countryCode ? "secondary" : "primary" }
				onClick={ onClick }
			>{ __( "Change country", "wordpress-seo" ) }</Button>
		</div>
	);
};

CountrySelector.propTypes = {
	countryCode: PropTypes.string,
	activeCountryCode: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	onClick: PropTypes.func.isRequired,
	className: PropTypes.string,
	userLocale: PropTypes.string,
};
