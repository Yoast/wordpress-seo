import { SearchIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import { PropTypes } from "prop-types";

/**
 * Search input component.
 *
 * @param {string} [className=""] The classname for the wrapper div.
 * @param {string} id The ID for the input field.
 * @param {string} value The value for the input field.
 * @param {string} [placeholder=""] The placeholder for the input field.
 * @param {Object} onChange The function which handles the onChange event.
 * @param {string} label The label associated with the input field.
 *
 * @returns {JSX.Element} The search input.
 */
export default function SearchInput( { id, className, value, onChange, placeholder, label } ) {
	return (
		<div>
			<label htmlFor={ id } className="yst-block yst-mb-2">{ label }</label>
			<div className={ classNames( "yst-relative", className ) }>
				<div className="yst-pointer-events-none yst-absolute yst-inset-y-0 yst-left-0 yst-pl-3 yst-flex yst-items-center">
					<SearchIcon className="yst-flex-shrink-0 yst-w-5 yst-h-5 yst-text-gray-400" />
				</div>
				<input
					id={ id }
					type="search"
					value={ value }
					className="yst-input yst-w-full yst-pl-10 yst-text-gray-700 yst-border-gray-300"
					onChange={ onChange }
					placeholder={ placeholder }
				/>
			</div>
		</div>
	);
}

SearchInput.propTypes = {
	id: PropTypes.string.isRequired,
	className: PropTypes.string,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	placeholder: PropTypes.string,
	label: PropTypes.string.isRequired,
};

SearchInput.defaultProps = {
	className: "",
	placeholder: "",
};
