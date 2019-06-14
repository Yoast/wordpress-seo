import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const ProminentWordOccurrence = styled.p`
	display: inline-block;
	margin: 2px 8px;
`;

const ProminentWord = styled( ProminentWordOccurrence )`
	font-weight: bold;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const WordOccurrencesList = styled.ol`
	list-style: none;
	padding: 0;
	width: 100%;
	margin: 0;
`;

const WordBarContainer = styled.li`
	margin: 8px 0;
	height: calc( 1.375em + 4px );
	display: flex;
	width: 100%;
	justify-content: space-between;
	background:
		linear-gradient(
			to right,
			rgba(164, 40, 106, 0.2) ${ props => props.width },
			${ props => props.width },
			transparent
		);
`;

/**
 * A list item containing a word and its occurrence, with a gradient background reflecting the relative occurrence.
 *
 * @constructor
 *
 * @param   {Object} word        The word.
 * @param   {number} occurrences The word's occurrence.
 * @param   {string} width       A string indicating the percentage of the bar that should be coloured purple.
 * @returns {JSX}                The list item.
 */
const WordBar = ( { word, occurrence, width } ) => {
	return (
		<WordBarContainer width={ width }>
			<ProminentWord>{ word }</ProminentWord>
			<ProminentWordOccurrence>{ occurrence }</ProminentWordOccurrence>
		</WordBarContainer>
	);
};

WordBar.propTypes = {
	word: PropTypes.string.isRequired,
	occurrence: PropTypes.number.isRequired,
	width: PropTypes.string.isRequired,
};

/**
 * The WordOccurrences list, that contains words, their occurrence, and bars reflecting their relative occurrence.
 *
 * @param {Array} words The array of objects containing words and occurrences.
 *
 * @returns {ReactElement} The list of words, their occurrences, and bars.
 */
class WordOccurrences extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			words: [ ...props.words ] || [],
			occurrences: {
				min: 0,
				max: 0,
			},
		};
	}

	static getDerivedStateFromProps( props ) {
		const words = [ ...props.words ];
		words.sort( ( a, b ) => {
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
			<WordOccurrencesList>
				{
					this.state.words.map(
						( wordObject, index ) => {
							const width = `${ ( wordObject._occurrences / this.state.occurrences.max ) * 100 }%`;
							return <WordBar
								key={ `wordbar-${ index }` }
								word={ wordObject._word }
								width={ width }
								occurrence={ wordObject._occurrences }
							/>;
						}
					)
				}
			</WordOccurrencesList>
		);
	}
}

WordOccurrences.propTypes = {
	words: PropTypes.array.isRequired,
};

export default WordOccurrences;
