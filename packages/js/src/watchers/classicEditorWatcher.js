import { subscribe } from "@wordpress/data";

/**
 * Gets the title from the document.
 *
 * @returns {string} The title or an empty string.
 */
const getTitle = () => {
	const titleElement = document.getElementById( "title" );
	return titleElement && titleElement.value || "";
};

export const getEditorData = () => ( {
	title: getTitle(),
} );

const createClassicEditorWatcher = ( { storeName } ) => {
	return {
		watch: () => {},
	};
};

export default createClassicEditorWatcher;
