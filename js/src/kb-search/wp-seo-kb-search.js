import React from 'react';
import AlgoliaSearch from 'algoliasearch';

class AlgoliaSearcher extends React.Component {

	/**
	 * ALgoliaSearcher constructor.
	 *
	 * @constructor
	 * @param {object} props Properties of the ALgoliaSearcher component.
	 */
	constructor( props ) {
		super();
		this.state = {
			searchString: '',	// The by the user given search input
			usedQueries: {}, 	// An object containing the read articles by the user per used search string.
			results: [],		// The found results.
			errorMessage: '',	// An description of the error if one occurs while executing the search.
			showDetail: false,	//  Shows the search results if this is set to false. Otherwhise, it shows the content of the article which index (of the state.results array) correlates with the value of showDetail.
			searching: false
		};
		this.props = props;
		this.initAlgoliaClient();

        this.searchButtonClicked = this.searchButtonClicked.bind( this );
        this.hideDetail = this.hideDetail.bind( this );
	}

	/**
	 * Initializes the algolia client and index variables.
	 */
	initAlgoliaClient() {
        this.client = AlgoliaSearch( this.props.algoliaApplicationId, this.props.algoliaApiKey );
        this.index = this.client.initIndex( this.props.algoliaIndexName );
	}

	/**
	 * Handles the input changed event. It saved the used search string and performs a search.
	 *
	 * @param {object} e The event.
	 */
	searchButtonClicked( evt ) {
        let searchString = evt.target.getElementsByTagName( 'input' )[ 0 ].value;
		if ( searchString !== '' ) {
			let usedQueries = this.state.usedQueries;
			if ( usedQueries[ searchString ] === undefined ) {
				usedQueries[ searchString ] = {};
			}
			this.setState( {
				searchString: searchString,
				usedQueries: usedQueries
			}, function() { // After the state was set.
				this.updateSearchResults();
			} );
		}
	}

	/**
	 * Performs a search with the searchstring saved in the state and sets the results property of the state to the results found.
	 */
	updateSearchResults() {
		this.setState( {
			searching: true
		} );
		this.getSearchResults( this.state.searchString ).then( function( searchResults ) {
			this.setState( {
				results: searchResults,
				errorMessage: '',
				searching: false
			} );
		}.bind( this ) ).catch( function( error ) {
			this.setState( {
				errorMessage: error.message,
				searching: false
			} );
		}.bind( this ) );
	}

	/**
	 * Performs a search with a given searchstring on the algolia index which information was passed in the AlgoliaSearcher's props.
	 *
	 * @param string searchString The words or sentence to get the results for.
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
	 * Sets all values required to display the detail view of a search result.
	 *
	 * @param int resultArrayIndex The index of the article you want to show in the state.results array.
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
			usedQueries: usedQueries
		} );
	}

	/**
	 * Hide the detail page and returns to the results page.
	 */
	hideDetail() {
		this.setState( { showDetail: false } );
	}

	/**
	 * Renders the search results list.
	 *
	 * @returns {JSX} A div with either the search results, or a div with a message that no results were found.
	 */
	renderSearchResults() {
		var searchResultContent;
		if ( this.state.results.length > 0 ) {
            var results = this.state.results.map( ( result, arrayIndex ) => {
                return <SearchResult key={result.objectID} post={result}
                                     showDetail={this.showDetail.bind( this, arrayIndex )}/>
            } );
			searchResultContent = <div className="wpseo-kb-search-results">{results}</div>;
		}
		else {
			searchResultContent = <div className="wpseo-kb-search-no-results">{this.props.noResultsText}</div>;
		}
		return searchResultContent;
	}

	/**
	 * Renders the navigation links with the article content.
	 *
	 * @returns {JSX} A div with navigation buttons an the content of the selected acticle.
	 */
    renderDetail() {
        let detailIndex = this.state.showDetail;
        let post = this.state.results[ detailIndex ];
        return (
            <div className="wpseo-kb-search-detail">
				<div className="wpseo-kb-search-navigation">
					<button className="button dashicon-button wpseo-kb-search-back-button"
					   onClick={this.hideDetail}>
						{this.props.back}
					</button>
					<a href={post.permalink}
					   className="button dashicon-button wpseo-kb-search-ext-link "
						target="_blank">
						{this.props.open}
					</a>
				</div>
                <ArticleContent post={post}/>
            </div>
        );
    }

