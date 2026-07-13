import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback, useRef } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Paper, SidebarNavigation, useBeforeUnload } from "@yoast/ui-library";
import { BulkEditorContent } from "./components/bulk-editor-content";
import { BulkEditorNavMenu } from "./components/bulk-editor-nav";
import { BulkEditorPageHeader } from "./components/bulk-editor-page-header";
import { STORE_NAME } from "./constants";

/**
 * Builds the header copy for a content type, following the design's wording.
 *
 * @param {Object} [contentType] The content type ({ id, label }), if any.
 *
 * @returns {{title: string, description: string}} The header title and description.
 */
const getHeaderCopy = ( contentType ) => {
	const label = contentType ? contentType.label : __( "Content", "wordpress-seo" );
	const lowercaseLabel = label.toLowerCase();

	return {
		/* translators: %s expands to the content type label, e.g. "Pages". */
		title: sprintf( __( "Bulk editor: %s", "wordpress-seo" ), label ),
		description: sprintf(
			/* translators: %1$s and %2$s expand to the lowercase content type label, e.g. "pages". */
			__( "The bulk editor for %1$s is a tool that you can use to quickly make changes to your search and social media appearance for multiple %2$s.", "wordpress-seo" ),
			lowercaseLabel,
			lowercaseLabel
		),
	};
};

/**
 * Resolves the id and labels of the active content type, falling back to empty strings when there is none.
 *
 * @param {Object} [contentType] The content type ({ id, label, singularLabel }), if any.
 *
 * @returns {{id: string, label: string, singularLabel: string}} The active content type id and labels.
 */
const getActiveContentTypeFields = ( contentType ) => ( {
	id: contentType ? contentType.id : "",
	label: contentType ? contentType.label : "",
	singularLabel: contentType ? contentType.singularLabel : "",
} );

/**
 * The bulk editor app: the content-type sub-navigation, the page header, and the appearance content
 * (tabs + panels). The active content type and field set live in the store.
 *
 * @param {Object}                            props                    The props.
 * @param {import("./services").DataProvider} props.dataProvider       The data provider (config + endpoints/links).
 * @param {Object}                            props.remoteDataProvider The remote data provider (HTTP), used to fetch and save edits.
 *
 * @returns {JSX.Element} The app.
 */
const App = ( { dataProvider, remoteDataProvider } ) => {
	const activeContentTypeName = useSelect( ( select ) => select( STORE_NAME ).selectActiveContentTypeName(), [] );
	const isPremium = useSelect( ( select ) => select( STORE_NAME ).selectPreference( "isPremium", false ), [] );
	// Manual inline edits or an external plugin's pending changes (Premium AI) both count as unsaved work that a
	// hard exit (refresh/close/back button) would silently discard.
	const hasUnsavedChanges = useSelect( ( select ) => {
		const store = select( STORE_NAME );
		return Object.keys( store.selectEditingRows() ).length > 0 || store.selectHasExternalPendingChanges();
	}, [] );
	const { requestSwitch } = useDispatch( STORE_NAME );

	// The browser's native confirm dialog is the only guard available for refresh/close/back; the in-app links use
	// the styled modal below via onNavigate instead.
	useBeforeUnload(
		hasUnsavedChanges,
		__( "There are unsaved changes on this page. Leaving means that those changes will be lost. Are you sure you want to leave this page?", "wordpress-seo" )
	);

	// A hard-navigation link (logo, Back to Tools) requests a guarded switch: requestSwitch defers to the modal when
	// there are unsaved changes, else navigates straight away. Modified clicks (open in new tab/window) don't leave
	// the current page, so they pass through to the browser unguarded.
	const onNavigate = useCallback( ( event, href ) => {
		const passThrough = [ event.defaultPrevented, event.button !== 0, event.metaKey, event.ctrlKey, event.shiftKey, event.altKey ];
		if ( passThrough.some( Boolean ) ) {
			return;
		}
		event.preventDefault();
		requestSwitch( { kind: "navigate", target: href } );
	}, [ requestSwitch ] );

	const contentTypes = dataProvider.getContentTypes().map( ( { name, label, singularLabel } ) => ( { id: name, label, singularLabel } ) );
	const activeContentType = contentTypes.find( ( { id } ) => id === activeContentTypeName ) ?? contentTypes[ 0 ];
	const { id: activeContentTypeId, label: activeContentTypeLabel, singularLabel: activeContentTypeSingularLabel } =
		getActiveContentTypeFields( activeContentType );

	// The resolved active id is read from a ref so the handler below can stay referentially stable: the sidebar
	// navigation freezes the first click handler it receives, so a handler closing over activeContentTypeId would
	// keep comparing against a stale value and silently drop a switch back to an earlier content type.
	const activeContentTypeIdRef = useRef( activeContentTypeId );
	activeContentTypeIdRef.current = activeContentTypeId;

	// Selecting a content type requests a guarded switch (requestSwitch defers to the modal or switches straight away).
	// The no-op check runs here against the resolved id: the store's active name can be "" (meaning "first content
	// type"), which the store-level guard can't resolve, so clicking the active first type would otherwise switch.
	const onChangeContentType = useCallback( ( id ) => {
		if ( id !== activeContentTypeIdRef.current ) {
			requestSwitch( { kind: "contentType", target: id } );
		}
	}, [ requestSwitch ] );

	const { title, description } = getHeaderCopy( activeContentType );
	// Fall back to the WP admin home when the data provider has no link.
	const backToToolsUrl = dataProvider.getLink( "tools" ) || "/wp-admin/";
	const logoHref = dataProvider.getLink( "dashboard" ) || "/wp-admin/";

	const menuProps = {
		contentTypes,
		onChange: onChangeContentType,
		backToToolsUrl,
		onNavigate,
		logoHref,
		isPremium,
	};

	return (
		<SidebarNavigation activePath={ activeContentTypeId }>
			<SidebarNavigation.Mobile
				openButtonId="button-open-bulk-editor-navigation-mobile"
				closeButtonId="button-close-bulk-editor-navigation-mobile"
				openButtonScreenReaderText={ __( "Open bulk editor navigation", "wordpress-seo" ) }
				closeButtonScreenReaderText={ __( "Close bulk editor navigation", "wordpress-seo" ) }
				aria-label={ __( "Bulk editor navigation", "wordpress-seo" ) }
			>
				<BulkEditorNavMenu { ...menuProps } idSuffix="-mobile" />
			</SidebarNavigation.Mobile>
			<div className="yst-p-4 min-[783px]:yst-p-8 yst-flex yst-items-start yst-gap-6">
				<aside className="yst-w-56 yst-shrink-0 yst-hidden min-[783px]:yst-block">
					<SidebarNavigation.Sidebar aria-label={ __( "Bulk editor menu", "wordpress-seo" ) }>
						<BulkEditorNavMenu { ...menuProps } />
					</SidebarNavigation.Sidebar>
				</aside>
				<div className="yst-grow yst-max-w-page yst-min-w-0">
					<Paper as="main">
						<BulkEditorPageHeader title={ title } description={ description } />
						<BulkEditorContent
							dataProvider={ dataProvider }
							remoteDataProvider={ remoteDataProvider }
							contentType={ activeContentTypeId }
							contentTypeLabel={ activeContentTypeLabel }
							contentTypeSingularLabel={ activeContentTypeSingularLabel }
						/>
					</Paper>
				</div>
			</div>
		</SidebarNavigation>
	);
};

export default App;
