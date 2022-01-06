import marked from "marked";
import { addFilter, removeFilter } from "@wordpress/hooks";

const registerMarkdownPlugin = () => {
    const hookName = "yoast.seoStore.analysis.preparePaper";
	const namespace = "yoast/free/markdownPlugin";

	addFilter(
		hookName,
		namespace,
		( { content, ...paper } ) => {
			return {
				...paper,
				content: marked( content ),
			};
		},
		10
	);
    return () => removeFilter( hookName, namespace );
};

export default registerMarkdownPlugin;
