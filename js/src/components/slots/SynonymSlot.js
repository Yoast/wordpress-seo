import { Slot } from "@wordpress/components";
import React from "react";
import PropTypes from "prop-types";

/**
 * Renders a Synonym slot.
 * @param {string} location the tablocation of the keyphrase the synonyms belong to.
 *
 * @returns {null|ReactElement} The element.
 */
export default function SynonymSlot( { location } ) {
	return ( <Slot name={ `yoast-synonyms-${ location }` } /> );
}

SynonymSlot.propTypes = {
	location: PropTypes.string.isRequired,
};
