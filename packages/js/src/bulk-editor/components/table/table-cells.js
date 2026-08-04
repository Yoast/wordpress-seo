import { Slot } from "@wordpress/components";
import { useCallback, useEffect, useState } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Table, Textarea } from "@yoast/ui-library";
import { TABLE_ROW_INDICATOR_SLOT } from "../../constants";
import { getStatusLabel } from "./table-helpers";
import AnimateHeight from "react-animate-height";

/**
 * The title cell (the row header).
 *
 * @param {Object}         props            The props.
 * @param {BulkEditorItem} props.item       The item data.
 * @param {string}         props.fieldSetId The active field set's id, used to scope the per-row indicator slot.
 *
 * @returns {JSX.Element} The title cell.
 */
export const TitleCell = ( { item, fieldSetId } ) => {
	const statusLabel = getStatusLabel( item.status );

	return (
		<Table.Header scope="row" className="yst-text-left !yst-text-[13px] !yst-text-slate-800">
			<div className="yst-flex yst-items-start yst-gap-1.5">
				<Slot name={ `${ TABLE_ROW_INDICATOR_SLOT }/${ fieldSetId }/${ item.id }` } fillProps={ { item, fieldSetId } }>
					{ ( fills ) => fills }
				</Slot>
				<div className="yst-flex yst-flex-col">
					{ item.editLink
						// The title links to the post's editor screen; falls back to plain text when the user can't edit it.
						? (
							<a href={ item.editLink } className="yst-bulk-editor-title-link" target="_blank" rel="noopener noreferrer">
								{ item.title }
								<span className="yst-sr-only">
									{
										/* translators: Hidden accessibility text. */
										__( "(Opens in a new browser tab)", "wordpress-seo" )
									}
								</span>
							</a>
						)
						: <span>{ item.title }</span> }
					{ statusLabel && (
						<span className="yst-mt-1 yst-font-normal yst-text-slate-500">{ `- ${ statusLabel }` }</span>
					) }
				</div>
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
export const EditableFieldCell = ( {
	as: Component = Textarea,
	field,
	itemId,
	itemTitle,
	value,
	isSaving,
	onChange,
	...props } ) => {
	const handleChange = useCallback( ( event ) => onChange( { key: field.key, value: event.target.value } ), [ onChange, field.key ] );

	// Row expand/collapse animation helper.
	const [ height, setHeight ] = useState( 0 );
	useEffect( () => setHeight( "auto" ), [] );

	return (
		<Table.Cell>
			<AnimateHeight easing="ease-out" duration={ 100 } height={ height } animateOpacity={ true }>
				<Component
					id={ `bulk-editor-edit-${ itemId }-${ field.key }` }
					className="yst-resize-none"
					{ ...props }
					rows={ 2 }
					value={ value }
					onChange={ handleChange }
					disabled={ isSaving }
					/* translators: %1$s expands to the field label, %2$s to the content item title. */
					aria-label={ sprintf( __( "%1$s for %2$s", "wordpress-seo" ), field.label, itemTitle ) }
				/>
			</AnimateHeight>
		</Table.Cell>
	);
};
