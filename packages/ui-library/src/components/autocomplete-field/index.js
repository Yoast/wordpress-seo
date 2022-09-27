import classNames from "classnames";
import PropTypes from "prop-types";
import Autocomplete from "../../elements/autocomplete";
import { useDescribedBy } from "../../hooks";

/**
 * @param {string} id Identifier.
 * @param {JSX.Element} error Error node.
 * @param {string} [className] Optional CSS class.
 * @param {string} label Label.
 * @param {JSX.node} [description] Optional description.
 * @param {Object} [props] Any extra props.
 * @returns {JSX.Element} AutocompleteField component.
 */
const AutocompleteField = ( {
	id,
	label,
	description,
	error = null,
	className = "",
	...props
} ) => {
	const { ids, describedBy } = useDescribedBy( id, { error, description } );

	return (
		<div className={ classNames( "yst-autocomplete-field", className ) }>
			<Autocomplete
				id={ id }
				label={ label }
				labelProps={ {
					as: "label",
					className: "yst-label yst-autocomplete-field__label",
				} }
				isError={ Boolean( error ) }
				className="yst-autocomplete-field__select"
				buttonProps={ { "aria-describedby": describedBy } }
				{ ...props }
			/>
			{ error && <p id={ ids.error } className="yst-autocomplete-field__error">{ error }</p> }
			{ description && <div id={ ids.description } className="yst-autocomplete-field__description">{ description }</div> }
		</div>
	);
};

AutocompleteField.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	description: PropTypes.node,
	error: PropTypes.node,
	className: PropTypes.string,
};

AutocompleteField.Option = Autocomplete.Option;

export default AutocompleteField;
