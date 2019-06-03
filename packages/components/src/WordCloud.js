import TagCloud from "react-tag-cloud";
import React from "react";

const minPx = 13;
const maxPx = 40;

class WordCloud extends React.Component {
	constructor( props ) {
		super( props );


		this.state = {
			words: props.words || [],
			occurrences: {
				min: 0,
				max: 0,
			},
		};
		this.mapOccurrencesToFontSize.bind( this );
		this.getWordStyle.bind( this );
	}

	mapOccurrencesToFontSize( occurrences ) {
		const pxPerOccurrence = ( maxPx - minPx ) / ( this.state.occurrences.max - this.state.occurrences.min );
		return Math.floor( maxPx - ( ( this.state.occurrences.max - occurrences ) * pxPerOccurrence ) );
	}

	getWordStyle( occurrences, index ) {
		// Somehow tag-cloud keeps adding 2px to the fontsize, so we preemptively remove it here.
		return {
			fontSize: this.mapOccurrencesToFontSize( occurrences ) - 2,
			fontWeight: index <= 2 ? "bold" : "normal",
			color: this.props.textColor,
		};
	}

	static getDerivedStateFromProps( props ) {
		const words = props.words.sort( ( a, b ) => {
			return b._occurrences - a._occurrences;
		} );
		const allOccurrences = words.map( wordObject => wordObject._occurrences );

		return {
			occurrences: {
				min: Math.min( ...allOccurrences ),
				max: Math.max( ...allOccurrences ),
			},
			words: words,
		};
	}

	render() {
		return (
			<TagCloud
				style={ {
					fontFamily: "sans-serif",
					padding: 5,
					width: "100%",
					height: "100%",
				} }
			>
				{
					this.state.words.map(
						( wordObject, index ) => {
							return <div
								style={ this.getWordStyle( wordObject._occurrences, index ) }
								key={ `word-${ index }` }
							>
								{ wordObject._word }
							</div>;
						}
					)
				}
			</TagCloud>
		);
	}
}

export default WordCloud;
