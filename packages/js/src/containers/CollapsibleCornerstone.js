/* globals wpseoAdminL10n */
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import { CollapsibleCornerstone } from "@yoast/externals/components";
import withLocation from "../helpers/withLocation";

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
			learnMoreUrl: wpseoAdminL10n[ "shortlinks.cornerstone_content_info" ],
		};
	} ),
	withDispatch( dispatch => {
		const { toggleCornerstoneContent } = dispatch( "yoast-seo/editor" );

		return {
			onChange: toggleCornerstoneContent,
		};
	} ),
	withLocation(),
] )( CollapsibleCornerstone );
