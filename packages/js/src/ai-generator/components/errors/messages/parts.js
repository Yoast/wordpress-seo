import { useSelect } from "@wordpress/data";
import { STORE_NAME_EDITOR } from "../../../constants";

/**
 * A single paragraph of error copy with the standard top margin.
 *
 * Shared by every message `Body` so the inline alert and the danger modal
 * render identical paragraph spacing.
 *
 * @param {Object} props Component props.
 * @param {import("react").ReactNode} props.children The paragraph content.
 *
 * @returns {JSX.Element} The element.
 */
export const Paragraph = ( { children } ) => <p className="yst-mt-2">{ children }</p>;

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
