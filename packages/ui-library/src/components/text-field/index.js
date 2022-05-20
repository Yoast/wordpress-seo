import { ExclamationCircleIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import PropTypes from "prop-types";
import Label from "../../elements/label";
import TextInput from "../../elements/text-input";
import { useDescribedBy, useSvgAria } from "../../hooks";

/**
 * @param {string} id The ID of the input.
 * @param {function} onChange The input change handler.
 * @param {string} label The label.
 * @param {string} [className] The HTML class.
 * @param {JSX.node} [description] A description.
 * @param {JSX.node} [error] An error "message".
 * @param {Object} [props] Any extra properties for the TextInput.
 * @returns {JSX.Element} The input field.
 */
const TextField = ( {
	id,
	onChange,
	label,
	className,
	description,
	error,
	...props
} ) => {
	const { ids, describedBy } = useDescribedBy( id, { error, description } );
	const svgAriaProps = useSvgAria();

	return (
		<div className={ classNames( "yst-text-field", className ) }>
			<Label className="yst-text-field__label" htmlFor={ id } label={ label } />
			<div className="yst-relative">
				<TextInput
					id={ id }
					onChange={ onChange }
					className={ classNames(
						"yst-text-field__input",
						error && "yst-text-field__input--error",
					) }
					aria-describedby={ describedBy }
					{ ...props }
				/>
				{ error && <div className="yst-text-field__error-icon">
					<ExclamationCircleIcon { ...svgAriaProps } />
				</div> }
			</div>
			{ error && <p id={ ids.error } className="yst-text-field__error">{ error }</p> }
			{ description && <p id={ ids.description } className="yst-text-field__description">{ description }</p> }
		</div>
	);
};

TextField.propTypes = {
	id: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	label: PropTypes.string.isRequired,
	className: PropTypes.string,
	description: PropTypes.node,
	error: PropTypes.node,
};

TextField.defaultProps = {
	className: "",
	description: null,
	error: null,
};

export default TextField;
