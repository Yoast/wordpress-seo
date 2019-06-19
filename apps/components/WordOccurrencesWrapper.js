import React from "react";

import ExamplesContainer from "./ExamplesContainer";
import { WordOccurrences } from "@yoast/components";
import ProminentWord from "yoastseo/src/values/ProminentWord";

const initialRelevantWords = [
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

const RelevantWordInputList = ( props ) => {
	return props.relevantWords.map(
		( relevantWord, index ) => {
			return <RelevantWordInputRow
				key={ `RelevantWordInputRow-${ index }` }
				index={ index }
				relevantWord={ relevantWord }
				onChange={ props.onChange }
				onDeleteClick={ props.onDeleteClick }
			/>;
		}
	);
};

const RelevantWordInputRow = ( props ) => {
	function changeWord( event ) {
		props.onChange( event.target.value, "_word", props.index );
	}
	function changeStem( event ) {
		props.onChange( event.target.value, "_stem", props.index );
	}
	function changeOccurrences( event ) {
		props.onChange( event.target.value, "_occurrences", props.index );
	}
	function onDeleteClick(){
		props.onDeleteClick( props.index );
	}
	return (
		<div key={ `InputDiv-${ props.index }` }>
			<input
				key={ `RelevantWordInput-${ props.index }` }
				onChange={ changeWord }
				value={ props.relevantWord._word }
			/>
			<input
				key={ `RelevantStemInput-${ props.index }` }
				onChange={ changeStem }
				value={ props.relevantWord._stem }
			/>
			<input
				key={ `RelevantOccurrencesInput-${ props.index }` }
				onChange={ changeOccurrences }
				value={ props.relevantWord._occurrences }
				type="number"
			/>
			<button onClick={ onDeleteClick }>REMOVE</button>
		</div>
	);
};

const cloneWords = function ( words ) {
	return words.map( word => {
		return new ProminentWord( word.getWord(), word.getStem(), word.getOccurrences() );
	} );
};

class WordOccurrencesWrapper extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			relevantWords: cloneWords( initialRelevantWords ),
		};
		this.changeRelevantWord = this.changeRelevantWord.bind( this );
		this.removeRelevantWord = this.removeRelevantWord.bind( this );
		this.addRelevantWordRow = this.addRelevantWordRow.bind( this );
		this.resetRelevantWords = this.resetRelevantWords.bind( this );
	}

	changeRelevantWord( input, type, index ) {
		this.setState( ( prevState ) => {
			const nextState = Object.assign( {}, prevState );
			nextState.relevantWords = [ ...prevState.relevantWords ];
			switch ( type ) {
				case "_word":
					nextState.relevantWords[ index ].setWord( input );
					break;
				case "_stem":
					nextState.relevantWords[ index ]._stem = input;
					break;
				case "_occurrences":
					nextState.relevantWords[ index ].setOccurrences( input );
					break;
			}
			return nextState;
		} );
	}

	removeRelevantWord( index ) {
		this.setState( ( prevState ) => {
			const nextState = Object.assign( {}, prevState );
			nextState.relevantWords.splice( index, 1 );
			return {
				relevantWords: nextState.relevantWords,
			};
		} );
	}

	addRelevantWordRow() {
		this.setState( prevState => {
			prevState.relevantWords.push(
				new ProminentWord( "" ),
			);
			return (
				{
					relevantWords: prevState.relevantWords,
				}
			);
		} );
	}

	resetRelevantWords() {
		this.setState( {
			relevantWords: cloneWords( initialRelevantWords ),
		} );
	}

	render() {
		return (
			<ExamplesContainer>
				<RelevantWordInputList
					onChange={ this.changeRelevantWord }
					relevantWords={ this.state.relevantWords }
					onDeleteClick={ this.removeRelevantWord }
				/>
				<button onClick={ this.addRelevantWordRow }>Add word</button>
				<button onClick={ this.resetRelevantWords }>Reset</button>
				<div style={ { marginTop: "150px", width: "100%", height: "600px" } }>
					<WordOccurrences
						words={ this.state.relevantWords }
						header={ <p>This is an example text that will be displayed before the list is rendered.</p> }
						footer={ <p>This is an example text that will be displayed after the list is rendered.</p> }
					/>
				</div>
			</ExamplesContainer>
		);
	}
}

export default WordOccurrencesWrapper;
