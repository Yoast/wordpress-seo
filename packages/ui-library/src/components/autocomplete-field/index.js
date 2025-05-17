import classNames from "classnames";
import PropTypes from "prop-types";
import React, { forwardRef } from "react";
import Autocomplete from "../../elements/autocomplete";
import { ValidationMessage } from "../../elements/validation";
import { useDescribedBy } from "../../hooks";

/**
 * @param {string} id Identifier.
 * @param {Object} validation The validation state.
 * @param {string} [className] Optional CSS class.
 * @param {string} label Label.
 * @param {Boolean} [disabled] Disabled state.
 * @param {JSX.node} [description] Optional description.
 * @param {Object} [props] Any extra props.
 * @returns {JSX.Element} AutocompleteField component.
 */
const AutocompleteField = forwardRef( ( {
	id,
	label,
	disabled,
	description,
	validation,
	className,
	...props
}, ref ) => {
	const { ids, describedBy } = useDescribedBy( id, { validation: validation?.message, description } );

	return (
		<div className={ classNames( "yst-autocomplete-field", disabled && "yst-autocomplete-field--disabled", className ) }>
			<Autocomplete
				ref={ ref }
				id={ id }
				label={ label }
				labelProps={ {
					as: "label",
					className: "yst-label yst-autocomplete-field__label",
				} }
				validation={ validation }
				className="yst-autocomplete-field__select"
				buttonProps={ { "aria-describedby": describedBy } }
				disabled={ disabled }
				{ ...props }
			/>
			{ validation?.message && (
				<ValidationMessage
					variant={ validation?.variant }
					id={ ids.validation }
					className="yst-autocomplete-field__validation"
				>{ validation.message }</ValidationMessage>
			) }
			{ description && <div id={ ids.description } className="yst-autocomplete-field__description">{ description }</div> }
		</div>
	);
} );

AutocompleteField.displayName = "AutocompleteField";
AutocompleteField.propTypes = {
	id: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	disabled: PropTypes.bool,
	description: PropTypes.node,
	validation: PropTypes.shape( {
		variant: PropTypes.string,
		message: PropTypes.node,
	} ),
	className: PropTypes.string,
};
AutocompleteField.defaultProps = {
	disabled: false,
	description: null,
	validation: {},
	className: "",
};

AutocompleteField.Option = Autocomplete.Option;

AutocompleteField.Option.displayName = "AutocompleteField.Option";

export default AutocompleteField;
