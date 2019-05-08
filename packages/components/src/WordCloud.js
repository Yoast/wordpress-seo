import TagCloud from "react-tag-cloud";
import React from "react";

class WordCloud extends React.Component {
	constructor( props ) {
		super( props );
	}

	isBold( occurrences ) {
		if ( occurrences >= 6 ) {
			return "bold";
		}
		return "normal";
	}

	getWordStyle( occurrences ) {
		return {
			fontSize: 10 * occurrences,
			fontWeight: this.isBold( occurrences ),
		};
	}

	render() {
		console.log( this.props );
		return (
			<div>
				<div style={ { height: "400px" } }>
					<TagCloud
						style={ {
							fontFamily: "sans-serif",
							fontSize: 30,
							fontWeight: "bold",
							color: "blue",
							padding: 5,
							width: "100%",
							height: "100%",
						} }
					>
						{
							this.props.words.map(
								( wordObject, index ) => {
									return <div
										style={ this.getWordStyle( wordObject.occurrences ) }
										key={ `word-${ index }` }
									>
										{ wordObject.word }
									</div>;
								}
							)
						}
					</TagCloud>
				</div>
			</div>
		);
	}
}

export default WordCloud;
