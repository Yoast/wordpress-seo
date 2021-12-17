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
			getTimestamp,
			getIsLoading,
			getEditorContext,
			getPreferences,
		} = select( "yoast-seo/editor" );

		const { isBreadcrumbsDisabled, isPrivateBlog } = getPreferences();

		return {
			noIndex: getNoIndex(),
			noFollow: getNoFollow(),
			advanced: getAdvanced(),
			breadcrumbsTitle: getBreadcrumbsTitle(),
			canonical: getCanonical(),
			timestamp: getTimestamp(),
			isLoading: getIsLoading(),
			editorContext: getEditorContext(),
			isBreadcrumbsDisabled,
			isPrivateBlog,
		};
	} ),

	withDispatch( dispatch => {
		const {
			setNoIndex,
			setNoFollow,
			setAdvanced,
			setBreadcrumbsTitle,
			setCanonical,
			setTimestamp,
			loadAdvancedSettingsData,
		} = dispatch( "yoast-seo/editor" );

		return {
			onNoIndexChange: setNoIndex,
			onNoFollowChange: setNoFollow,
			onAdvancedChange: setAdvanced,
			onBreadcrumbsTitleChange: setBreadcrumbsTitle,
			onCanonicalChange: setCanonical,
			onTimestampChange: setTimestamp,
			onLoad: loadAdvancedSettingsData,
		};
	} ),
] )( AdvancedSettings );
