import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import ElementorFill from "../components/fills/ElementorFill";

/* eslint-disable complexity */
export default compose( [
	withSelect( select => {
		const {
			getPreferences,
			getSnippetEditorIsLoading,
		} = select( "yoast-seo/editor" );

		return {
			settings: getPreferences(),
			isLoading: getSnippetEditorIsLoading(),
		};
	} ),
	withDispatch( dispatch => {
		const { loadSnippetEditorData } = dispatch( "yoast-seo/editor" );

		return {
			onLoad: loadSnippetEditorData,
		};
	} ),
] )( ElementorFill );
/* eslint-enable complexity */
