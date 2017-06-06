import React from "react";
import initAlgoliaSearch from "algoliasearch";
import isUndefined from "lodash/isUndefined";
import a11ySpeak from "a11y-speak";

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
		super();

		this.state = {
			searchString: "",
			usedQueries: {},
			results: [],
			errorMessage: "",
			showDetail: false,
			searching: false,
		};

		this.props = props;

		this.initAlgoliaClient();

		this.searchButtonClicked = this.searchButtonClicked.bind( this );
		this.hideDetail = this.hideDetail.bind( this );
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
	 * @param {object} evt The React SyntheticEvent.
	 *
	 * @returns {void}
	 */
	searchButtonClicked( evt ) {
		let searchString = evt.target.getElementsByTagName( "input" )[ 0 ].value;

		if ( searchString !== "" ) {
			let usedQueries = this.state.usedQueries;

			if ( isUndefined( usedQueries[ searchString ] ) ) {
				usedQueries[ searchString ] = {};
			}

			// Updating the state will re-render the whole component.
			this.setState( {
				searchString,
				usedQueries,
				searching: true,
			}, () => {
				// After the state was set.
				this.updateSearchResults();
			} );
		}
	}

	/**
	 * Performs a search with the searchstring saved in the state and sets the
	 * results property of the state to the results found.
	 *
	 * @returns {void}
	 */
	updateSearchResults() {
		this.setState( {
			searching: true,
		} );

		this.getSearchResults( this.state.searchString )
		    .then( ( searchResults ) => {
				// Updating the state will re-render the whole component.
				this.setState( {
					results: searchResults,
					errorMessage: "",
					searching: false,
				} );
			} )
	        .catch( ( error ) => {
				// Updating the state will re-render the whole component.
				this.setState( {
					errorMessage: error.message,
					searching: false,
				} );
			} );
	}

	/**
	 * Performs a search with a given search string on the algolia index which
	 * information was passed in the AlgoliaSearcher's props.
	 *
	 * @param {string} searchString The words or sentence to get the results for.
	 * @returns {Promise} The promise that is performing the search.
	 */
	getSearchResults( searchString ) {
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
	 * Sets all values required to display the detail view of a search result.
	 *
	 * @param {number} resultArrayIndex The index of the article you want to
	 *                                  show in the state.results array.
	 * @returns {void}
	 */
	showDetail( resultArrayIndex ) {
		let usedQueries = this.state.usedQueries;
		let post = this.state.results[ resultArrayIndex ];

		usedQueries[ this.state.searchString ][ post.objectID ] = {
			title: post.post_title,
			link: post.permalink
		};

		this.setState( {
			showDetail: resultArrayIndex,
			usedQueries: usedQueries,
		} );
	}

	/**
	 * Hides the details page and return to the results page.
	 *
	 * @returns {void}
	 */
	hideDetail() {
		this.setState( { showDetail: false } );
	}

	/**
	 * Renders the search results list.
	 *
	 * @returns {JSX} A div with either the search results, or a div with a
	 *                message that no results were found.
	 */
	renderSearchResults() {
		let searchResultContent;
		let resultsCount = this.state.results.length;

		// We'll check to see whether no results are returned.
		if ( resultsCount <= 0 && this.state.searchString !== "" ) {
			searchResultContent = <p>{this.props.noResultsText}</p>;
			a11ySpeak( this.props.noResultsText );

			return searchResultContent;
		}

		let results = this.state.results.map( ( result, index ) => {
			return <SearchResult
				key={result.objectID}
				post={result}
				showDetail={ this.showDetail( index ) }
			/>;
		} );

		searchResultContent = <ul role="list" className="wpseo-kb-search-results">{results}</ul>;
		a11ySpeak( this.props.foundResultsText.replace( "%d", resultsCount ) );

		return searchResultContent;
	}

	/**
	 * Renders the navigation buttons and the article content.
	 *
	 * @returns {JSX} A div with navigation buttons and the article content.
	 */
	renderDetail() {
		let detailIndex = this.state.showDetail;
		let post = this.state.results[ detailIndex ];

		return (
			<div className="wpseo-kb-search-detail">
				<div className="wpseo-kb-search-navigation">
					<button className="button dashicon-button wpseo-kb-search-back-button"
					        aria-label={this.props.backLabel}
					        onClick={this.hideDetail}>
						{this.props.back}
					</button>

					<a href={post.permalink}
					   className="button dashicon-button wpseo-kb-search-ext-link "
					   aria-label={this.props.openLabel}
					   target="_blank">
						{this.props.open}
					</a>
				</div>

				<ArticleContent post={post} iframeTitle={this.props.iframeTitle}/>
			</div>
		);
	}

	/**
	 * Log any occuring error and render a search error warning.
	 *
	 * @param {string} errorMessage The message to display.
	 * @returns {JSX} A div with a warning that the search was not completed.
	 */
	renderError( errorMessage ) {
		console.error( errorMessage );
		a11ySpeak( this.props.errorMessage );

		return (
			<p>{ this.props.errorMessage }</p>
		);
	}

	/**
	 * Creates the Search Bar component with additional components such as a loading indicator, errors etc.
	 *
	 * @return {JSX} A div containing the search bar and potential other components.
	 */
	createSearchBar() {
		let errorMessage = ""
		let loadingIndicator = ""
		let resultsHeading = ""
		let results = ""

		let searchBar = <SearchBar
			headingText={ this.props.headingText }
			submitAction={ this.searchButtonClicked }
			searchString={ this.state.searchString }
			searchButtonText={ this.props.searchButtonText }
		/>;

		// Show an error message.
		if ( this.state.errorMessage ) {
			errorMessage = this.renderError( this.state.errorMessage );
		}

		// Show a loading indicator.
		if ( this.state.searching ) {
			loadingIndicator = <Loading loadingPlaceholder={ this.props.loadingPlaceholder } />
		}

		// Show the list of search results if the postId for the detail view isn't set.
		if ( this.state.showDetail === false ) {
			resultsHeading = this.determineResultsHeading();
			results = this.renderSearchResults();
		}

		// Else show the article content/detail view.
		if ( this.state.showDetail === true ) {
			results = this.renderDetail();
		}

		return <div>
			{ searchBar }
			{ errorMessage }
			{ loadingIndicator }
			{ resultsHeading }
			{ results }
		</div>
	}

	/**
	 * Render the React component.
	 *
	 * Called upon each state change. Determines and renders the view to render.
	 *
	 * @returns {JSX.Element} The content of the component.
	 */
	render() {
		return <div className="wpseo-kb-search-container">{ this.createSearchBar() }</div>;
	}

	/**
	 * Determines whether a search result heading should be created or not.
	 *
	 * @return {JSX|string} Returns a header if there are search results. Otherwise returns an empty string.
	 */
	determineResultsHeading() {
		if ( this.state.results.length === 0 ) {
			return "";
		}

		return <h2 className="screen-reader-text">{this.props.searchResultsHeading}</h2>
	}
}

