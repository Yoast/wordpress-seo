import React from "react";

import ExamplesContainer from "./ExamplesContainer";
import WordCloud from "@yoast/components/src/WordCloud";

const initialRelevantWords = [
	{
		_word: "davids",
		_stem: "david",
		_occurrences: 2,
	},
	{
		_word: "goliaths",
		_stem: "goliath",
		_occurrences: 6,
	},
	{
		_word: "word",
		_stem: "word",
		_occurrences: 3,
	},
	{
		_word: "yoast",
		_stem: "yoast",
		_occurrences: 8,
	},
	{
		_word: "test",
		_stem: "test",
		_occurrences: 10,
	},
	{
		_word: "apps",
		_stem: "app",
		_occurrences: 6,
	},
	{
		_word: "teletubbies",
		_stem: "teletubby",
		_occurrences: 11,
	},
	{
		_word: "strange",
		_stem: "stange",
		_occurrences: 4,
	},
	{
		_word: "improvisation",
		_stem: "improvisation",
		_occurrences: 4,
	},
	{
		_word: "ranking",
		_stem: "rank",
		_occurrences: 5,
	},
	{
		_word: "google",
		_stem: "google",
		_occurrences: 5,
	},
	{
		_word: "terms",
		_stem: "term",
		_occurrences: 8,
	},
	{
		_word: "wordpress",
		_stem: "wordpress",
		_occurrences: 9,
	},
	{
		_word: "inspiration",
		_stem: "inspiration",
		_occurrences: 2,
	},
	{
		_word: "internal",
		_stem: "internal",
		_occurrences: 2,
	},
	{
		_word: "linking",
		_stem: "link",
		_occurrences: 2,
	},
	{
		_word: "suggestions",
		_stem: "suggestion",
		_occurrences: 3,
	},
	{
		_word: "keyword",
		_stem: "keyword",
		_occurrences: 3,
	},
	{
		_word: "analysis",
		_stem: "analysis",
		_occurrences: 4,
	},
	{
		_word: "linguïns",
		_stem: "linguïn",
		_occurrences: 5,
	},
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

class WordCloudWrapper extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			relevantWords: initialRelevantWords.map( initialWord => Object.assign( {}, initialWord ) ),
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
			nextState.relevantWords[ index ][ type ] = input;
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
				{
					_word: "",
					_stem: "",
					_occurrence: "",
				}
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
			relevantWords: initialRelevantWords.map( initialWord => Object.assign( {}, initialWord ) ),
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
				<div style={ { marginTop: "150px", maxWidth: "800px", height: "600px" } }>
					<WordCloud
						words={ this.state.relevantWords }
						textColor="#A4286A"
					/>
				</div>
			</ExamplesContainer>
		);
	}
}

export default WordCloudWrapper;
