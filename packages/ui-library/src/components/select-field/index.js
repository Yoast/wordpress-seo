import classNames from "classnames";
import PropTypes from "prop-types";
import Select from "../../elements/select";
import { ValidationMessage, validationPropType } from "../../elements/validation";
import { useDescribedBy } from "../../hooks";

/**
 * @param {string} id Identifier.
 * @param {JSX.Element} error Error node.
 * @param {string} [className] Optional CSS class.
 * @param {boolean} [disabled] Disabled state.
 * @param {string} label Label.
 * @param {JSX.node} [description] Optional description.
 * @param {Object} [props] Any extra props.
 * @returns {JSX.Element} SelectField component.
 */
const SelectField = ( {
	id,
	label,
	description,
	disabled = false,
	validation = {},
	className = "",
	...props
} ) => {
	const { ids, describedBy } = useDescribedBy( id, { validation: validation?.message, description } );

	return (
		<div className={ classNames( "yst-select-field", disabled && "yst-select-field--disabled", className ) }>
			<Select
				id={ id }
				label={ label }
				labelProps={ {
					as: "label",
					className: "yst-label yst-select-field__label",
				} }
				disabled={ disabled }
				validation={ validation }
				className="yst-select-field__select"
				buttonProps={ { "aria-describedby": describedBy } }
				{ ...props }
			/>
			{ validation?.message && (
				<ValidationMessage variant={ validation?.variant } id={ ids.validation } className="yst-select-field__validation">
					{ validation.message }
				</ValidationMessage>
			) }
			{ description && <div id={ ids.description } className="yst-select-field__description">{ description }</div> }
		</div>
	);
};

SelectField.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	description: PropTypes.node,
	disabled: PropTypes.bool,
	validation: validationPropType,
	className: PropTypes.string,
};

SelectField.Option = Select.Option;

export default SelectField;
