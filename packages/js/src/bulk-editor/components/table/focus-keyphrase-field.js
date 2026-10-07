import { __ } from "@wordpress/i18n";
import { TextareaField } from "@yoast/ui-library";

/**
 * Focus keyphrase editable field cell.
 *
 * @param {Object}        props             The props.
 * @param {string}        props.value       The current draft value.
 *
 * @returns {JSX.Element} The cell.
 */
export const FocusKeyphraseField = ( { value, ...props } ) => {
	const warnings = [
		( /<[^>]*>/u ).test( value ) && __( "Your keyphrase contains HTML tags that will be stripped on save.", "wordpress-seo" ),
		value.length === 191 && __( "You reached the maximum limit of 191 characters.", "wordpress-seo" ),
		value.includes( "," ) && __( "Are you trying to use multiple keyphrases? You should add them separately in the editor.", "wordpress-seo" ),
	].filter( Boolean );

	const validation = warnings.length > 0
		? {
			variant: "warning",
			message: warnings.map( ( msg, index ) => (
				<span key={ index } className="yst-block">{ msg }</span>
			) ),
		}
		: null;

	return (
		<TextareaField
			className="yst-bulk-editor-textarea-field"
			validation={ validation }
			maxLength={ 191 }
			rows={ 2 }
			{ ...props }
			value={ value }
		/>
	);
};
