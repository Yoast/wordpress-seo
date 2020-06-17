import classnames from "classnames";
import PropTypes from "prop-types";
import { IconButton } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import URLInput from "./url-input";

/**
 * Renders the link edit form.
 *
 * @param {object}   autocompleteRef    The ref for the autocomplete.
 * @param {string}   className          The classname.
 * @param {function} onChangeInputValue The onChange callback function.
 * @param {object}   value              The value.
 * @param {object}   props              The props.
 *
 * @returns {wp.Element} the component.
 */
export default function LinkEditor( {
	autocompleteRef,
	className,
	onChangeInputValue,
	value,
	...props
} ) {
	return (
		<form
			className={ classnames(
				"block-editor-url-popover__link-editor",
				className
			) }
			{ ...props }
		>
			<URLInput
				value={ value }
				onChange={ onChangeInputValue }
				autocompleteRef={ autocompleteRef }
			/>
			<IconButton icon="editor-break" label={ __( "Apply", "wordpress-seo" ) } type="submit" />
		</form>
	);
}

LinkEditor.propTypes = {
	autocompleteRef: PropTypes.object,
	className: PropTypes.string,
	onChangeInputValue: PropTypes.func.isRequired,
	value: PropTypes.oneOfType( [
		PropTypes.string,
		PropTypes.object,
	] ).isRequired,
};

LinkEditor.defaultProps = {
	autocompleteRef: null,
	className: "",
};
