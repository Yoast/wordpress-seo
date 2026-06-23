import { useCallback } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Button, Checkbox, Table } from "@yoast/ui-library";
import { EditableFieldCell, TitleCell } from "./table-cells";
import { getRowEditState } from "./table-helpers";

/**
 * A content row. Each field-set cell renders as plain text, or — when the row is in edit mode and the field is
 * open — as an editable cell. The Actions column then shows the row's Save and Cancel buttons.
 *
 * @param {Object}            props             The props.
 * @param {BulkEditorItem}    props.item        The item data.
 * @param {FieldSetField[]}   props.fields      The active field set's editable columns.
 * @param {boolean}           props.isSelected  Whether this item is selected.
 * @param {Function}          props.onToggleRow Called with the item id when its checkbox is toggled.
 * @param {Object}            [props.edit]      This row's edit state ({ openFields, draft, savingFields }), or undefined when not editing.
 * @param {BulkEditorEditing} props.editing     The inline-edit props (its handlers).
 *
 * @returns {JSX.Element} The row.
 */
export const BulkEditorRow = ( { item, fields, isSelected, onToggleRow, edit, editing } ) => {
	const { isEditing, openFields, draft, savingFields } = getRowEditState( edit );
	const { onStartEdit, onChangeField, onApplyField, onCancelEdit } = editing;
	const isSaving = Object.keys( savingFields ).length > 0;

	const handleToggle = useCallback( () => onToggleRow( item.id ), [ onToggleRow, item.id ] );
	const handleEdit = useCallback( () => onStartEdit( item.id ), [ onStartEdit, item.id ] );
	const handleCancel = useCallback( () => onCancelEdit( item.id ), [ onCancelEdit, item.id ] );
	const handleChangeField = useCallback( ( { key, value } ) => onChangeField( { id: item.id, key, value } ), [ onChangeField, item.id ] );
	const handleSave = useCallback(
		() => openFields.forEach( ( key ) => onApplyField( { id: item.id, key } ) ),
		[ openFields, onApplyField, item.id ]
	);

	/* translators: %s expands to the content item title. */
	const editLabel = sprintf( __( "Edit %s", "wordpress-seo" ), item.title );
	/* translators: %s expands to the content item title. */
	const saveLabel = sprintf( __( "Save %s", "wordpress-seo" ), item.title );
	/* translators: %s expands to the content item title. */
	const cancelLabel = sprintf( __( "Cancel editing %s", "wordpress-seo" ), item.title );

	return (
		<Table.Row>
			<Table.Cell>
				<Checkbox
					id={ `bulk-editor-select-${ item.id }` }
					name={ `bulk-editor-select-${ item.id }` }
					value={ String( item.id ) }
					className="yst-mt-0.5"
					/* translators: %s expands to the content item title. */
					aria-label={ sprintf( __( "Select %s", "wordpress-seo" ), item.title ) }
					checked={ isSelected }
					onChange={ handleToggle }
				/>
			</Table.Cell>
			<TitleCell item={ item } />
			{ fields.map( ( field ) => ( openFields.includes( field.key )
				? (
					<EditableFieldCell
						key={ field.key }
						field={ field }
						itemId={ item.id }
						itemTitle={ item.title }
						value={ draft[ field.key ] ?? "" }
						isSaving={ isSaving }
						onChange={ handleChangeField }
						isOpen={ isEditing }
					/>
				)
				: <Table.Cell key={ field.key }>{ item[ field.key ] }</Table.Cell>
			) ) }
			<Table.Cell>
				{ isEditing
					? (
						<span className="yst-flex yst-flex-col yst-items-end yst-gap-1.5 yst--me-2.5">
							<Button
								variant="tertiary"
								size="small"
								onClick={ handleSave }
								disabled={ isSaving }
								aria-label={ saveLabel }
							>
								{ __( "Save", "wordpress-seo" ) }
							</Button>
							<span aria-hidden="true" className="yst-w-full yst-border-t yst-border-slate-200" />
							<Button
								variant="tertiary"
								size="small"
								onClick={ handleCancel }
								disabled={ isSaving }
								aria-label={ cancelLabel }
							>
								{ __( "Cancel", "wordpress-seo" ) }
							</Button>
						</span>
					)
					: (
						<span className="yst-flex yst-justify-end">
							<Button
								variant="tertiary"
								size="small"
								className="yst--me-2.5"
								onClick={ handleEdit }
								aria-label={ editLabel }
							>
								{ __( "Edit", "wordpress-seo" ) }
							</Button>
						</span>
					)
				}
			</Table.Cell>
		</Table.Row>
	);
};
