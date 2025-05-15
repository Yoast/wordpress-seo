import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { SnippetPreview } from "@yoast/search-metadata-previews";
import { noop } from "lodash";
import PropTypes from "prop-types";
import { STORE_NAME_EDITOR } from "../../shared-admin/constants";
import { PREVIEW_MODE } from "../constants";

const isMobileUserAgentRegExp = /mobi/i;

/**
 * @param {string} mode Either mobile or desktop.
 * @param {string} title The raw title.
 * @param {string} description The raw description.
 * @returns {JSX.Element} The element.
 */
export const GooglePreview = ( { mode, title, description } ) => {
	const baseUrl = useSelect( select => select( STORE_NAME_EDITOR.free ).getBaseUrlFromSettings(), [] );
	const slug = useSelect( select => select( STORE_NAME_EDITOR.free ).getSnippetEditorData().slug || "", [] );
	const date = useSelect( select => select( STORE_NAME_EDITOR.free ).getDateFromSettings(), [] );
	const focusKeyphrase = useSelect( select => select( STORE_NAME_EDITOR.free ).getFocusKeyphrase(), [] );
	const mobileImageUrl = useSelect( select => select( STORE_NAME_EDITOR.free ).getSnippetEditorPreviewImageUrl(), [] );
	const siteIconUrl = useSelect( select => select( STORE_NAME_EDITOR.free ).getSiteIconUrlFromSettings(), [] );
	const shoppingData = useSelect( select => select( STORE_NAME_EDITOR.free ).getShoppingData(), [] );
	const wordsToHighlight = useSelect( select => select( STORE_NAME_EDITOR.free ).getSnippetEditorWordsToHighlight(), [] );
	const siteName = useSelect( select => select( STORE_NAME_EDITOR.free ).getSiteName(), [] );
	const locale = useSelect( select => select( STORE_NAME_EDITOR.free ).getContentLocale(), [] );
	const url = useMemo( () => baseUrl + slug, [ baseUrl, slug ] );
	const isMobileUserAgent = useMemo( () => isMobileUserAgentRegExp.test( window?.navigator?.userAgent ), [ window?.navigator?.userAgent ] );

	return (
		<div className={ `yst-bg-slate-200 yst--mx-6 ${ mode }${ isMobileUserAgent ? " yst-user-agent__mobile" : "" }` }>
			<SnippetPreview
				title={ title }
				description={ description }
				mode={ mode }
				url={ url }
				keyword={ focusKeyphrase }
				date={ date }
				faviconSrc={ siteIconUrl }
				mobileImageSrc={ mobileImageUrl }
				wordsToHighlight={ wordsToHighlight }
				siteName={ siteName }
				locale={ locale }
				shoppingData={ shoppingData }
				onMouseUp={ noop }
			/>
		</div>
	);
};

GooglePreview.propTypes = {
	mode: PropTypes.oneOf( Object.keys( PREVIEW_MODE ) ).isRequired,
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
};
