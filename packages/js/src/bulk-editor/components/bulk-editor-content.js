import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback, useMemo, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { STORE_NAME } from "../constants";
import { getFieldSets } from "../field-sets";
import { useInlineEdit } from "../hooks/use-inline-edit";
import { usePosts } from "../services/use-posts";
import { BulkEditorTable } from "./table/bulk-editor-table";
import { BulkEditorTabPanel, BulkEditorTabs } from "./bulk-editor-tabs";
import { UnsavedChangesModal } from "./unsaved-changes-modal";

/**
 * The bulk editor content: the Search/Social appearance tab bar and the tab panels with the field-set table.
 *
 * @param {Object}                             props                    The props.
 * @param {import("../services").DataProvider} props.dataProvider       The data provider (config + endpoints).
 * @param {Object}                             props.remoteDataProvider The remote data provider (HTTP), used to fetch and save.
 * @param {string}                             props.contentType        The active content type to fetch posts for.
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
	const { setActiveFieldSet } = useDispatch( STORE_NAME );

	const { data: items = [], isPending, updateItem } = usePosts( { dataProvider, remoteDataProvider, contentType } );
	const { editing, stopEditing } = useInlineEdit( { dataProvider, remoteDataProvider, fieldSets, activeFieldSet, items, updateItem } );

	// The tab the user wants to switch to while rows still have unsaved edits; drives the confirmation modal.
	const [ pendingTab, setPendingTab ] = useState( null );
	const hasUnsavedEdits = Object.keys( editing.editingRows ).length > 0;

	const onChangeTab = useCallback( ( id ) => {
		if ( id === activeFieldSet ) {
			return;
		}
		// Guard the switch when edits are in progress; otherwise switch straight away.
		if ( Object.keys( editing.editingRows ).length > 0 ) {
			setPendingTab( id );
			return;
		}
		setActiveFieldSet( id );
	}, [ activeFieldSet, editing.editingRows, setActiveFieldSet ] );

	const onSaveAndSwitch = useCallback( () => {
		// Fire the save for every open field; each reads its draft synchronously, so clearing the edit state
		// right after still posts the captured values while leaving the new tab clean.
		Object.entries( editing.editingRows ).forEach( ( [ id, row ] ) =>
			row.openFields.forEach( ( key ) => editing.onApplyField( { id: Number( id ), key } ) )
		);
		stopEditing();
		setActiveFieldSet( pendingTab );
		setPendingTab( null );
	}, [ editing, stopEditing, pendingTab, setActiveFieldSet ] );

	const onDiscardAndSwitch = useCallback( () => {
		stopEditing();
		setActiveFieldSet( pendingTab );
		setPendingTab( null );
	}, [ stopEditing, pendingTab, setActiveFieldSet ] );

	const onCancelSwitch = useCallback( () => setPendingTab( null ), [] );

	return (
		<div className="yst-p-8 yst-space-y-8">
			<BulkEditorTabs
				tabs={ tabs }
				activeTab={ activeFieldSet }
				onChange={ onChangeTab }
				label={ __( "Bulk editor views", "wordpress-seo" ) }
			/>
			{ tabs.map( ( tab ) => (
				<BulkEditorTabPanel key={ tab.id } tabId={ tab.id } isActive={ tab.id === activeFieldSet }>
					<BulkEditorTable items={ items } fieldSet={ fieldSets[ tab.id ] } editing={ editing } isLoading={ isPending } />
				</BulkEditorTabPanel>
			) ) }
			<UnsavedChangesModal
				isOpen={ hasUnsavedEdits && pendingTab !== null }
				onSave={ onSaveAndSwitch }
				onDiscard={ onDiscardAndSwitch }
				onClose={ onCancelSwitch }
			/>
		</div>
	);
};
