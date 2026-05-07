import { TextField } from "@yoast/ui-library";
import PropTypes from "prop-types";

/**
 * Renders the synonym input field using the ui-library TextField.
 *
 * Props that are not consumed by this component are forwarded to the underlying TextField.
 *
 * @param {Object} props The component props.
 * @param {string} props.id The id of the input.
 * @param {string} props.label The label of the input.
 * @param {string} [props.description=""] The description of the input.
 * @param {Function} props.onChange The change handler. Receives the raw change event.
 *
 * @returns {JSX.Element} The synonyms input field.
 */
const SynonymsInputField = ( { id, label, description = "", onChange, ...inputProps } ) => (
	<div className="yst-root">
		<TextField
			id={ id }
			label={ label }
			onChange={ onChange }
			autoComplete="off"
			description={ description }
			{ ...inputProps }
		/>
	</div>
);

SynonymsInputField.propTypes = {
	id: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	description: PropTypes.string,
};

export default SynonymsInputField;