AlgoliaSearcher.propTypes = {
	foundResultsText: React.PropTypes.string,
	noResultsText: React.PropTypes.string,
	headingText: React.PropTypes.string,
	searchButtonText: React.PropTypes.string,
	searchResultsHeading: React.PropTypes.string,
	iframeTitle: React.PropTypes.string,
	algoliaApplicationId: React.PropTypes.string.isRequired,
	algoliaApiKey: React.PropTypes.string.isRequired,
	algoliaIndexName: React.PropTypes.string.isRequired,
	errorMessage: React.PropTypes.string.isRequired,
	loadingPlaceholder: React.PropTypes.string.isRequired,
	open: React.PropTypes.string.isRequired,
	openLabel: React.PropTypes.string.isRequired,
	back: React.PropTypes.string.isRequired,
	backLabel: React.PropTypes.string.isRequired,
};

AlgoliaSearcher.defaultProps = {
	foundResultsText: "Number of search results: %d",
	noResultsText: "No results found.",
	headingText: "Search the Yoast knowledge base",
	searchButtonText: "Search",
	searchResultsHeading: "Search results",
	iframeTitle: "Knowledge base article",
	algoliaApplicationId: "RC8G2UCWJK",
	algoliaApiKey: "459903434a7963f83e7d4cd9bfe89c0d",
	algoliaIndexName: "knowledge_base_all",
	errorMessage: "Something went wrong. Please try again later.",
	loadingPlaceholder: "Loading...",
	back: "Back",
	backLabel: "Back to search results",
	open: "Open",
	openLabel: "Open the knowledge base article in a new window or read it in the iframe below",
};

/**
 * Create the JSX to render the searchbar.
 *
 * @param {object} props The React props.
 * @returns {JSX} A div with the searchbar.
 * @constructor
 */
const SearchBar = ( props ) => {
	return (
		<div className="wpseo-kb-search-search-bar">
			<h2 id="wpseo-kb-search-heading">{props.headingText}</h2>
			<form onSubmit={ ( evt ) => { evt.preventDefault(); props.submitAction( evt ); } }>
				<input type="text" aria-labelledby="wpseo-kb-search-heading"
				       defaultValue={props.searchString}/>
				<button type="submit" className="button wpseo-kb-search-search-button">{props.searchButtonText}</button>
			</form>
		</div>
	);
};

/**
 * Create the JSX to render a single searchresult.
 *
 * @param {object} props The React props.
 * @returns {JSX} A div with a single search result.
 * @constructor
 */
const SearchResult = ( props ) => {
	let post = props.post;
	let description = post.excerpt || post.metadesc;
	return (
		<li>
			<a href={post.permalink} onClick={ ( evt ) => { evt.preventDefault(); props.showDetail(); } } className="wpseo-kb-search-result-link">
				<div className="wpseo-kb-search-result">
					<h3 className="wpseo-kb-search-result-title">{ post.post_title }</h3>
					{ description && <p>{ description }</p> }
				</div>
			</a>
		</li>
	);
};

/**
 * Creates the JSX to render the content of the selected article.
 *
 * @param {object} props The React props.
 * @returns {JSX} A div with the content of the selected article.
 * @constructor
 */
const ArticleContent = ( props ) => {
	let url = props.post.permalink + "amp?source=wpseo-kb-search";
	return (
		<iframe src={url} className="kb-search-content-frame" title={props.iframeTitle}/>
	);
};

/**
 * Creates the JSX to render a loading indicator.
 *
 * @param {object} props The React props.
 * @returns {JSX} A div with a loading indicator.
 * @constructor
 */
const Loading = ( props ) => {
	return (
		<div className="wpseo-kb-loader">{props.loadingPlaceholder}</div>
	);
};

export default AlgoliaSearcher;
