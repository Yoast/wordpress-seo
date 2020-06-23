import React from "react";
import PropTypes from "prop-types";

import ExamplesContainer from "./ExamplesContainer";
import { WordOccurrences } from "@yoast/components";
import ProminentWord from "yoastseo/src/values/ProminentWord";

const initialWords = [
	new ProminentWord( "davids", "david", 2 ),
	new ProminentWord( "goliaths", "goliath", 6 ),
	new ProminentWord( "word", "word", 3 ),
	new ProminentWord( "yoast", "yoast", 8 ),
	new ProminentWord( "test", "test", 10 ),
	new ProminentWord( "apps", "app", 6 ),
	new ProminentWord( "teletubbies", "teletubby", 11 ),
	new ProminentWord( "strange", "stange", 4 ),
	new ProminentWord( "improvisation", "improvisation", 4 ),
	new ProminentWord( "ranking", "rank", 5 ),
	new ProminentWord( "google", "google", 5 ),
	new ProminentWord( "terms", "term", 8 ),
	new ProminentWord( "wordpress", "wordpress", 9 ),
	new ProminentWord( "inspiration", "inspiration", 2 ),
	new ProminentWord( "internal", "internal", 2 ),
	new ProminentWord( "linking", "link", 2 ),
	new ProminentWord( "suggestions", "suggestion", 3 ),
	new ProminentWord( "keyword", "keyword", 3 ),
	new ProminentWord( "analysis", "analysis", 4 ),
	new ProminentWord( "linguïns", "linguïn", 5 ),
];

/**
 *
 * @param {Object} props The component's properties.
 *
 * @param {ProminentWord[]} props.wordsForInsights The words to populate the list with.
 * @param {function} props.onChange                The handler handling change events.
 * @param {function} props.onDelete                The handler handling delete events.
 *
 * @returns {InputRow[]} A list of input rows.
 *
 * @constructor
 */
const InputList = ( { wordsForInsights, onChange, onDelete } ) => {
	return wordsForInsights.map(
		( wordForInsights, index ) => {
			return <InputRow
				key={ `RelevantWordInputRow-${ index }` }
				index={ index }
				wordForInsights={ wordForInsights }
				onChange={ onChange }
				onDelete={ onDelete }
			/>;
		}
	);
};

/**
 * A row to change or remove a word to the input list.
 *
 * @param {Object} props                        The properties.
 *
 * @param {ProminentWord} props.wordForInsights The word to show in the row.
 * @param {number} props.index                  The row's index.
 * @param {function} props.onChange             The handler to call when one of the properties of the word (word, stem, occurrences) changes.
 * @param {function} props.onDelete             The handler to call when the row is removed.
 *
 * @returns {React.Component} The row.
 *
 * @constructor
 */
const InputRow = ( { wordForInsights, index, onChange, onDelete } ) => {
	/**
	 * Called when the word changes.
	 *
	 * @param {Event} event The change event.
	 *
	 * @returns {void}
	 */
	function onWordChange( event ) {
		onChange( event.target.value, "_word", index );
	}
	/**
	 * Called when the stem changes.
	 *
	 * @param {Event} event The change event.
	 *
	 * @returns {void}
	 */
	function onStemChange( event ) {
		onChange( event.target.value, "_stem", index );
	}
	/**
	 * Called when the occurrences change.
	 *
	 * @param {Event} event The change event.
	 *
	 * @returns {void}
	 */
	function onOccurrencesChange( event ) {
		onChange( event.target.value, "_occurrences", index );
	}
	/**
	 * Called when the row is deleted.
	 *
	 * @returns {void}
	 */
	function onDeleteRow() {
		onDelete( index );
	}
	return (
		<div key={ `InputDiv-${ index }` }>
			<input
				key={ `RelevantWordInput-${ index }` }
				onChange={ onWordChange }
				value={ wordForInsights._word }
			/>
			<input
				key={ `RelevantStemInput-${ index }` }
				onChange={ onStemChange }
				value={ wordForInsights._stem }
			/>
			<input
				key={ `RelevantOccurrencesInput-${ index }` }
				onChange={ onOccurrencesChange }
				value={ wordForInsights._occurrences }
				type="number"
			/>
			<button onClick={ onDeleteRow }>REMOVE</button>
		</div>
	);
};

