/* External dependencies */
import React from "react";
import initAlgoliaSearch from "algoliasearch";
import isUndefined from "lodash/isUndefined";
import { speak as a11ySpeak } from "@wordpress/a11y";
import PropTypes from "prop-types";
import styled from "styled-components";
import { __ } from "@wordpress/i18n";

/* Internal dependencies */
import Loading from "./Loading";
import SearchBar from "./SearchBar";
import SearchResultDetail from "./SearchResultDetail";
import SearchResults from "./SearchResults";

const AlgoliaSearchWrapper = styled.div`
	margin: 0 auto 20px auto;
	box-sizing: border-box;
`;

const VIEW = {
	SEARCH: "SEARCH",
	DETAIL: "DETAIL",
};

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
			currentView: VIEW.SEARCH,
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
		let usedQueries = this.addUsedQuery( searchString );

		if ( this.props.onQueryChange ) {
			this.props.onQueryChange( usedQueries );
		}

		// Updating the state will re-render the whole component.
		this.setState( {
			searchString,
			usedQueries: usedQueries,
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
	 * Sets the current view to the detail view and set the article index.
	 *
	 * @param {number} currentDetailViewIndex The index of the article you want to show in the state.results array.
	 *
	 * @returns {void}
	 */
	showDetailView( currentDetailViewIndex ) {
		let usedQueries = this.addResultToUsedQueries( currentDetailViewIndex );

		this.setState( {
			currentDetailViewIndex,
			usedQueries,
			currentView: VIEW.DETAIL,
		} );
	}

	/**
	 * Sets the current view to the search view.
	 *
	 * @returns {void}
	 */
	hideDetailView() {
		this.setState( { currentView: VIEW.SEARCH } );
	}

	/**
	 * Creates the Search Bar component, unless you are in the detail view.
	 *
	 * @returns {ReactElement} Searchbar component.
	 */
	createSearchBar() {
		return (
			<SearchBar
				submitAction={ this.onSearch.bind( this ) }
				searchString={ this.state.searchString }
				enableLiveSearch={ this.props.enableLiveSearch }
			/>
		);
	}

	/**
	 * Gets the error message.
	 *
	 * @returns {ReactElement} Error component.
	 */
	getErrorMessage() {
		const errorMessage = __( "Something went wrong. Please try again later.", "yoast-components" );

		a11ySpeak( errorMessage );

		return (
			<p>{ errorMessage }</p>
		);
	}

	/**
	 * Gets the loading indicator.
	 *
	 * @returns {ReactElement} Loader component.
	 */
	getLoadingIndicator() {
		const loadingPlaceholder = __( "Loading...", "yoast-components" );

		return <Loading placeholder={ loadingPlaceholder } />;
	}

	/**
	 * Gets the search results.
	 *
	 * @returns {ReactElement} Search results component.
	 */
	getSearchResults() {
		return <SearchResults
			{ ...this.props }
			searchString={ this.state.searchString }
			results={ this.state.results }
			onClick={ this.showDetailView.bind( this ) }
		/>;
	}

	/**
	 * Determines what the search results view needs to look like.
	 *
	 * @returns {ReactElement} Returns a specific search result component based on state.
	 */
	determineSearchResultsView() {
		// Show error when a error message is set.
		if ( this.state.errorMessage ) {
			return this.getErrorMessage();
		}

		// Show loading indicator when search results are being fetched and no results are present.
		if ( this.state.searching && ! this.state.results ) {
			return this.getLoadingIndicator();
		}

		// Show the list of search results if the postId for the detail view isn't set.
		return this.getSearchResults();
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
	 * Gets the search view.
	 *
	 * @returns {ReactElement} Search view component.
	 */
	getSearchView() {
		return (
			<AlgoliaSearchWrapper
				innerRef={ ( el ) => {
					this.searchViewWrapper = el;
				} }>
				{ this.createSearchBar() }
				{ this.determineSearchResultsView() }
			</AlgoliaSearchWrapper>
		);
	}

	/**
	 * Gets the search result detail.
	 *
	 * @returns {ReactElement} Detail view component.
	 */
	getDetailView() {
		return (
			<AlgoliaSearchWrapper>
				<SearchResultDetail
					{ ...this.props }
					post={ this.getPostFromResults( this.state.currentDetailViewIndex ) }
					onBackButtonClicked={ this.hideDetailView.bind( this ) }
				/>
			</AlgoliaSearchWrapper>
		);
	}

	/**
	 * Move focus back to the clicked link when going back from Detail to Search view.
	 *
	 * Call this function on componentDidUpdate() to avoid it runs on first rendering.
	 *
	 * @returns {void}
	 */
	moveFocusBackToClickedSearchResult() {
		let clickedLinkIndex = this.state.currentDetailViewIndex;
		// When is search view and a search results has been previously clicked.
		if ( this.state.currentView === "SEARCH" && clickedLinkIndex >= 0 ) {
			let resultLinks = this.searchViewWrapper.querySelectorAll( "ul a" );

			if ( ! resultLinks.length ) {
				return;
			}

			resultLinks[ clickedLinkIndex ].focus();
		}
	}

	/**
	 * Renders the React component.
	 *
	 * Called upon each state/props change. Determines and renders the view to render.
	 *
	 * @returns {ReactElement} The content of the component.
	 */
	render() {
		switch( this.state.currentView ) {
			case VIEW.SEARCH:
				return this.getSearchView();
			case VIEW.DETAIL:
				return this.getDetailView();
		}
	}

	/**
	 * Moves focus back to the clicked search results if this component updates.
	 *
	 * Prevents focus loss.
	 *
	 * @returns {void}
	 */
	componentDidUpdate() {
		this.moveFocusBackToClickedSearchResult();
	}
}

AlgoliaSearcher.propTypes = {
	algoliaApplicationId: PropTypes.string,
	algoliaApiKey: PropTypes.string,
	algoliaIndexName: PropTypes.string,
	onQueryChange: PropTypes.func,
	enableLiveSearch: PropTypes.bool,
};

AlgoliaSearcher.defaultProps = {
	algoliaApplicationId: "RC8G2UCWJK",
	algoliaApiKey: "459903434a7963f83e7d4cd9bfe89c0d",
	algoliaIndexName: "knowledge_base_all",
	enableLiveSearch: false,
};

export default AlgoliaSearcher;
