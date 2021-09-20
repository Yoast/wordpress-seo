import { PropTypes } from "prop-types";

/**
 * The Checkbox component.
 *
 * @param {string} [className=""] The classname for the wrapper div.
 * @param {string} id The id for the label and checkbox.
 * @param {string} name The name for the label and checkbox.
 * @param {string} [label=""] The text for the label.
 * @param {string} value The value for the checkbox.
 * @param {boolean} [checked=false] Whether the checkbox should be checked by default.
 * @param {Object} onChange The function which handles the onChange event.
 *
 * @returns {JSX.Element} The checkbox.
 */
export default function Checkbox( { className, id, name, label, value, onChange, checked } ) {
	return (
		<div className={ className }>
			<input
				type="checkbox"
				id={ id }
				name={ name }
				value={ value }
				checked={ checked }
				onChange={ onChange }
				className="focus:yst-ring-indigo-500 yst-h-4 yst-w-4 yst-text-primary-500 yst-border-gray-300 yst-mr-3 yst-rounded"
			/>
			<label htmlFor={ id }>{ label }</label>
		</div>
	);
}

Checkbox.propTypes = {
	className: PropTypes.string,
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	label: PropTypes.string,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	checked: PropTypes.bool,
};

Checkbox.defaultProps = {
	className: "",
	label: "",
	checked: false,
};
