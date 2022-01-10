import marked from "marked";
import { addFilter, removeFilter } from "@wordpress/hooks";

/**
 * Registers a paper data plugin to parse Markdown content.
 *
 * @returns {void}
 */
const registerMarkdownPlugin = () => {
	const hookName = "yoast.seoStore.analysis.preparePaper";
	const namespace = "yoast/free/markdownPlugin";

	addFilter(
		hookName,
		namespace,
		( { content, ...paper } ) => ( {
			...paper,
			content: marked( content ),
		} ),
		10
	);
	return () => removeFilter( hookName, namespace );
};

export default registerMarkdownPlugin;
