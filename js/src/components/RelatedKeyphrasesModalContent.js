/* External dependencies */
import { Fragment } from "@wordpress/element";
import PropTypes from "prop-types";

/* Internal dependencies */
import SemRushLoading from "./modals/SemRushLoading";
import SemRushLimitReached from "./modals/SemRushLimitReached";
import SEMrushCountrySelector from "./modals/SEMrushCountrySelector";
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
export default function RelatedKeyphrasesModalContent( { isLoading, keyphrase, relatedKeyphrases,
	renderAction, countryCode, setCountry, newRequest, data } ) {
	// Return table etc. All content based on props etc.
	return (
		<Fragment>
			{ isLoading && <SemRushLoading /> }
			<SemRushUpsellAlert />
			<SemRushLimitReached />
			<SemRushRequestFailed />
			<SEMrushCountrySelector
				countryCode={ countryCode }
				setCountry={ setCountry }
				newRequest={ newRequest }
				keyphrase={ keyphrase }
			/>
			<KeyphrasesTable
				keyphrase={ keyphrase }
				relatedKeyphrases={ relatedKeyphrases }
				countryCode={ countryCode }
				renderAction={ renderAction }
				data={ data }
			/>
			<h2>Content debug info</h2>
			<p>
				The keyphrase is: { keyphrase }<br />
			</p>
		</Fragment>
	);
}

RelatedKeyphrasesModalContent.propTypes = {
	isLoading: PropTypes.bool,
	keyphrase: PropTypes.string,
	relatedKeyphrases: PropTypes.array,
	renderAction: PropTypes.func,
	countryCode: PropTypes.string.isRequired,
	setCountry: PropTypes.func.isRequired,
	newRequest: PropTypes.func.isRequired,
	data: PropTypes.object,
};

RelatedKeyphrasesModalContent.defaultProps = {
	isLoading: true,
	keyphrase: "",
	relatedKeyphrases: [],
	renderAction: null,
	data: {
		data: {
			columnNames: [
				"Keyword",
				"Search Volume",
				"Trends",
			],
			rows: [
				[
					"and you and you and you and you",
					"50",
					"0.14,0.14,0.71,0.14,0.43,0.14,0.14,0.14,0.14,0.29,1.00,0.29",
				],
				[
					"more information",
					"1300",
					"0.63,0.63,0.81,0.63,0.81,0.81,0.81,1.00,1.00,0.81,1.00,1.00",
				],
				[
					"my we",
					"320",
					"0.19,0.24,0.36,0.19,0.24,0.24,0.30,0.24,0.30,0.44,1.00,0.55",
				],
				[
					"please see our website",
					"70",
					"0.11,0.22,0.11,0.00,0.11,0.22,0.78,0.11,0.44,1.00,0.00,0.11",
				],
				[
					"search what you see",
					"90",
					"0.20,0.20,0.20,0.80,0.20,0.60,0.20,0.40,1.00,0.20,0.20,0.20",
				],
				[
					"to your information",
					"30",
					"0.20,0.20,0.40,0.20,0.60,0.60,0.20,0.20,0.40,1.00,1.00,0.20",
				],
				[
					"you and you",
					"210",
					"0.24,0.24,0.24,0.19,0.19,0.24,0.19,0.29,0.44,0.54,0.81,1.00",
				],
				[
					"about this",
					"260",
					"0.81,0.81,0.81,0.81,0.81,0.81,0.66,0.81,0.81,1.00,0.81,0.81",
				],
				[
					"for your information 3",
					"30",
					"0.00,0.29,0.14,0.00,0.00,0.14,0.14,1.00,1.00,0.14,0.14,0.29",
				],
				[
					"you can you can",
					"40",
					"0.11,1.00,0.11,0.11,0.78,1.00,0.11,0.11,0.11,0.11,0.11,0.11",
				],
			],
		},
		status: 200,
	},
};
