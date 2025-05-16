import { useCallback } from "@wordpress/element";
import { RadioGroup } from "@yoast/ui-library";
import classNames from "classnames";
import PropTypes from "prop-types";

const suggestionShape = PropTypes.shape( {
	value: PropTypes.string.isRequired,
	label: PropTypes.node.isRequired,
} );

/**
 * @param {string} id The ID.
 * @param {string} name The name.
 * @param {{value: string, label: JSX.node}} suggestion The suggestion.
 * @param {boolean} isChecked Whether the suggestion is checked.
 * @param {function} onChange The change callback.
 * @returns {JSX.Element} The element.
 */
const Suggestion = ( { id, name, suggestion, isChecked, onChange } ) => {
	const handleChange = useCallback( () => onChange( suggestion.value ), [ suggestion, onChange ] );

	return (
		<label
			htmlFor={ id }
			className={ classNames(
				"yst-flex yst-p-4 yst-items-center yst-border first:yst-rounded-t-md last:yst-rounded-b-md",
				isChecked && "yst-z-10 yst-border-primary-500"
			) }
		>
			<input
				type="radio"
				id={ id }
				name={ name }
				className="yst-radio__input"
				value={ suggestion.value }
				checked={ isChecked }
				onChange={ handleChange }
			/>
			<div
				className={ classNames(
					"yst-label yst-radio__label yst-flex yst-flex-wrap yst-items-center",
					! isChecked && "yst-text-slate-600"
				) }
			>
				{ suggestion.label }
			</div>
		</label>
	);
};
Suggestion.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	suggestion: suggestionShape.isRequired,
	isChecked: PropTypes.bool.isRequired,
	onChange: PropTypes.func.isRequired,
};

/**
 * @param {string} idSuffix Suffix for the IDs, to make them unique.
 * @param {{value: string, label: JSX.node}[]} suggestions The suggestions.
 * @param {string} selected The selected suggestion.
 * @param {function} onChange The change handler, called when a user selects a suggestion.
 * @returns {JSX.Element} The element.
 */
export const SuggestionsList = ( { idSuffix, suggestions, selected, onChange } ) => (
	<div>
		<RadioGroup
			className="yst-suggestions-radio-group yst-flex yst-flex-col"
			id={ `yst-ai-suggestions-radio-group__${ idSuffix }` }
		>
			{ suggestions.map( ( suggestion, index ) => (
				<Suggestion
					key={ `yst-ai-suggestions-radio-${ idSuffix }__${ index }` }
					id={ `yst-ai-suggestions-radio-${ idSuffix }__${ index }` }
					name={ `ai-suggestion__${ idSuffix }` }
					isChecked={ suggestion.value === selected }
					onChange={ onChange }
					suggestion={ suggestion }
				/>
			) ) }
		</RadioGroup>
	</div>
);
SuggestionsList.propTypes = {
	idSuffix: PropTypes.string.isRequired,
	suggestions: PropTypes.arrayOf( suggestionShape ).isRequired,
	selected: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};