	/**
	 * Logs any occuring error and renders a warning that the search was not completed successfully.
	 *
	 * @param String errorMessage The message to display.
	 * @returns {JSX} A div with a warning that the search was not completed.
     */
    renderError( errorMessage ) {
		console.err( errorMessage );
        return (
            <div>
				{this.props.errorMessage}
            </div>
        );
    }

    /**
	 * Is called upon state change. It determines what view to render and renders it.
	 *
	 * @returns {JSX} The content of the component.
	 */
	render() {
        var content = '';
        var searchBar = <SearchBar headingText={this.props.headingText} submitAction={this.searchButtonClicked}
                                   searchString={this.state.searchString}/>;
        if ( this.state.errorMessage ) { // Show an error message.
            content = (
                <div>
                    {searchBar}
                    {this.renderError( this.state.errorMessage )}
                </div>
            );
        }
        else if ( this.state.searching ) { // Show a loading indicator.
            content = (
                <div>
                    {searchBar}
                    <Loading loadingPlaceholder={this.props.loadingPlaceholder}/>
                </div>
            );
        }
        else if ( this.state.showDetail === false ) { // Show the list of search results if the postId for the detail view isn't set.
            content = (
                <div>
                    {searchBar}
                    {this.renderSearchResults()}
                </div>
            );
        }
        else { // Else show the article content/detail view.
            content = this.renderDetail();
        }
        return <div className="wpseo-kb-search-container">{content}</div>
    }
}

AlgoliaSearcher.propTypes = {
	noResultsText: React.PropTypes.string,
	headingText: React.PropTypes.string,
	algoliaApplicationId: React.PropTypes.string.isRequired,
	algoliaApiKey: React.PropTypes.string.isRequired,
	algoliaIndexName: React.PropTypes.string.isRequired,
	errorMessage: React.PropTypes.string.isRequired,
	loadingPlaceholder: React.PropTypes.string.isRequired,
	open: React.PropTypes.string.isRequired,
	back: React.PropTypes.string.isRequired,
};

AlgoliaSearcher.defaultProps = {
	noResultsText: 'No results found.',
	headingText: 'Search the Yoast knowledge base',
	algoliaApplicationId: 'RC8G2UCWJK',
	algoliaApiKey: '459903434a7963f83e7d4cd9bfe89c0d',
	algoliaIndexName: 'edge_testall',
	errorMessage: 'Something went wrong. Please try again later.',
	loadingPlaceholder: 'Loading...',
	back: 'Back',
	open: 'Open',
};

/**
 * Gives the JSX to render the searchbar.
 *
 * @param props
 * @returns {JSX} A div with the searchbar.
 * @constructor
 */
const SearchBar = ( props ) => {
	return (
		<div className="wpseo-kb-search-search-bar">
			<h2>{props.headingText}</h2>
			<form onSubmit={function( evt ){ evt.preventDefault(); props.submitAction( evt ) } }>
				<input type="text"
					   defaultValue={props.searchString}/>
				<button type="submit" className="button wpseo-kb-search-search-button">Search</button>
			</form>
		</div>
	)
};

/**
 * Gives the JSX to render a single searchresult.
 *
 * @param props
 * @returns {JSX} A div with a single searchresult.
 * @constructor
 */
const SearchResult = ( props ) => {
	let post = props.post;
	let description = post.excerpt || post.metadesc;
	return (
		<div>
			<a onClick={props.showDetail} className="wpseo-kb-search-result-link">
				<div className="wpseo-kb-search-result">
					<h3 className="wpseo-kb-search-result-title">{post.post_title}</h3>
					<p>{description}</p>
				</div>
			</a>
		</div>
	);
};

/**
 * Gives the JSX to render the content of the selected article.
 *
 * @param props
 * @returns {JSX} A div with the content of the selected article
 * @constructor
 */
const ArticleContent = ( props ) => {
	let post = props.post;
	return (
		<iframe src={uri} className="kb-search-content-frame"/>
	);
};

/**
 * Gives the JSX to render a loading indicator.
 *
 * @returns {JSX} A div with a loading indicator.
 * @constructor
 */
const Loading = ( props ) => {
	return (
		<div className="wpseo-kb-loader">{props.loadingPlaceholder}</div>
	);
};

export default AlgoliaSearcher;
