import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback, useMemo } from "@wordpress/element";
import { STORE_NAME } from "../constants";

/**
 * The endpoint key a field saves through: a field-level override when set, otherwise the field set's default.
 *
 * @param {import("../field-sets").FieldSetField} field    The field being saved.
 * @param {import("../field-sets").FieldSet}      fieldSet The active field set.
 *
 * @returns {string} The data-provider endpoint key.
 */
const fieldEndpointKey = ( field, fieldSet ) => field.endpoint ?? fieldSet.endpoint;

/**
 * The bulk editor's inline editing: per-row, per-field edit state and the save.
 *
 * @param {Object}                             props                    The props.
 * @param {import("../services").DataProvider} props.dataProvider       The data provider (config + endpoints).
 * @param {Object}                             props.remoteDataProvider The remote data provider (HTTP), used to save edits.
 * @param {Object<string, import("../field-sets").FieldSet>} props.fieldSets The field sets, keyed by id.
 * @param {string}                             props.activeFieldSet     The active field set's id.
 * @param {import("../field-sets").BulkEditorItem[]} props.items         The rows being edited (from the posts endpoint).
 * @param {Function}                           props.updateItem         Reflects a saved field on its row locally.
 *
 * @returns {{editing: Object, stopEditing: Function}} The editing props and the reset.
 */
export const useInlineEdit = ( { dataProvider, remoteDataProvider, fieldSets, activeFieldSet, items, updateItem } ) => {
	const editingRows = useSelect( ( select ) => select( STORE_NAME ).selectEditingRows(), [] );
	const { startEdit, updateDraftField, setSavingField, closeField, discardEdit, stopEdit } = useDispatch( STORE_NAME );

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

	const onDiscardField = useCallback( ( { id, key } ) => closeField( { id, key } ), [ closeField ] );

	const onCancelEdit = useCallback( ( id ) => discardEdit( { id } ), [ discardEdit ] );

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
		setSavingField( { id, key, isSaving: true } );
		try {
			await remoteDataProvider.fetchJson( endpoint, {}, {
				method: "POST",
				body: JSON.stringify( { items: [ { id, [ field.param ]: value } ] } ),
			} );
			updateItem( id, key, value );
			closeField( { id, key } );
		} catch ( error ) {
			setSavingField( { id, key, isSaving: false } );
		}
	}, [ fieldSets, activeFieldSet, dataProvider, remoteDataProvider, editingRows, setSavingField, closeField, updateItem ] );

	const editing = useMemo( () => ( {
		editingRows,
		onStartEdit,
		onChangeField: updateDraftField,
		onApplyField,
		onDiscardField,
		onCancelEdit,
	} ), [ editingRows, onStartEdit, updateDraftField, onApplyField, onDiscardField, onCancelEdit ] );

	return { editing, stopEditing: stopEdit };
};
