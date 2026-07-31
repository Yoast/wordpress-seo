import { useSelect } from "@wordpress/data";
import PropTypes from "prop-types";
import { STORE_NAME_EDITOR } from "../../../constants";

/**
 * A single paragraph of error copy with the standard top margin.
 *
 * Shared by every message `Body` so the inline alert and the danger modal
 * render identical paragraph spacing.
 *
 * @param {JSX.node} children The paragraph content.
 * @returns {JSX.Element} The element.
 */
export const Paragraph = ( { children } ) => <p className="yst-mt-2">{ children }</p>;
Paragraph.propTypes = { children: PropTypes.node.isRequired };

/**
 * Reads the help/support links shared by several message bodies.
 *
 * @returns {{commonErrorsLink: string, supportLink: string}} The links.
 */
export const useHelpLinks = () => useSelect( ( select ) => {
	const editorSelect = select( STORE_NAME_EDITOR );
	return {
		commonErrorsLink: editorSelect.selectLink( "https://yoa.st/ai-common-errors" ),
		supportLink: editorSelect.selectAdminLink( "?page=wpseo_page_support" ),
	};
}, [] );
