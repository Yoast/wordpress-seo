/* External dependencies */
import { Fragment } from "@wordpress/element";
import PropTypes from "prop-types";

/* Internal dependencies */
import SemRushLoading from "./modals/SemRushLoading";
import SemRushLimitReached from "./modals/SemRushLimitReached";
import CountrySelector from "./modals/CountrySelector";
import KeyphrasesTable from "./modals/KeyphrasesTable";
import SemRushUpsellAlert from "./modals/SemRushUpsellAlert";
import SemRushRequestFailed from "./modals/SemRushRequestFailed";

/**
 * Renders the SEMrush related keyphrases modal content.
 *
 * @param {bool}   isLoading         Whether the data from SEMrush are loading.
 * @param {string} keyphrase         The main keyphrase set bu the user.
 * @param {string} relatedKeyphrases The related keyphrases set by the user.
 * @param {string} renderAction      The url to link to in the notice.
 * @param {object} data              The data returned by the SEMrush response.
 *
 * @returns {wp.Element} The SEMrush related keyphrases modal content.
 */
export default function RelatedKeyphraseModalContent( { isLoading, keyphrase, relatedKeyphrases, renderAction, data } ) {
	// Return table etc. All content based on props etc.
	return (
		<Fragment>
			{ isLoading && <SemRushLoading /> }
			<SemRushUpsellAlert />
			<SemRushLimitReached />
			<SemRushRequestFailed />
			<CountrySelector />
			<KeyphrasesTable
				keyphrase={ keyphrase }
				relatedKeyphrases={ relatedKeyphrases }
				renderAction={ renderAction }
				data={ data }
			/>
		</Fragment>
	);
}

RelatedKeyphraseModalContent.propTypes = {
	isLoading: PropTypes.bool,
	keyphrase: PropTypes.string,
	relatedKeyphrases: PropTypes.array,
	renderAction: PropTypes.func,
	data: PropTypes.object,
};

RelatedKeyphraseModalContent.defaultProps = {
	isLoading: true,
	keyphrase: "",
	relatedKeyphrases: [],
	renderAction: null,
	data: {
		data: {
			columnNames: [
				"Keyword",
				"Number of Results",
				"Trends",
			],
			rows: [
				[
					"for more information please visit our website",
					"13660000000",
					"0.33,1.00,0.33,0.67,0.33,0.33,0.33,0.33,0.33,0.33,0.33,0.33",
				],
				[
					"what information about",
					"13330000000",
					"0.20,0.00,0.20,0.00,0.20,1.00,0.00,0.00,0.20,0.40,0.00,0.00",
				],
				[
					"more information here",
					"13310000000",
					"0.11,0.11,0.78,0.44,0.22,0.33,0.11,0.33,0.11,0.33,0.11,1.00",
				],
				[
					"you re signed out of youtube",
					"12650000000",
					"0.00,0.33,0.33,0.33,1.00,0.33,0.33,0.00,0.00,1.00,0.33,0.33",
				],
				[
					"for more information",
					"12170000000",
					"0.65,0.53,0.65,0.53,0.53,0.53,0.82,0.82,0.65,0.53,0.65,1.00",
				],
				[
					"click here to view",
					"11810000000",
					"0.78,0.11,0.11,0.11,0.11,0.56,0.11,0.11,0.11,0.11,1.00,0.44",
				],
				[
					"youtube contact details",
					"11750000000",
					"0.14,0.43,0.14,0.14,0.71,1.00,1.00,0.14,0.14,0.29,0.43,0.14",
				],
				[
					"privacy for all",
					"11180000000",
					"0.00,0.25,0.00,0.25,0.00,0.00,0.00,0.00,0.25,0.25,1.00,0.00",
				],
				[
					"how to contact youtube",
					"11160000000",
					"1.00,1.00,0.82,0.82,0.82,1.00,0.82,0.67,0.82,0.82,1.00,1.00",
				],
				[
					"us privacy",
					"10950000000",
					"1.00,0.14,0.14,0.14,0.43,0.43,0.14,0.29,0.71,0.43,0.71,0.14",
				],
			],
		},
		status: 200,
	},
};
