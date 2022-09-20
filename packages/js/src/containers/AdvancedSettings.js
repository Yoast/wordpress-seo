/* External dependencies */
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";

/* Internal dependencies */
import AdvancedSettings from "../components/AdvancedSettings";

export default compose( [
	withSelect( select => {
		const {
			getNoIndex,
			getNoFollow,
			getAdvanced,
			getBreadcrumbsTitle,
			getCanonical,
			getWordProofTimestamp,
			getIsLoading,
			getEditorContext,
			getPreferences,
		} = select( "yoast-seo/editor" );

		const { isBreadcrumbsDisabled, isPrivateBlog, isWordProofIntegrationActive } = getPreferences();

		return {
			noIndex: getNoIndex(),
			noFollow: getNoFollow(),
			advanced: getAdvanced(),
			breadcrumbsTitle: getBreadcrumbsTitle(),
			canonical: getCanonical(),
			wordproofTimestamp: getWordProofTimestamp(),
			isLoading: getIsLoading(),
			editorContext: getEditorContext(),
			isBreadcrumbsDisabled,
			isPrivateBlog,
			isWordProofIntegrationActive,
		};
	} ),

	withDispatch( dispatch => {
		const {
			setNoIndex,
			setNoFollow,
			setAdvanced,
			setBreadcrumbsTitle,
			setCanonical,
			setWordProofTimestamp,
			loadAdvancedSettingsData,
		} = dispatch( "yoast-seo/editor" );

		return {
			onNoIndexChange: setNoIndex,
			onNoFollowChange: setNoFollow,
			onAdvancedChange: setAdvanced,
			onBreadcrumbsTitleChange: setBreadcrumbsTitle,
			onCanonicalChange: setCanonical,
			onWordProofTimestampChange: setWordProofTimestamp,
			onLoad: loadAdvancedSettingsData,
		};
	} ),
] )( AdvancedSettings );
