import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback, useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { noop } from "lodash";
import { STORE_NAME } from "../constants";
import { getFieldSets } from "../field-sets";
import { getMockRows } from "../services/mock-rows";
import { BulkEditorTable } from "./bulk-editor-table";
import { BulkEditorTabPanel, BulkEditorTabs } from "./bulk-editor-tabs";

/**
 * The bulk editor content: the Search/Social appearance tab bar and the tab panels with the field-set table.
 *
 * @returns {JSX.Element} The content.
 */
export const BulkEditorContent = () => {
	const fieldSets = useMemo( () => getFieldSets(), [] );
	const tabs = useMemo(
		() => Object.values( fieldSets ).map( ( { id, label } ) => ( { id, label } ) ),
		[ fieldSets ]
	);
	const activeFieldSet = useSelect( ( select ) => select( STORE_NAME ).selectActiveFieldSet(), [] );
	const editingRows = useSelect( ( select ) => select( STORE_NAME ).selectEditingRows(), [] );
	const { setActiveFieldSet, startEdit, updateDraftField, closeField, stopEdit } = useDispatch( STORE_NAME );

	// TEMPORARY fixture rows until the list endpoint feeds the table through the provider.
	const rows = useMemo( () => getMockRows(), [] );

	// Switching tabs changes the editable fields, so any in-progress edits are discarded.
	const onChangeTab = useCallback( ( id ) => {
		stopEdit();
		setActiveFieldSet( id );
	}, [ stopEdit, setActiveFieldSet ] );

	// Edit opens the active field set's fields for a row.
	const onStartEdit = useCallback( ( id ) => {
		const row = rows.find( ( candidate ) => candidate.id === id );
		if ( ! row ) {
			return;
		}
		const draftValues = Object.fromEntries(
			fieldSets[ activeFieldSet ].fields.map( ( field ) => [ field.key, row[ field.key ] ?? "" ] )
		);
		startEdit( { id, draft: draftValues } );
	}, [ rows, fieldSets, activeFieldSet, startEdit ] );

	// Discard closes the field; the cell falls back to the row's stored value.
	const onDiscardField = useCallback( ( { id, key } ) => closeField( { id, key } ), [ closeField ] );

	const editing = useMemo( () => ( {
		editingRows,
		onStartEdit,
		onChangeField: updateDraftField,
		// Saving a field is wired in the next step (the save hook); the controls render already.
		onApplyField: noop,
		onDiscardField,
	} ), [ editingRows, onStartEdit, updateDraftField, onDiscardField ] );

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
					<BulkEditorTable rows={ rows } fieldSet={ fieldSets[ tab.id ] } editing={ editing } />
				</BulkEditorTabPanel>
			) ) }
		</div>
	);
};
