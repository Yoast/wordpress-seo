import React from "react";
import initAlgoliaSearch from "algoliasearch";
import isUndefined from "lodash/isUndefined";
import a11ySpeak from "a11y-speak";
import PropTypes from "prop-types";
import styled from "styled-components";
import { injectIntl, intlShape, defineMessages } from "react-intl";

import Loading from "./Loading";
import SearchBar from "./SearchBar";
import SearchResultDetail from "./SearchResultDetail";
import SearchResults from "./SearchResults";

const AlgoliaSearchWrapper = styled.div`
	width: 80%;
	margin: 0 auto 20px auto;
	box-sizing: border-box;
`;

const messages = defineMessages( {
	loadingPlaceholder: {
		id: "algoliasearcher.loadingplaceholder",
		defaultMessage: "Loading...",
	},
	errorMessage: {
		id: "algoliasearcher.errormessage",
		defaultMessage: "Something went wrong. Please try again later.",
	},
} );

class AlgoliaSearcher extends React.Component {
	/**
	 * AlgoliaSearcher constructor.
	 *
	 * @constructor
	 * @param {object} props Properties of the AlgoliaSearcher component.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.state = {
			searchString: "",
			searching: false,
			results: [],
			errorMessage: "",
			usedQueries: {},
			currentDetailViewIndex: -1,
		};

		this.initAlgoliaClient();
	}

	/**
	 * Initializes the algolia client and index variables.
	 *
	 * @returns {void}
	 */
	initAlgoliaClient() {
		this.client = initAlgoliaSearch( this.props.algoliaApplicationId, this.props.algoliaApiKey );
		this.index = this.client.initIndex( this.props.algoliaIndexName );
	}

	/**
	 * Handles the form submit event. Stores the search string and performs a search.
	 *
	 * @param {string} searchString The entered search string.
	 *
	 * @returns {void}
	 */
	onSearch( searchString ) {
		if ( searchString === "" ) {
			return;
		}

		// Updating the state will re-render the whole component.
		this.setState( {
			searchString,
			usedQueries: this.addUsedQuery( searchString ),
			searching: true,
		}, this.updateSearchResults );
	}

	/**
	 * Adds a search string to the list of used queries.
	 *
	 * @param {string} searchString The search string that was used in the last search.
	 *
	 * @returns {Object} The usedQueries state object.
	 */
	addUsedQuery( searchString ) {
		let usedQueries = this.state.usedQueries;

		if ( isUndefined( usedQueries[ searchString ] ) ) {
			usedQueries[ searchString ] = {};
		}

		return usedQueries;
	}

	/**
	 * Processes the passed search error.
	 *
	 * @param {object} error The search error to process.
	 *
	 * @returns {void}
	 */
	processSearchError( error ) {
		this.setState( {
			errorMessage: error.message,
			searching: false,
		} );
	}

	/**
	 * Processes the search results.
	 *
	 * @param {object} results The results to process.
	 *
	 * @returns {void}
	 */
	processResults( results ) {
		this.setState( {
			results: results,
			errorMessage: "",
			searching: false,
		} );
	}

	/**
	 * Performs a search with the search string saved in the state.
	 *
	 * @returns {void}
	 */
	updateSearchResults() {
		this.performSearch( this.state.searchString )
			.then( this.processResults.bind( this ) )
			.catch( this.processSearchError.bind( this ) );
	}

	/**
	 * Performs a search with the given search string within the Algolia index.
	 *
	 * @param {string} searchString The words or sentence to get the results for.
	 *
	 * @returns {Promise} The promise that is performing the search.
	 */
	performSearch( searchString ) {
		return new Promise( ( resolve, reject ) => {
			this.index.search( searchString, ( err, data ) => {
				if ( err ) {
					reject( err );
					return;
				}

				resolve( data.hits );
			} );
		} );
	}

	/**
	 * Adds the data from the clicked result to the information associated with the current search string.
	 *
	 * @param {number} currentDetailViewIndex The current detail view index.
	 *
	 * @returns {Object} Object containing the currently used queries with additional post data.
	 */
	addResultToUsedQueries( currentDetailViewIndex ) {
		let post = this.state.results[ currentDetailViewIndex ];
		let usedQueries = this.state.usedQueries;

		usedQueries[ this.state.searchString ][ post.objectID ] = {
			title: post.post_title, // eslint-disable-line
			link: post.permalink,
		};

		return usedQueries;
	}