InputRow.propTypes = {
	wordForInsights: PropTypes.instanceOf( ProminentWord ).isRequired,
	index: PropTypes.number.isRequired,
	onChange: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
};

/**
 * Clones the array of words.
 *
 * @param {ProminentWord[]} words The list of prominent words to clone.
 *
 * @returns {ProminentWord[]} A clone of the given words.
 */
const cloneWords = function( words ) {
	return words.map( word => {
		return new ProminentWord( word.getWord(), word.getStem(), word.getOccurrences() );
	} );
};

/**
 * Wraps the word occurrences component.
 * Adds a component to change, add and delete words manually.
 */
class WordOccurrencesWrapper extends React.Component {
	/**
	 * Creates a new wrapper.
	 *
	 * @param {Object} props The properties
	 */
	constructor( props ) {
		super( props );

		this.state = {
			words: cloneWords( initialWords ),
		};
		this.changeWord = this.changeWord.bind( this );
		this.removeWord = this.removeWord.bind( this );
		this.addWord = this.addWord.bind( this );
		this.reset = this.reset.bind( this );
	}

	/**
	 * Changes a property of a word.
	 *
	 * @param {string} value                        The new value of the property.
	 * @param {"_word"|"_stem"|"_occurrences"} type The name of the property.
	 * @param {number} index                        The index of the word that needs to be changed.
	 *
	 * @returns {void}
	 */
	changeWord( value, type, index ) {
		this.setState( ( prevState ) => {
			const nextState = Object.assign( {}, prevState );
			nextState.words = [ ...prevState.words ];
			switch ( type ) {
				case "_word":
					nextState.words[ index ].setWord( value );
					break;
				case "_stem":
					nextState.words[ index ]._stem = value;
					break;
				case "_occurrences":
					nextState.words[ index ].setOccurrences( value );
					break;
			}
			return nextState;
		} );
	}

	/**
	 * Removes a word from the table.
	 *
	 * @param {number} index The index of the word that needs to be removed.
	 *
	 * @returns {void}
	 */
	removeWord( index ) {
		this.setState( ( prevState ) => {
			const nextState = Object.assign( {}, prevState );
			nextState.words.splice( index, 1 );
			return {
				words: nextState.words,
			};
		} );
	}

	/**
	 * Adds a new word.
	 *
	 * @returns {void}
	 */
	addWord() {
		this.setState( prevState => {
			prevState.words.push(
				new ProminentWord( "" ),
			);
			return (
				{
					words: prevState.words,
				}
			);
		} );
	}

	/**
	 * Resets the words to their initial state.
	 *
	 * @returns {void}
	 */
	reset() {
		this.setState( {
			words: cloneWords( initialWords ),
		} );
	}

	/**
	 * Renders the component.
	 *
	 * @returns {ExamplesContainer} The rendered component.
	 */
	render() {
		return (
			<ExamplesContainer>
				<InputList
					onChange={ this.changeWord }
					wordsForInsights={ this.state.words }
					onDelete={ this.removeWord }
				/>
				<button onClick={ this.addWord }>Add word</button>
				<button onClick={ this.reset }>Reset</button>
				<div style={ { marginTop: "150px", width: "100%", height: "600px" } }>
					<WordOccurrences
						words={ this.state.words }
						header={ <p>This is an example text that will be displayed before the list is rendered.</p> }
						footer={ <p>This is an example text that will be displayed after the list is rendered.</p> }
					/>
				</div>
			</ExamplesContainer>
		);
	}
}

export default WordOccurrencesWrapper;
