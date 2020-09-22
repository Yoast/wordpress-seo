/* globals wpseoAdminL10n */
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import CollapsibleCornerstone from "../components/CollapsibleCornerstone";

/**
 * Composes the CollapsibleCornerstone container.
 *
 * @returns {Component} The composed CollapsibleCornerstone component.
 */
export default compose( [
	withSelect( select => {
		const { isCornerstoneContent } = select( "yoast-seo/editor" );

		return {
			isCornerstone: isCornerstoneContent(),
		};
	} ),
	withDispatch( dispatch => {
		const { toggleCornerstoneContent } = dispatch( "yoast-seo/editor" );

		return {
			onChange: () => {
				dispatch( toggleCornerstoneContent() );
			},
		};
	} ),
] )( CollapsibleCornerstone );
