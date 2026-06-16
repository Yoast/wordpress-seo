import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback, useEffect, useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { STORE_NAME } from "../constants";
import { getFieldSets } from "../field-sets";
import { usePosts } from "../services/use-posts";
import { BulkActions, SelectionToolbar } from "./bulk-action-bar";
import { BulkEditorTable } from "./bulk-editor-table";
import { BulkEditorTabPanel, BulkEditorTabs } from "./bulk-editor-tabs";

/**
 * The bulk editor content: the Search/Social appearance tab bar and the tab panels with the field-set table.
 *
 * @param {Object}             props                    The props.
 * @param {DataProvider}       props.dataProvider       The data provider (holds the endpoint).
 * @param {RemoteDataProvider} props.remoteDataProvider The remote data provider (performs the request).
 * @param {string}             props.contentType        The active content type to fetch posts for.
 *
 * @returns {JSX.Element} The content.
 */
export const BulkEditorContent = ( { dataProvider, remoteDataProvider, contentType } ) => {
	const fieldSets = useMemo( () => getFieldSets(), [] );
	const tabs = useMemo(
		() => Object.values( fieldSets ).map( ( { id, label } ) => ( { id, label } ) ),
		[ fieldSets ]
	);
	const activeFieldSet = useSelect( ( select ) => select( STORE_NAME ).selectActiveFieldSet(), [] );
	const selectedIds = useSelect( ( select ) => select( STORE_NAME ).selectSelectedIds(), [] );
	const isPremium = useSelect( ( select ) => select( STORE_NAME ).selectPreference( "isPremium", false ), [] );
	const { setActiveFieldSet, toggleRow, selectAll, deselectAll } = useDispatch( STORE_NAME );

	const { data: items = [], isPending } = usePosts( { dataProvider, remoteDataProvider, contentType } );

	useEffect( () => {
		deselectAll();
	}, [ contentType, deselectAll ] );

	const isAllSelected = items.length > 0 && selectedIds.length === items.length;
	const onSelectAll = useCallback( () => selectAll( items.map( ( item ) => item.id ) ), [ selectAll, items ] );
	const onToggleAll = useCallback( () => ( isAllSelected ? deselectAll() : onSelectAll() ), [ isAllSelected, deselectAll, onSelectAll ] );

	const selection = useMemo( () => ( {
		selectedIds,
		onToggleRow: toggleRow,
	} ), [ selectedIds, toggleRow ] );

	const bulkActions = selectedIds.length > 0 ? <BulkActions isPremium={ isPremium } /> : null;

	return (
		<div className="yst-p-8 yst-space-y-8">
			<BulkEditorTabs
				tabs={ tabs }
				activeTab={ activeFieldSet }
				onChange={ setActiveFieldSet }
				label={ __( "Bulk editor views", "wordpress-seo" ) }
			/>
			{ tabs.map( ( tab ) => (
				<BulkEditorTabPanel key={ tab.id } tabId={ tab.id } isActive={ tab.id === activeFieldSet }>
					<BulkEditorTable
						items={ items }
						fieldSet={ fieldSets[ tab.id ] }
						selection={ selection }
						selectionToolbar={
							<SelectionToolbar
								idSuffix={ `-${ tab.id }` }
								isAllSelected={ isAllSelected }
								onToggleAll={ onToggleAll }
								onSelectAll={ onSelectAll }
								onDeselectAll={ deselectAll }
								selectedCount={ selectedIds.length }
								totalCount={ items.length }
							/>
						}
						bulkActions={ bulkActions }
						isLoading={ isPending }
					/>
				</BulkEditorTabPanel>
			) ) }
		</div>
	);
};
