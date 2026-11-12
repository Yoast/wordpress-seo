import { Slot } from "@wordpress/components";

/**
 * Renders a Synonym slot.
 *
 * @param {Object} props Component props.
 * @param {string} props.location the tablocation of the keyphrase the synonyms belong to.
 *
 * @returns {null|wp.Element} The element.
 */
export default function SynonymSlot( { location } ) {
	return ( <Slot name={ `yoast-synonyms-${ location }` } /> );
}