	/**
	 * Sets all values required to display the detailed view of a search result.
	 *
	 * @param {number} currentDetailViewIndex The index of the article you want to show in the state.results array.
	 *
	 * @returns {void}
	 */
	setCurrentDetailedViewIndex( currentDetailViewIndex ) {
		let usedQueries = this.addResultToUsedQueries( currentDetailViewIndex );

		this.setState( { currentDetailViewIndex, usedQueries } );
	}

	/**
	 * Resets the values associated with the displaying of the detailed search result view.
	 *
	 * @returns {void}
	 */
	unsetCurrentDetailedView() {
		this.setState( { currentDetailViewIndex: -1 } );
	}

	/**
	 * Creates the Search Bar component, unless you are in the detail view.
	 *
	 * @returns {ReactElement} Searchbar component.
	 */
	createSearchBar() {
		if ( this.state.currentDetailViewIndex !== -1 ) {
			return null;
		}

		return (
			<SearchBar
				submitAction={ this.onSearch.bind( this ) }
				searchString={ this.state.searchString }
			/>
		);
	}

	/**
	 * Gets the error message.
	 *
	 * @returns {ReactElement} Error component.
	 */
	getErrorMessage() {
		const errorMessage = this.props.intl.formatMessage( messages.errorMessage );

		a11ySpeak( errorMessage );

		return (
			<p>{ errorMessage }</p>
		);
	}

	/**
	 * Gets the loading indicator.
	 *
	 * @returns {ReactElement} Returns a loader.
	 */
	getLoadingIndicator() {
		const loadingPlaceholder = this.props.intl.formatMessage( messages.loadingPlaceholder );
		return <Loading placeholder={ loadingPlaceholder } />;
	}

	/**
	 * Gets the search results.
	 *
	 * @returns {ReactElement} Returns the search results.
	 */
	getSearchResults() {
		return <SearchResults
			{ ...this.props }
			searchString={ this.state.searchString }
			results={ this.state.results }
			handler={ this.setCurrentDetailedViewIndex.bind( this ) }
		/>;
	}

	/**
	 * Gets the search result detail.
	 *
	 * @returns {ReactElement} Returns the search result detail.
	 */
	getSearchResultDetail() {
		return <SearchResultDetail
			{ ...this.props }
			post={ this.getPostFromResults( this.state.currentDetailViewIndex ) }
			onClick={ this.unsetCurrentDetailedView.bind( this ) }
		/>;
	}

	/**
	 * Determines what the search results view needs to look like.
	 *
	 * @returns {ReactElement} Returns a specific search result object based on state.
	 */
	determineSearchResultsView() {
		// Show error when a error message is set.
		if( this.state.errorMessage ) {
			return this.getErrorMessage();
		}

		// Show loading indicator when search results are being fetched and no results are present.
		if ( this.state.searching && ! this.state.results ) {
			return this.getLoadingIndicator();
		}

		// Show the list of search results if the postId for the detail view isn't set.
		if ( this.state.currentDetailViewIndex === -1 ) {
			return this.getSearchResults();
		}

		// Else show the result detail
		return this.getSearchResultDetail();
	}

	/**
	 * Gets a specific post from the list of results.
	 *
	 * @param {number} index The index of the post to retrieve.
	 *
	 * @returns {Object} The post object associated with the index.
	 */
	getPostFromResults( index ) {
		return this.state.results[ index ];
	}

	/**
	 * Render the React component.
	 *
	 * Called upon each state change. Determines and renders the view to render.
	 *
	 * @returns {ReactElement} The content of the component.
	 */
	render() {
		return (
			<AlgoliaSearchWrapper>
				{ this.createSearchBar() }
				{ this.determineSearchResultsView() }
			</AlgoliaSearchWrapper>
		);
	}
}

AlgoliaSearcher.propTypes = {
	algoliaApplicationId: PropTypes.string,
	algoliaApiKey: PropTypes.string,
	algoliaIndexName: PropTypes.string,
	intl: intlShape.isRequired,
};

AlgoliaSearcher.defaultProps = {
	algoliaApplicationId: "RC8G2UCWJK",
	algoliaApiKey: "459903434a7963f83e7d4cd9bfe89c0d",
	algoliaIndexName: "knowledge_base_all",
};

export default injectIntl( AlgoliaSearcher );
