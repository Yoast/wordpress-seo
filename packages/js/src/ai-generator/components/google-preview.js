import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { SnippetPreview } from "@yoast/search-metadata-previews";
import { noop } from "lodash";
import PropTypes from "prop-types";
import { PREVIEW_MODE, STORE_NAME_EDITOR } from "../constants";

const isMobileUserAgentRegExp = /mobi/i;

/**
 * @param {string} mode Either mobile or desktop.
 * @param {string} title The raw title.
 * @param {string} description The raw description.
 * @returns {JSX.Element} The element.
 */
export const GooglePreview = ( { mode, title, description } ) => {
	const baseUrl = useSelect( select => select( STORE_NAME_EDITOR ).getBaseUrlFromSettings(), [] );
	const slug = useSelect( select => select( STORE_NAME_EDITOR ).getSnippetEditorData().slug || "", [] );
	const date = useSelect( select => select( STORE_NAME_EDITOR ).getDateFromSettings(), [] );
	const focusKeyphrase = useSelect( select => select( STORE_NAME_EDITOR ).getFocusKeyphrase(), [] );
	const mobileImageUrl = useSelect( select => select( STORE_NAME_EDITOR ).getSnippetEditorPreviewImageUrl(), [] );
	const siteIconUrl = useSelect( select => select( STORE_NAME_EDITOR ).getSiteIconUrlFromSettings(), [] );
	const shoppingData = useSelect( select => select( STORE_NAME_EDITOR ).getShoppingData(), [] );
	const wordsToHighlight = useSelect( select => select( STORE_NAME_EDITOR ).getSnippetEditorWordsToHighlight(), [] );
	const siteName = useSelect( select => select( STORE_NAME_EDITOR ).getSiteName(), [] );
	const locale = useSelect( select => select( STORE_NAME_EDITOR ).getContentLocale(), [] );
	const url = useMemo( () => baseUrl + slug, [ baseUrl, slug ] );
	const isMobileUserAgent = useMemo( () => isMobileUserAgentRegExp.test( window?.navigator?.userAgent ), [ window?.navigator?.userAgent ] );

	return (
		<div className={ `yst-ai-generator-preview-section ${ mode }${ isMobileUserAgent ? " yst-user-agent__mobile" : "" }` }>
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
