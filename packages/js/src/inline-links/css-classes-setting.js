import { CheckboxControl, __experimentalInputControl as InputControl, __experimentalVStack as VStack } from "@wordpress/components";
import { useInstanceId } from "@wordpress/compose";
import { useEffect, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

/**
 * Sanitizes CSS class input by replacing commas with spaces and collapsing whitespace.
 *
 * @param {string} input The raw input string.
 * @returns {string} The sanitized CSS class string.
 */
const sanitizeCSSClasses = ( input ) => {
	return input
		.replace( /,/g, " " )
		.replace( /\s+/g, " " );
};

/**
 * Component for editing additional CSS classes on a link.
 *
 * Renders a checkbox that toggles visibility of a text input for entering
 * space-separated CSS class names.
 *
 * @param {Object}   props          Component props.
 * @param {Object}   props.value    The current link value containing cssClasses.
 * @param {Function} props.onChange Callback when CSS classes change.
 *
 * @returns {React.ReactNode} The CSS classes setting UI.
 */
export default function CSSClassesSetting( { value, onChange } ) {
	const [ isExpanded, setIsExpanded ] = useState( Boolean( value?.cssClasses ) );
	const instanceId = useInstanceId( CSSClassesSetting, "css-classes-setting" );
	const inputId = `${ instanceId }-input`;

	// Sync expanded state when value changes externally (e.g. undo/redo, selecting a different link).
	useEffect( () => {
		setIsExpanded( Boolean( value?.cssClasses ) );
	}, [ value?.cssClasses ] );

	const handleCheckboxChange = ( checked ) => {
		setIsExpanded( checked );
		if ( ! checked ) {
			onChange( { ...value, cssClasses: "" } );
		}
	};

	const handleInputChange = ( nextValue ) => {
		const sanitized = sanitizeCSSClasses( nextValue ?? "" );
		onChange( { ...value, cssClasses: sanitized } );
	};

	const handleInputBlur = () => {
		const trimmed = ( value?.cssClasses ?? "" ).trim();
		if ( trimmed !== value?.cssClasses ) {
			onChange( { ...value, cssClasses: trimmed } );
		}
	};

	return (
		<VStack spacing="2">
			<CheckboxControl
				__nextHasNoMarginBottom={ true }
				label={ __( "Additional CSS class(es)", "wordpress-seo" ) }
				checked={ isExpanded }
				// eslint-disable-next-line react/jsx-no-bind
				onChange={ handleCheckboxChange }
			/>
			{ isExpanded && (
				<InputControl
					__next40pxDefaultSize={ true }
					id={ inputId }
					label={ __( "Additional CSS class(es)", "wordpress-seo" ) }
					hideLabelFromVision={ true }
					value={ value?.cssClasses ?? "" }
					// eslint-disable-next-line react/jsx-no-bind
					onChange={ handleInputChange }
					// eslint-disable-next-line react/jsx-no-bind
					onBlur={ handleInputBlur }
					placeholder={ __( "Separate multiple classes with spaces", "wordpress-seo" ) }
					help={ __( "Separate multiple classes with spaces.", "wordpress-seo" ) }
				/>
			) }
		</VStack>
	);
}
