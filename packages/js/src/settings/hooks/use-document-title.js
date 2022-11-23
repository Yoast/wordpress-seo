import useSelectSettings from "./use-select-settings";

/**
 * Gets the current document title with pre- or postfix.
 * @param {Object} [props] The properties.
 * @param {string} [props.prefix] The prefix to prepend to document title.
 * @param {string} [props.postfix] The postfix to append to document title.
 * @returns {string} The document title.
 */
const useDocumentTitle = ( { prefix = "", postfix = "" } = {} ) => {
	const documentTitle = useSelectSettings( "selectPreference", [], "documentTitle" );
	return prefix + documentTitle + postfix;
};

export default useDocumentTitle;
