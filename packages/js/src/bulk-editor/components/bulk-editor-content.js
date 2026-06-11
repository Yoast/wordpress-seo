import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback, useMemo, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { STORE_NAME } from "../constants";
import { getFieldSets } from "../field-sets";
import { getMockRows } from "../services/mock-rows";
import { BulkEditorTable } from "./bulk-editor-table";
import { BulkEditorTabPanel, BulkEditorTabs } from "./bulk-editor-tabs";

/**
 * The endpoint key a field saves through: its own override (the focus keyphrase) or the field set's default.
 *
 * @param {import("../field-sets").FieldSetField} field    The field being saved.
 * @param {import("../field-sets").FieldSet}      fieldSet The active field set.
 *
 * @returns {string} The data-provider endpoint key.
 */
const fieldEndpointKey = ( field, fieldSet ) => field.endpoint ?? fieldSet.endpoint;

/**
 * The bulk editor content: the Search/Social appearance tab bar and the tab panels with the field-set table.
 *
 * @param {Object}                             props                    The props.
 * @param {import("../services").DataProvider} props.dataProvider       The data provider (config + endpoints).
 * @param {Object}                             props.remoteDataProvider The remote data provider (HTTP), used to save edits.
 *
 * @returns {JSX.Element} The content.
 */
export const BulkEditorContent = ( { dataProvider, remoteDataProvider } ) => {
	const fieldSets = useMemo( () => getFieldSets(), [] );
	const tabs = useMemo(
		() => Object.values( fieldSets ).map( ( { id, label } ) => ( { id, label } ) ),
		[ fieldSets ]
	);
	const activeFieldSet = useSelect( ( select ) => select( STORE_NAME ).selectActiveFieldSet(), [] );
	const editingRows = useSelect( ( select ) => select( STORE_NAME ).selectEditingRows(), [] );
	const { setActiveFieldSet, startEdit, updateDraftField, setSavingField, closeField, discardEdit, stopEdit } = useDispatch( STORE_NAME );

	// TEMPORARY fixture items until the list endpoint feeds the table through the provider; kept in state so a
	// successful save can reflect the new value locally (there is no refetch yet).
	const [ items, setItems ] = useState( getMockRows );

	// Switching tabs changes the editable fields, so any in-progress edits are discarded.
	const onChangeTab = useCallback( ( id ) => {
		stopEdit();
		setActiveFieldSet( id );
	}, [ stopEdit, setActiveFieldSet ] );

	// Edit opens the active field set's fields for a row, with the item's current values.
	const onStartEdit = useCallback( ( id ) => {
		const item = items.find( ( candidate ) => candidate.id === id );
		if ( ! item ) {
			return;
		}
		const draftValues = Object.fromEntries(
			fieldSets[ activeFieldSet ].fields.map( ( field ) => [ field.key, item[ field.key ] ?? "" ] )
		);
		startEdit( { id, draft: draftValues } );
	}, [ items, fieldSets, activeFieldSet, startEdit ] );

	// Discard closes the field; the cell falls back to the row's stored value.
	const onDiscardField = useCallback( ( { id, key } ) => closeField( { id, key } ), [ closeField ] );

	// Cancel closes every open field of a row at once (the row's Cancel action).
	const onCancelEdit = useCallback( ( id ) => discardEdit( { id } ), [ discardEdit ] );

	// Apply saves a single field; the focus keyphrase uses its own endpoint, the rest the active tab's.
	const onApplyField = useCallback( async( { id, key } ) => {
		const fieldSet = fieldSets[ activeFieldSet ];
		const field = fieldSet.fields.find( ( candidate ) => candidate.key === key );
		const rowEdit = editingRows[ id ];
		if ( ! field || ! rowEdit ) {
			return;
		}
		const endpoint = dataProvider.getEndpoint( fieldEndpointKey( field, fieldSet ) );
		if ( ! endpoint || ! remoteDataProvider ) {
			return;
		}

		const value = rowEdit.draft[ key ];
		setSavingField( { id, key } );
		try {
			await remoteDataProvider.fetchJson( endpoint, {}, {
				method: "POST",
				body: JSON.stringify( { items: [ { id, [ field.param ]: value } ] } ),
			} );
			// Success: reflect the saved value in the row (no refetch yet) and close the field.
			setItems( ( current ) => current.map( ( item ) => ( item.id === id ? { ...item, [ key ]: value } : item ) ) );
			closeField( { id, key } );
		} catch ( error ) {
			// Keep the field open so the user can retry.
			setSavingField( { id, key: null } );
		}
	}, [ fieldSets, activeFieldSet, dataProvider, remoteDataProvider, editingRows, setSavingField, closeField ] );

	const editing = useMemo( () => ( {
		editingRows,
		onStartEdit,
		onChangeField: updateDraftField,
		onApplyField,
		onDiscardField,
		onCancelEdit,
	} ), [ editingRows, onStartEdit, updateDraftField, onApplyField, onDiscardField, onCancelEdit ] );

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
					<BulkEditorTable items={ items } fieldSet={ fieldSets[ tab.id ] } editing={ editing } />
				</BulkEditorTabPanel>
			) ) }
		</div>
	);
};
