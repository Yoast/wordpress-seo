/* External dependencies */
import { Fragment } from "@wordpress/element";
import PropTypes from "prop-types";

/* Internal dependencies */
import SemRushLoading from "./modals/SemRushLoading";
import SemRushLimitReached from "./modals/SemRushLimitReached";
import SemRushCountrySelector from "./modals/SemRushCountrySelector";
import KeyphrasesTable from "./modals/KeyphrasesTable";
import SemRushUpsellAlert from "./modals/SemRushUpsellAlert";
import SemRushRequestFailed from "./modals/SemRushRequestFailed";

/**
 * Renders the SEMrush related keyphrases modal content.
 *
 * @param {bool}   isLoading    Whether the data from SEMrush are loading.
 * @param {string} keyphrase    The main keyphrase set bu the user.
 * @param {string} keyphrases   The related keyphrases set by the user.
 * @param {string} renderAction The url to link to in the notice.
 *
 * @returns {wp.Element} The SEMrush related keyphrases modal content.
 */
export default function RelatedKeyphraseModalContent( { isLoading, keyphrase, relatedKeyphrases, renderAction, currentDatabase, setDatabase } ) {
	// Return table etc. All content based on props etc.
	return (
		<Fragment>
			{ isLoading && <SemRushLoading /> }
			<SemRushUpsellAlert />
			<SemRushLimitReached />
			<SemRushRequestFailed />
			<SemRushCountrySelector
				currentDatabase={ currentDatabase }
				setDatabase={ setDatabase }
			/>
			<KeyphrasesTable
				keyphrase={ keyphrase }
				relatedKeyphrases={ relatedKeyphrases }
				renderAction={ renderAction }
			/>
		</Fragment>
	);
}

RelatedKeyphraseModalContent.propTypes = {
	isLoading: PropTypes.bool,
	keyphrase: PropTypes.string,
	relatedKeyphrases: PropTypes.array,
	renderAction: PropTypes.func,
};

RelatedKeyphraseModalContent.defaultProps = {
	isLoading: true,
	keyphrase: "",
	relatedKeyphrases: [],
	renderAction: null,
};
