import { useSelect } from "@wordpress/data";
import propTypes from "prop-types";
import { OPTIMIZE_STORE_KEY } from "../constants";


/**
 * Gets an url from options and creates a link.
 * @param {string} optionPath The path to get the url from.
 * @param {string} linkText The text for the link.
 * @returns {*} The link.
 */
export const InfoLink = ( { optionPath, linkText } ) => {
	if ( optionPath === "" ) {
		return null;
	}

	const url = useSelect( select => select( OPTIMIZE_STORE_KEY ).getOption( optionPath ), [] );
	return (
		<a href={ url } className="yst-block yst-mt-2" target="_blank" rel="noopener noreferrer">{ linkText }</a>
	);
};

InfoLink.propTypes = {
	optionPath: propTypes.string.isRequired,
	linkText: propTypes.string.isRequired,
};
