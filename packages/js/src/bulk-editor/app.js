import { useDispatch, useSelect } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { Paper, SidebarNavigation } from "@yoast/ui-library";
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
 * The bulk editor app: the content-type sub-navigation, the page header, and the appearance content
 * (tabs + panels). The active content type and field set live in the store.
 *
 * @param {Object}                            props                    The props.
 * @param {import("./services").DataProvider} props.dataProvider       The data provider (config + endpoints/links).
 * @param {Object}                            props.remoteDataProvider The remote data provider (HTTP), used to save edits.
 *
 * @returns {JSX.Element} The app.
 */
const App = ( { dataProvider, remoteDataProvider } ) => {
	const activeContentTypeName = useSelect( ( select ) => select( STORE_NAME ).selectActiveContentTypeName(), [] );
	const isPremium = useSelect( ( select ) => select( STORE_NAME ).selectPreference( "isPremium", false ), [] );
	const { setActiveContentType } = useDispatch( STORE_NAME );

	const contentTypes = dataProvider.getContentTypes().map( ( { name, label } ) => ( { id: name, label } ) );
	const activeContentType = contentTypes.find( ( { id } ) => id === activeContentTypeName ) ?? contentTypes[ 0 ];

	const { title, description } = getHeaderCopy( activeContentType );
	// Fall back to the WP admin home when the data provider has no link.
	const backToToolsUrl = dataProvider.getLink( "tools" ) || "/wp-admin/";
	const logoHref = dataProvider.getLink( "dashboard" ) || "/wp-admin/";

	const menuProps = {
		contentTypes,
		onChange: setActiveContentType,
		backToToolsUrl,
		logoHref,
		isPremium,
	};

	return (
		<SidebarNavigation activePath={ activeContentType ? activeContentType.id : "" }>
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
						<BulkEditorContent dataProvider={ dataProvider } remoteDataProvider={ remoteDataProvider } />
					</Paper>
				</div>
			</div>
		</SidebarNavigation>
	);
};

export default App;
