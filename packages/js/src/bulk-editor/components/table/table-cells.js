import CheckIcon from "@heroicons/react/outline/CheckIcon";
import XIcon from "@heroicons/react/outline/XIcon";
import { useCallback } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Button, Table, Textarea } from "@yoast/ui-library";
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
 * An open field cell: the input plus its Apply and Discard actions. Each field is saved or discarded on its own.
 *
 * @param {Object}        props           The props.
 * @param {FieldSetField} props.field     The field this cell edits.
 * @param {number}        props.itemId    The item id, to keep the input id unique across rows.
 * @param {string}        props.itemTitle The item title, for the accessible names.
 * @param {string}        props.value     The current draft value.
 * @param {boolean}       props.isSaving  Whether this field is being saved (disables the controls).
 * @param {Function}      props.onChange  Called with { key, value } when the value changes.
 * @param {Function}      props.onApply   Called with the field key to save it.
 * @param {Function}      props.onDiscard Called with the field key to discard its changes.
 *
 * @returns {JSX.Element} The cell.
 */
export const EditableFieldCell = ( { field, itemId, itemTitle, value, isSaving, onChange, onApply, onDiscard } ) => {
	const handleChange = useCallback( ( event ) => onChange( { key: field.key, value: event.target.value } ), [ onChange, field.key ] );
	const handleApply = useCallback( () => onApply( field.key ), [ onApply, field.key ] );
	const handleDiscard = useCallback( () => onDiscard( field.key ), [ onDiscard, field.key ] );

	return (
		<Table.Cell>
			<div className="yst-flex yst-flex-col yst-gap-2">
				{ /* Two lines so the full value is visible without a scrollbar, per the design. */ }
				<Textarea
					id={ `bulk-editor-edit-${ itemId }-${ field.key }` }
					rows={ 2 }
					value={ value }
					onChange={ handleChange }
					disabled={ isSaving }
					className="yst-resize-none"
					/* translators: %1$s expands to the field label, %2$s to the content item title. */
					aria-label={ sprintf( __( "%1$s for %2$s", "wordpress-seo" ), field.label, itemTitle ) }
				/>
				<div className="yst-flex yst-gap-2">
					<Button
						variant="secondary"
						size="small"
						onClick={ handleApply }
						disabled={ isSaving }
						/* translators: %1$s expands to the field label, %2$s to the content item title. */
						aria-label={ sprintf( __( "Apply %1$s for %2$s", "wordpress-seo" ), field.label, itemTitle ) }
					>
						<CheckIcon className="yst-h-4 yst-w-4 yst-text-green-500" aria-hidden="true" />
						{ __( "Apply", "wordpress-seo" ) }
					</Button>
					<Button
						variant="secondary"
						size="small"
						onClick={ handleDiscard }
						disabled={ isSaving }
						/* translators: %1$s expands to the field label, %2$s to the content item title. */
						aria-label={ sprintf( __( "Discard %1$s for %2$s", "wordpress-seo" ), field.label, itemTitle ) }
					>
						<XIcon className="yst-h-4 yst-w-4 yst-text-red-500" aria-hidden="true" />
						{ __( "Discard", "wordpress-seo" ) }
					</Button>
				</div>
			</div>
		</Table.Cell>
	);
};
