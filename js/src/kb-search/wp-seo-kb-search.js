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
			// The search term entered by the user.
			searchString: "",

			// An object containing the articles clicked by the user for a given search result.
			usedQueries: {},

			// The search results found.
			results: [],

			// A description of a search error, if any.
			errorMessage: "",

			// Shows the search results if is set to false. Otherwise, it shows the content of the article which index (of the state.results array) correlates with the value of showDetail.
			showDetail: false,

			// Used to display a loading spinner while searching.
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
				searchString: searchString,
				usedQueries: usedQueries,
				searching: true,
			}, function() {
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
		this.getSearchResults( this.state.searchString ).then( function( searchResults ) {
			// Updating the state will re-render the whole component.
			this.setState( {
				results: searchResults,
				errorMessage: "",
				searching: false,
			} );
		}.bind( this ) ).catch( function( error ) {
			// Updating the state will re-render the whole component.
			this.setState( {
				errorMessage: error.message,
				searching: false,
			} );
		}.bind( this ) );
	}

	/**
	 * Performs a search with a given search string on the algolia index which
	 * information was passed in the AlgoliaSearcher's props.
	 *
	 * @param {string} searchString The words or sentence to get the results for.
	 * @returns {Promise} The promise that is performing the search.
	 */
	getSearchResults( searchString ) {
		return new Promise( function( resolve, reject ) {
			this.index.search( searchString, function( err, data ) {
				if ( err ) {
					reject( err );
					return;
				}
				resolve( data.hits );
			} );
		}.bind( this ) );
	}

	/**
	 * Set all values required to display the detail view of a search result.
	 *
	 * @param {number} resultArrayIndex The index of the article you want to
	 *                                  show in the state.results array.
	 * @returns {void}
	 */
	showDetail( resultArrayIndex ) {
		let usedQueries = this.state.usedQueries;
		let post = this.state.results[ resultArrayIndex ];
		let postId = post.objectID;
		let articleTitle = post.post_title;
		let articleLink = post.permalink;
		usedQueries[ this.state.searchString ][ postId ] = { title: articleTitle, link: articleLink };
		this.setState( {
			showDetail: resultArrayIndex,
			usedQueries: usedQueries,
		} );
	}

	/**
	 * Hide the details page and return to the results page.
	 *
	 * @returns {void}
	 */
	hideDetail() {
		this.setState( { showDetail: false } );
	}

	/**
	 * Render the search results list.
	 *
	 * @returns {JSX} A div with either the search results, or a div with a
	 *                message that no results were found.
	 */
	renderSearchResults() {
		var searchResultContent;
		var resultsCount = this.state.results.length;
		if ( resultsCount > 0 ) {
			var results = this.state.results.map( ( result, arrayIndex ) => {
				return <SearchResult key={result.objectID} post={result}
                                     showDetail={this.showDetail.bind( this, arrayIndex )}/>;
			} );
			searchResultContent = <ul role="list" className="wpseo-kb-search-results">{results}</ul>;
			a11ySpeak( this.props.foundResultsText.replace( "%d", resultsCount ) );
		}
		else if ( this.state.searchString !== "" ) {
			searchResultContent = <p>{this.props.noResultsText}</p>;
			a11ySpeak( this.props.noResultsText );
		}
		return searchResultContent;
	}

	/**
	 * Render the navigation buttons and the article content.
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
			<p>
				{this.props.errorMessage}
			</p>
		);
	}

    /**
	 * Render the React component.
	 *
	 * Called upon each state change. Determines and renders the view to render.
	 *
	 * @returns {JSX} The content of the component.
	 */
	render() {
		var content = "";
		var searchBar = <SearchBar headingText={this.props.headingText} submitAction={this.searchButtonClicked}
								searchString={this.state.searchString} searchButtonText={this.props.searchButtonText}/>;

		// Show an error message.
		if ( this.state.errorMessage ) {
			content = (
				<div>
					{searchBar}
					{this.renderError( this.state.errorMessage )}
				</div>
			);
		}

		// Show a loading indicator.
		else if ( this.state.searching ) {
			content = (
				<div>
					{searchBar}
					<Loading loadingPlaceholder={this.props.loadingPlaceholder}/>
				</div>
			);
		}

		// Show the list of search results if the postId for the detail view isn't set.
		else if ( this.state.showDetail === false ) {
			content = (
				<div>
					{searchBar}
					{ this.state.results.length > 0 ? <h2 className="screen-reader-text">{this.props.searchResultsHeading}</h2> : "" }
					{this.renderSearchResults()}
				</div>
			);
		}

		// Else show the article content/detail view.
		else {
			content = this.renderDetail();
		}
		return <div className="wpseo-kb-search-container">{content}</div>;
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
			<form onSubmit={function( evt ) { evt.preventDefault(); props.submitAction( evt ); } }>
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
			<a href={post.permalink} onClick={ function( evt ) { evt.preventDefault(); props.showDetail(); } } className="wpseo-kb-search-result-link">
				<div className="wpseo-kb-search-result">
					<h3 className="wpseo-kb-search-result-title">{post.post_title}</h3>
					{ description && <p>{description}</p> }
				</div>
			</a>
		</li>
	);
};

/**
 * Create the JSX to render the content of the selected article.
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
 * Create the JSX to render a loading indicator.
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
