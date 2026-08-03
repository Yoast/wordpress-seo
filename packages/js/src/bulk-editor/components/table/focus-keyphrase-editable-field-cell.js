import { useCallback, useEffect, useState } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Table, TextareaField } from "@yoast/ui-library";
import AnimateHeight from "react-animate-height";

/**
 * Focus keyphrase editable field cell.
 *
 * @param {Object}        props             The props.
 * @param {FieldSetField} props.field       The field this cell edits.
 * @param {number}        props.itemId      The item id, to keep the input id unique across rows.
 * @param {string}        props.fieldSetId  The active field set's id, scopes the input id across tabs.
 * @param {string}        props.itemTitle   The item title, for the accessible name.
 * @param {string}        props.value       The current draft value.
 * @param {boolean}       props.isSaving    Whether the row is being saved (disables the input).
 * @param {Function}      props.onChange    Called with { key, value } when the value changes.
 *
 * @returns {JSX.Element} The cell.
 */
export const FocusKeyphraseEditableFieldCell = ( { field, itemId, fieldSetId, itemTitle, value, isSaving, onChange } ) => {
	const handleChange = useCallback( ( event ) => onChange( { key: field.key, value: event.target.value } ), [ onChange, field.key ] );

	// Row expand/collapse animation helper.
	const [ height, setHeight ] = useState( 0 );
	useEffect( () => setHeight( "auto" ), [] );

	const errors = [
		value.includes( "," ) && __( "Are you trying to use multiple keyphrases? You should add them separately in the editor.", "wordpress-seo" ),
		value.length > 191 && __( "Your keyphrase is too long. It can be a maximum of 191 characters.", "wordpress-seo" ),
	].filter( Boolean );

	const warnings = [
		( /<[^>]*>/u ).test( value ) && __( "Your keyphrase contains HTML tags that will be stripped on save.", "wordpress-seo" ),
	].filter( Boolean );

	const allMessages = [ ...errors, ...warnings ];
	const validation = allMessages.length > 0
		? {
			variant: errors.length > 0 ? "error" : "warning",
			message: allMessages.map( ( msg, index ) => (
				<span key={ index } role="alert" className="yst-block">{ msg }</span>
			) ),
		}
		: null;

	return (
		<Table.Cell>
			<AnimateHeight easing="ease-out" duration={ 100 } height={ height } animateOpacity={ true }>
				<TextareaField
					id={ `bulk-editor-edit-${ itemId }-${ fieldSetId }-${ field.key }` }
					rows={ 2 }
					value={ value }
					onChange={ handleChange }
					disabled={ isSaving }
					className="yst-focuskeyphrase-field"
					/* translators: %1$s expands to the field label, %2$s to the content item title. */
					aria-label={ sprintf( __( "%1$s for %2$s", "wordpress-seo" ), field.label, itemTitle ) }
					validation={ validation }
					label={ "" }
				/>
			</AnimateHeight>
		</Table.Cell>
	);
};
