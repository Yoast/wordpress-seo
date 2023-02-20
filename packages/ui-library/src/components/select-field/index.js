import classNames from "classnames";
import PropTypes from "prop-types";
import Select from "../../elements/select";
import { ValidationMessage } from "../../elements/validation";
import { useDescribedBy } from "../../hooks";
import { forwardRef } from "@wordpress/element";
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
const SelectField = forwardRef( ( {
	id,
	label,
	description,
	disabled,
	validation,
	className,
	...props
}, ref ) => {
	const { ids, describedBy } = useDescribedBy( id, { validation: validation?.message, description } );

	return (
		<div className={ classNames( "yst-select-field", disabled && "yst-select-field--disabled", className ) }>
			<Select
				ref={ ref }
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
} );

const propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	description: PropTypes.node,
	disabled: PropTypes.bool,
	validation: PropTypes.shape( {
		variant: PropTypes.string,
		message: PropTypes.node,
	} ),
	className: PropTypes.string,
};

SelectField.propTypes = propTypes;

SelectField.Option = Select.Option;
SelectField.Option.displayName = "SelectField.Option";

SelectField.defaultProps = {
	disabled: false,
	validation: {},
	className: "",
};

// eslint-disable-next-line require-jsdoc
export const StoryComponent = props => <SelectField { ...props } />;
StoryComponent.propTypes = propTypes;
StoryComponent.defaultProps = SelectField.defaultProps;
StoryComponent.displayName = "SelectField";

export default SelectField;
