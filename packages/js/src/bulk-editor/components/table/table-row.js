import { Slot, __experimentalUseSlotFills as useSlotFills } from "@wordpress/components";
import { Fragment, useCallback } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Button, Checkbox, Table } from "@yoast/ui-library";
import { TABLE_CELL_FIELD_SLOT } from "../../constants";
import { EditableFieldCell, TitleCell } from "./table-cells";
import { getFieldTextClasses, getRowEditState } from "./table-helpers";

/**
 * A content row. Each field-set cell renders as plain text, or — when the row is in edit mode and the field is
 * open — as an editable cell. The Actions column then shows the row's Save and Cancel buttons.
 *
 * @param {Object}            props             The props.
 * @param {BulkEditorItem}    props.item        The item data.
 * @param {FieldSetField[]}   props.fields      The active field set's editable columns.
 * @param {string}            props.fieldSetId  The active field set's id, used to scope the per-row indicator slot.
 * @param {boolean}           props.isSelected  Whether this item is selected.
 * @param {Function}          props.onToggleRow Called with the item id when its checkbox is toggled.
 * @param {Object}            [props.edit]      This row's edit state ({ openFields, draft, savingFields }), or undefined when not editing.
 * @param {BulkEditorEditing} props.editing     The inline-edit props (its handlers).
 *
 * @returns {JSX.Element} The row.
 */
export const BulkEditorRow = ( { item, fields, fieldSetId, isSelected, onToggleRow, edit, editing } ) => {
	const { isEditing, openFields, draft, savingFields } = getRowEditState( edit );
	const { onStartEdit, onChangeField, onApplyField, onCancelEdit, onDiscardField, updateItem } = editing;
	const isSaving = Object.keys( savingFields ).length > 0;
	const fillsSeoTitles = useSlotFills( `${ TABLE_CELL_FIELD_SLOT }/seoTitle/${item.id}` );
	const fillsMetaDescription = useSlotFills( `${ TABLE_CELL_FIELD_SLOT }/metaDescription/${item.id}` );
	const fillsSocialTitle = useSlotFills( `${ TABLE_CELL_FIELD_SLOT }/socialTitle/${item.id}` );
	const fillsSocialDescription = useSlotFills( `${ TABLE_CELL_FIELD_SLOT }/socialDescription/${item.id}` );
	const isSlotFilled = [ fillsSeoTitles, fillsMetaDescription, fillsSocialTitle, fillsSocialDescription ].some( ( fills ) => fills?.length > 0 );

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
			<TitleCell item={ item } fieldSetId={ fieldSetId } />
			{ fields.map( ( field ) => {
				return (
					<Fragment key={ field.key }>
						<Slot
							name={ `${ TABLE_CELL_FIELD_SLOT }/${ field.key }/${item.id}` }
							fillProps={ {
								field,
								item,
								value: draft[ field.key ] ?? "",
								isSaving,
								onSaveField: () => onApplyField( { id: item.id, key: field.key } ),
								onDiscardField: () => onDiscardField( { id: item.id, key: field.key } ),
								// Lets a fill (Premium's applied AI suggestion) reflect a value it saved itself onto the row,
								// so the cell shows it without a refetch.
								onApplied: ( value ) => updateItem( item.id, field.key, value ),
							} }
						>
							{ ( fills ) => {
								if ( fills.length > 0 ) {
									return fills;
								}

								if ( ! openFields.includes( field.key ) ) {
									return (
										<Table.Cell key={ field.key } className={ getFieldTextClasses( field.key, false ) }>
											{ item[ field.key ] }
										</Table.Cell>
									);
								}

								return <EditableFieldCell
									field={ field }
									itemId={ item.id }
									itemTitle={ item.title }
									value={ draft[ field.key ] ?? "" }
									isSaving={ isSaving }
									onChange={ handleChangeField }
									isOpen={ isEditing }
								/>;
							} }
						</Slot>
					</Fragment>
				);
			} ) }
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
								disabled={ isSlotFilled }
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
