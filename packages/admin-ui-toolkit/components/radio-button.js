import { PropTypes } from "prop-types";

/**
 * The RadioButton component.
 *
 * @param {string} [className=""] The classname for the wrapper div.
 * @param {string} id The id for the label and radio button.
 * @param {string} name The name for the label and radio button.
 * @param {string} [label=""] The text for the label.
 * @param {string} value The value for the radio button.
 * @param {boolean} [checked=false] Whether the radio button should be checked by default.
 * @param {Object} onChange The function which handles the onChange event.
 *
 * @returns {JSX.Element} The radio button.
 */
export default function RadioButton( { className, id, name, label, value, onChange, checked } ) {
	return (
		<div className={ className }>
			<input
				type="radio"
				id={ id }
				name={ name }
				value={ value }
				checked={ checked }
				onChange={ onChange }
				className="focus:yst-ring-indigo-500 yst-h-4 yst-w-4 yst-text-primary-500 yst-border-gray-300 yst-mr-3"
			/>
			<label htmlFor={ id }>{ label }</label>
		</div>
	);
}

RadioButton.propTypes = {
	className: PropTypes.string,
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	label: PropTypes.string,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	checked: PropTypes.bool,
};

RadioButton.defaultProps = {
	className: "",
	label: "",
	checked: false,
};
