import React from "react";
import PropTypes from "prop-types";
import a11ySpeak from "a11y-speak";
import styled from "styled-components";
import { ZebrafiedListTable } from "../basic/Table/ListTable";
import { Row } from "../basic/Table/Row";
import colors from "../../style-guide/colors.json";

/**
 * The title of the search result item.
 */
const SearchResultTitle = styled.h3`
	padding-left: 10px;
	margin: 0;
	font-size: 1em;
	font-weight: normal;
`;

/**
 * The link to the search result.
 */
const SearchResultLink = styled.a`
	color: ${ colors.$color_black };
	
	&:hover, &:focus {
		color: ${ colors.$color_pink_dark };
	}
`;

/**
 * Returns a single search result item.
 *
 * @param {Object} props Properties of the SearchResult component.
 * @returns {ReactElement} The rendered search result.
 */
export function SearchResult( props ) {
	let post = props.post;

	return (
		<Row {...props}>
			<SearchResultLink href={ post.permalink } onClick={ props.handler }>
				<div>
					<SearchResultTitle>{ post.post_title }</SearchResultTitle>
				</div>
			</SearchResultLink>
		</Row>
	);
}

SearchResult.propTypes = {
	handler: PropTypes.func.isRequired,
	post: PropTypes.object.isRequired,
};

/**
 * Wraps the search results.
 */
const SearchResultsWrapper = styled.div`
	margin-top: 20px;
	width: 100%;
	display: block;
	clear: both;
`;

/**
 * The no results text paragraph.
 */
const NoResults = styled.p`
	margin-left: 10px;
`;

/**
 * Create the ReactElement to render a list of search results.
 *
 * @param {object} props The React props.
 *
 * @returns {ReactElement} A list of search results.
 *
 * @constructor
 */
class SearchResults extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			results: props.results,
		};
	}

	/**
	 * Handles the situation that there are zero results.
	 *
	 * @returns {ReactElement|null} A message stating that no results were found or null if no search term was provided.
	 */
	handleZeroResults() {
		if ( this.props.searchString !== "" ) {
			return this.renderNoResultsFound();
		}

		return null;
	}

	/**
	 * Renders a no results found text.
	 *
	 * @returns {ReactElement} The no results found text.
	 */
	renderNoResultsFound() {
		a11ySpeak( this.props.noResultsText );

		return ( <NoResults>{ this.props.noResultsText }</NoResults> );
	}

	/**
	 * Maps the results to SearchResult components.
	 *
	 * @param {Object} results The results returned by Algolia.
	 *
	 * @returns {Array} Array containing the mapped search results.
	 */
	resultsToSearchItem( results ) {
		return results.map( ( result, index ) => {
			return <SearchResult
				height="24px"
				key={ result.objectID }
				post={ result }
				handler={ ( event ) => {
					event.preventDefault();
					this.props.handler( index );
				} }
			/>;
		} );
	}

	/**
	 * Renders the search results list.
	 *
	 * @returns {ReactElement} A div with either the search results, or a div with a message that no results were found.
	 */
	render() {
		let resultsCount = this.props.results.length;

		// Check whether no results are returned.
		if ( resultsCount <= 0 ) {
			return this.handleZeroResults();
		}

		a11ySpeak( this.props.foundResultsText.replace( "%d", resultsCount ) );

		return (
			<SearchResultsWrapper>
				<ZebrafiedListTable>
					{ this.resultsToSearchItem( this.props.results ) }
				</ZebrafiedListTable>
			</SearchResultsWrapper>
		);
	}

}

SearchResults.propTypes = {
	post: PropTypes.object.isRequired,
	showDetail: PropTypes.func.isRequired,
	handler: PropTypes.func.isRequired,
	searchString: PropTypes.string,
	results: PropTypes.array,
	noResultsText: PropTypes.string.isRequired,
	foundResultsText: PropTypes.string.isRequired,
};

SearchResults.defaultProps = {
	searchString: "",
	results: [],
};

export default SearchResults;
