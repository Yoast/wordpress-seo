import { ExclamationCircleIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import PropTypes from "prop-types";
import Label from "../../elements/label";
import Textarea from "../../elements/textarea";
import { useDescribedBy, useSvgAria } from "../../hooks";

/**
 * @param {string} id The ID of the input.
 * @param {function} onChange The input change handler.
 * @param {JSX.node} [label] A label.
 * @param {string} [className] The HTML class.
 * @param {JSX.node} [description] A description.
 * @param {JSX.node} [error] An error "message".
 * @param {Object} [props] Any extra properties for the Textarea.
 * @returns {JSX.Element} The textarea field.
 */
const TextareaField = ( {
	id,
	label,
	className,
	description,
	error,
	...props
} ) => {
	const { ids, describedBy } = useDescribedBy( id, { error, description } );
	const svgAriaProps = useSvgAria();

	return (
		<div className={ classNames( "yst-textarea-field", className ) }>
			{ label && <Label className="yst-textarea-field__label" htmlFor={ id }>{ label }</Label> }
			<div className="yst-relative">
				<Textarea
					id={ id }
					className={ classNames(
						"yst-textarea-field__input",
						error && "yst-textarea-field__input--error",
					) }
					aria-describedby={ describedBy }
					{ ...props }
				/>
				{ error && <div className="yst-textarea-field__error-icon">
					<ExclamationCircleIcon { ...svgAriaProps } />
				</div> }
			</div>
			{ error && <p id={ ids.error } className="yst-textarea-field__error">{ error }</p> }
			{ description && <p id={ ids.description } className="yst-textarea-field__description">{ description }</p> }
		</div>
	);
};

TextareaField.propTypes = {
	id: PropTypes.string.isRequired,
	label: PropTypes.node.isRequired,
	className: PropTypes.string,
	description: PropTypes.node,
	error: PropTypes.node,
};

TextareaField.defaultProps = {
	className: "",
	description: null,
	error: null,
};

export default TextareaField;
