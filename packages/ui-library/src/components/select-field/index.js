import classNames from "classnames";
import PropTypes from "prop-types";
import Select from "../../elements/select";
import { useDescribedBy } from "../../hooks";

/**
 * @param {string} id Identifier.
 * @param {JSX.Element} error Error node.
 * @param {string} [className] Optional CSS class.
 * @param {string} label Label.
 * @param {JSX.node} [description] Optional description.
 * @param {Object} [props] Any extra props.
 * @returns {JSX.Element} SelectField component.
 */
const SelectField = ( {
	id,
	label,
	description,
	error = null,
	className = "",
	...props
} ) => {
	const { ids, describedBy } = useDescribedBy( id, { error, description } );

	return (
		<div className={ classNames( "yst-select-field", className ) }>
			<Select
				id={ id }
				label={ label }
				labelProps={ {
					as: "label",
					className: "yst-label yst-select-field__label",
				} }
				isError={ Boolean( error ) }
				className="yst-select-field__select"
				buttonProps={ { "aria-describedby": describedBy } }
				{ ...props }
			/>
			{ error && <p id={ ids.error } className="yst-select-field__error">{ error }</p> }
			{ description && <div id={ ids.description } className="yst-select-field__description">{ description }</div> }
		</div>
	);
};

SelectField.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	description: PropTypes.node,
	error: PropTypes.node,
	className: PropTypes.string,
};

SelectField.Option = Select.Option;

export default SelectField;
