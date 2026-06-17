import { useDispatch, useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { STORE_NAME } from "../constants";
import { getFieldSets } from "../field-sets";
import { usePosts } from "../services/use-posts";
import { BulkEditorFooter } from "./bulk-editor-footer";
import { BulkEditorTable } from "./bulk-editor-table";
import { BulkEditorTabPanel, BulkEditorTabs } from "./bulk-editor-tabs";
import { SearchBox } from "./search-box";

/**
 * The bulk editor content: the Search/Social appearance tab bar and the tab panels with the field-set table.
 *
 * @param {Object}             props                    The props.
 * @param {DataProvider}       props.dataProvider       The data provider (holds the endpoint).
 * @param {RemoteDataProvider} props.remoteDataProvider The remote data provider (performs the request).
 * @param {string}             props.contentType        The active content type to fetch posts for.
 * @param {string}             props.contentTypeLabel   The active content type label, used in the search placeholder.
 *
 * @returns {JSX.Element} The content.
 */
export const BulkEditorContent = ( { dataProvider, remoteDataProvider, contentType, contentTypeLabel } ) => {
	const fieldSets = useMemo( () => getFieldSets(), [] );
	const tabs = useMemo(
		() => Object.values( fieldSets ).map( ( { id, label } ) => ( { id, label } ) ),
		[ fieldSets ]
	);
	const activeFieldSet = useSelect( ( select ) => select( STORE_NAME ).selectActiveFieldSet(), [] );
	const { setActiveFieldSet } = useDispatch( STORE_NAME );

	const { data: items = [], total = 0, totalPages = 0, isPending } = usePosts( { dataProvider, remoteDataProvider, contentType } );

	return (
		<div className="yst-p-8 yst-space-y-8">
			<div className="yst-flex yst-flex-col yst-gap-4 sm:yst-flex-row sm:yst-items-start sm:yst-justify-between">
				<BulkEditorTabs
					tabs={ tabs }
					activeTab={ activeFieldSet }
					onChange={ setActiveFieldSet }
					label={ __( "Bulk editor views", "wordpress-seo" ) }
				/>
				<SearchBox contentTypeLabel={ contentTypeLabel } />
			</div>
			{ tabs.map( ( tab ) => (
				<BulkEditorTabPanel key={ tab.id } tabId={ tab.id } isActive={ tab.id === activeFieldSet }>
					<BulkEditorTable items={ items } fieldSet={ fieldSets[ tab.id ] } isLoading={ isPending } />
				</BulkEditorTabPanel>
			) ) }
			<BulkEditorFooter total={ total } totalPages={ totalPages } isPending={ isPending } />
		</div>
	);
};
