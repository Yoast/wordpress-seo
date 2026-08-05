import { __ } from "@wordpress/i18n";
import { TextareaField } from "@yoast/ui-library";
import { EditableFieldCell } from "./table-cells";

/**
 * Focus keyphrase editable field cell.
 *
 * @param {Object}        props             The props.
 * @param {string}        props.value       The current draft value.
 *
 * @returns {JSX.Element} The cell.
 */
export const FocusKeyphraseEditableFieldCell = ( { value, ...props } ) => {
	const errors = [
		value.includes( "," ) && __( "Are you trying to use multiple keyphrases? You should add them separately in the editor.", "wordpress-seo" ),
	].filter( Boolean );

	const warnings = [
		( /<[^>]*>/u ).test( value ) && __( "Your keyphrase contains HTML tags that will be stripped on save.", "wordpress-seo" ),
		value.length === 191 && __( "Your keyphrase can be a maximum of 191 characters.", "wordpress-seo" ),
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
		<EditableFieldCell
			as={ TextareaField }
			{ ...props }
			value={ value }
			validation={ validation }
			className="yst-bulk-editor-textarea-field"
			maxLength={ 191 }
		/>
	);
};
