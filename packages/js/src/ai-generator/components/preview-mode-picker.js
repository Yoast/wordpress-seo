import { useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { RadioGroup } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { PREVIEW_MODE } from "../constants";

/**
 * @param {string} idSuffix Suffix for the IDs, to make them unique.
 * @param {string} mode Either mobile or desktop.
 * @param {function} onChange Callback that gets the requested mode.
 * @param {boolean} disabled Whether the picker is disabled.
 * @returns {JSX.Element} The element.
 */
export const PreviewModePicker = ( { idSuffix, mode, onChange, disabled } ) => {
	const handleChange = useCallback( ( { target } ) => target.checked && onChange( target.value ), [ onChange ] );

	return (
		<RadioGroup id={ `yst-ai-mode__${ idSuffix }` } className="yst-ai-mode yst-pt-2 lg:yst-pt-0" disabled={ disabled }>
			<RadioGroup.Radio
				id={ `yst-ai-mode__mobile__${ idSuffix }` }
				name={ `yst-ai-mode__${ idSuffix }` }
				label={ __( "Mobile result", "wordpress-seo" ) }
				value={ PREVIEW_MODE.mobile }
				checked={ mode === PREVIEW_MODE.mobile }
				onChange={ handleChange }
				disabled={ disabled }
			/>
			<RadioGroup.Radio
				id={ `yst-ai-mode__desktop__${ idSuffix }` }
				name={ `yst-ai-mode__${ idSuffix }` }
				label={ __( "Desktop result", "wordpress-seo" ) }
				value={ PREVIEW_MODE.desktop }
				checked={ mode === PREVIEW_MODE.desktop }
				onChange={ handleChange }
				disabled={ disabled }
			/>
		</RadioGroup>
	);
};
PreviewModePicker.propTypes = {
	idSuffix: PropTypes.string.isRequired,
	mode: PropTypes.oneOf( Object.keys( PREVIEW_MODE ) ).isRequired,
	onChange: PropTypes.func.isRequired,
	disabled: PropTypes.bool.isRequired,
};
