import { __, sprintf } from "@wordpress/i18n";
import { Paper } from "@yoast/ui-library";
import { BulkEditorContent } from "./components/bulk-editor-content";
import { BulkEditorPageHeader } from "./components/bulk-editor-page-header";

/**
 * Builds the header copy for a content type, following the design's wording.
 *
 * @param {Object} [contentType] The content type ({ name, label }), if any.
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
 * The bulk editor app: the page header and the appearance content (tabs + panels).
 *
 * @param {Object}                            props              The props.
 * @param {import("./services").DataProvider} props.dataProvider The data provider.
 *
 * @returns {JSX.Element} The app.
 */
const App = ( { dataProvider } ) => {
	// Until the content-type navigation (Free-FE 3) drives the selection, the first content type is shown.
	const { title, description } = getHeaderCopy( dataProvider.getContentTypes()[ 0 ] );

	return (
		<div className="yst-p-8 yst-space-y-8 yst-max-w-7xl">
			<Paper>
				<BulkEditorPageHeader title={ title } description={ description } />
			</Paper>
			<BulkEditorContent />
		</div>
	);
};

export default App;
