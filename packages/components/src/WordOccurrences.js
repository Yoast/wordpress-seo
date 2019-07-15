import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { __, sprintf } from "@wordpress/i18n";

const ProminentWordOccurrence = styled.span`
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
	max-width: 600px;
	justify-content: space-between;
	background:
		linear-gradient(
			to right,
			rgba(164, 40, 106, 0.2) ${ props => props.barWidth },
			${ props => props.barWidth },
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
		<WordBarContainer
			barWidth={ width }
		>
			<ProminentWord>{ word }</ProminentWord>
			<ProminentWordOccurrence>
				<span aria-hidden={ true }>{ occurrence }</span>
				<span className="screen-reader-text">{ sprintf( __( "%d occurrences", "yoast-components" ), occurrence ) }</span>
			</ProminentWordOccurrence>
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
 * @returns {ReactElement} The list of words, their occurrences, and bars.
 */
class WordOccurrences extends React.Component {
	/**
	 * Constructs the WordOccurrences component.
	 *
	 * @param {Object}          props        The props object.
	 * @param {ProminentWord[]} props.words  The array of prominent word objects.
	 * @param {HTMLElement}     props.header The html to render before the list.
	 * @param {HTMLElement}     props.footer The html to render after the list.
	 */
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

	/**
	 * React lifecycle method. See: https://reactjs.org/docs/react-component.html#static-getderivedstatefromprops
	 *
	 * Calculates the component state based in incoming props.
	 *
	 * @param {Object} props The incoming props.
	 *
	 * @returns {Object} The derived component state.
	 */
	static getDerivedStateFromProps( props ) {
		const words = [ ...props.words ];
		words.sort( ( a, b ) => {
			return b.getOccurrences() - a.getOccurrences();
		} );
		const allOccurrences = words.map( prominentWord => prominentWord.getOccurrences() );

		return {
			occurrences: {
				min: Math.min( ...allOccurrences ),
				max: Math.max( ...allOccurrences ),
			},
			words: words,
		};
	}

	/**
	 * Renders the WordOccurrences component to the DOM.
	 *
	 * @returns {ReactElement} The rendered WordOccurrences component.
	 */
	render() {
		return (
			<React.Fragment>
				{ this.props.header }
				<WordOccurrencesList
					aria-label={ __( "Prominent words", "yoast-components" ) }
				>
					{
						this.state.words.map(
							( prominentWord ) => {
								const word = prominentWord.getWord();
								const occurrence = prominentWord.getOccurrences();
								const width = `${ ( occurrence / this.state.occurrences.max ) * 100 }%`;
								return <WordBar
									key={ `wordbar-${ word }` }
									word={ word }
									width={ width }
									occurrence={ occurrence }
								/>;
							}
						)
					}
				</WordOccurrencesList>
				{ this.props.footer }
			</React.Fragment>
		);
	}
}

WordOccurrences.propTypes = {
	words: PropTypes.array.isRequired,
	header: PropTypes.element,
	footer: PropTypes.element,
};

WordOccurrences.defaultProps = {
	header: null,
	footer: null,
};

export default WordOccurrences;
