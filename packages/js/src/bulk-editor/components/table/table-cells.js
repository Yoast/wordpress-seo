import { useCallback } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Table, Textarea } from "@yoast/ui-library";
import { getStatusLabel } from "./table-helpers";

/**
 * The title cell (the row header).
 *
 * @param {Object}         props      The props.
 * @param {BulkEditorItem} props.item The item data.
 *
 * @returns {JSX.Element} The title cell.
 */
export const TitleCell = ( { item } ) => {
	const statusLabel = getStatusLabel( item.status );

	return (
		<Table.Header scope="row" className="yst-text-left">
			<div className="yst-flex yst-flex-col">
				<span>{ item.title }</span>
				{ statusLabel && (
					<span className="yst-mt-1 yst-font-normal yst-text-slate-500">{ `- ${ statusLabel }` }</span>
				) }
			</div>
		</Table.Header>
	);
};

/**
 * An open field cell: an editable textarea. The row's Save and Cancel actions save or
 * discard all of the row's open fields at once.
 *
 * @param {Object}        props           The props.
 * @param {FieldSetField} props.field     The field this cell edits.
 * @param {number}        props.itemId    The item id, to keep the input id unique across rows.
 * @param {string}        props.itemTitle The item title, for the accessible name.
 * @param {string}        props.value     The current draft value.
 * @param {boolean}       props.isSaving  Whether the row is being saved (disables the input).
 * @param {Function}      props.onChange  Called with { key, value } when the value changes.
 *
 * @returns {JSX.Element} The cell.
 */
export const EditableFieldCell = ( { field, itemId, itemTitle, value, isSaving, onChange } ) => {
	const handleChange = useCallback( ( event ) => onChange( { key: field.key, value: event.target.value } ), [ onChange, field.key ] );

	return (
		<Table.Cell>
			<Textarea
				id={ `bulk-editor-edit-${ itemId }-${ field.key }` }
				rows={ 2 }
				value={ value }
				onChange={ handleChange }
				disabled={ isSaving }
				className="yst-resize-none yst-bg-primary-50 yst-ring-primary-300"
				/* translators: %1$s expands to the field label, %2$s to the content item title. */
				aria-label={ sprintf( __( "%1$s for %2$s", "wordpress-seo" ), field.label, itemTitle ) }
			/>
		</Table.Cell>
	);
};
