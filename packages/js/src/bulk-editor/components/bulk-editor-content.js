import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback, useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { STORE_NAME } from "../constants";
import { getFieldSets } from "../field-sets";
import { useInlineEdit } from "../hooks/use-inline-edit";
import { usePosts } from "../services/use-posts";
import { BulkEditorTable } from "./table/bulk-editor-table";
import { BulkEditorTabPanel, BulkEditorTabs } from "./bulk-editor-tabs";
import { SearchBox } from "./search-box";

/**
 * The bulk editor content: the Search/Social appearance tab bar and the tab panels with the field-set table.
 *
 * @param {Object}                             props                    The props.
 * @param {import("../services").DataProvider} props.dataProvider       The data provider (config + endpoints).
 * @param {Object}                             props.remoteDataProvider The remote data provider (HTTP), used to fetch and save.
 * @param {string}                             props.contentType        The active content type to fetch posts for.
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

	const { data: items = [], isPending, updateItem } = usePosts( { dataProvider, remoteDataProvider, contentType } );
	const { editing, stopEditing } = useInlineEdit( { dataProvider, remoteDataProvider, fieldSets, activeFieldSet, items, updateItem } );

	const onChangeTab = useCallback( ( id ) => {
		stopEditing();
		setActiveFieldSet( id );
	}, [ stopEditing, setActiveFieldSet ] );

	return (
		<div className="yst-p-8 yst-space-y-8">
			<div className="yst-flex yst-flex-col yst-gap-4 sm:yst-flex-row sm:yst-items-start sm:yst-justify-between">
				<BulkEditorTabs
					tabs={ tabs }
					activeTab={ activeFieldSet }
					onChange={ onChangeTab }
					label={ __( "Bulk editor views", "wordpress-seo" ) }
				/>
				<SearchBox contentTypeLabel={ contentTypeLabel } />
			</div>
			{ tabs.map( ( tab ) => (
				<BulkEditorTabPanel key={ tab.id } tabId={ tab.id } isActive={ tab.id === activeFieldSet }>
					<BulkEditorTable items={ items } fieldSet={ fieldSets[ tab.id ] } editing={ editing } isLoading={ isPending } />
				</BulkEditorTabPanel>
			) ) }
		</div>
	);
};
