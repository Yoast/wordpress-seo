import React from 'react';
import AlgoliaSearch from 'algoliasearch';

class AlgoliaSearcher extends React.Component {

	constructor( props ) {
		super();
		this.state = {
			searchString: '',
			usedQueries: {},
			results: [],
			errorMessage: '',
			showDetail: false,
			searching: false
		};
		this.props = props;
		this.initAlgoliaClient();

		this.searchButtonClicked = this.searchButtonClicked.bind(this);
		this.hideDetail = this.hideDetail.bind(this);
		this.openExternal = this.openExternal.bind(this);
	}

	initAlgoliaClient() {
		this.client = AlgoliaSearch(this.props.algoliaApplicationId, this.props.algoliaApiKey);
		this.index = this.client.initIndex(this.props.algoliaIndexName);
	}

	searchButtonClicked( e ) {
		let searchString = e.target.getElementsByTagName('input')[ 0 ].value;
		if ( searchString != '' ) {
			let usedQueries = this.state.usedQueries;
			if ( usedQueries[ searchString ] == undefined ) {
				usedQueries[ searchString ] = {};
			}
			this.setState({
							  searchString: searchString,
							  usedQueries: usedQueries
						  }, function() { // after the state was set
				this.updateSearchResults();
			});
		}
	}

	updateSearchResults() {
		this.setState({
						  searching: true
					  });
		this.getSearchResults(this.state.searchString).then(function( searchResults ) {
			this.setState({
							  results: searchResults,
							  errorMessage: '',
							  searching: false
						  });
		}.bind(this)).catch(function( error ) {
			this.setState({
							  errorMessage: error.message,
							  searching: false
						  });
		}.bind(this));
	}

	getSearchResults( searchString ) {
		return new Promise(function( resolve, reject ) {
			this.index.search(searchString, function( err, data ) {
				if ( err ) {
					reject(err);
					return;
				}
				resolve(data.hits);
			});
		}.bind(this));
	}

	showDetail( resultArrayIndex ) {
		let usedQueries = this.state.usedQueries;
		let post = this.state.results[ resultArrayIndex ];
		let postId = post.objectID;
		let articleTitle = post.post_title;
		let articleLink = post.permalink;
		usedQueries[ this.state.searchString ][postId] = {title: articleTitle, link: articleLink};
		this.setState({
						  showDetail: resultArrayIndex,
						  usedQueries: usedQueries
					  });
	}

	hideDetail() {
		this.setState({showDetail: false});
	}

	openExternal() {
		let currentPost = this.state.results[ this.state.showDetail ];
		window.open(currentPost.permalink, "_blank");
	}

	renderSearchResults() {
		var searchResultContent;
		if ( this.state.results.length > 0 ) {
			var results = this.state.results.map(( result, arrayIndex ) => {
				return <SearchResult key={result.objectID} post={result}
									 showDetail={this.showDetail.bind(this, arrayIndex)}/>
			});
			searchResultContent = <div className="wpseo-kb-search-results">{results}</div>;
		}
		else {
			searchResultContent = <div className="wpseo-kb-search-no-results">{this.props.noResultsText}</div>;
		}
		return searchResultContent;
	}

	renderDetail() {
		let detailIndex = this.state.showDetail;
		let post = this.state.results[ detailIndex ];
		return (
			<div className="wpseo-kb-search-detail">
				<a href="#"
				   onClick={this.hideDetail}>
					<span className="dashicons dashicons-arrow-left"/>
					Back
				</a>
				<a href={post.permalink}
				   className="wpseo-kb-search-ext-link">
					<span className="dashicons dashicons-external"/>
					Open
				</a>
				<ArticleContent post={post}/>
			</div>
		);
	}

	renderError( errorMessage ) {
		return (
			<div>
				An error has occurred:<br/>
				{errorMessage}
			</div>
		);
	}

	render() {
		var content = '';
		var searchBar = <SearchBar headingText={this.props.headingText} submitAction={this.searchButtonClicked}
								   searchString={this.state.searchString}/>;
		if ( this.state.errorMessage ) { // Show an error message.
			content = (
				<div>
					{searchBar}
					{this.renderError(this.state.errorMessage)}
				</div>
			);
		}
		else if ( this.state.searching ) { // Show a loading indicator (while not hiding the previous results).
			content = (
				<div>
					{searchBar}
					<Loading/>
					{this.renderSearchResults()}
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
		else { // Else show the article content/detail view
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
	algoliaIndexName: React.PropTypes.string.isRequired
};

AlgoliaSearcher.defaultProps = {
	noResultsText: 'No results found.',
	headingText: 'Search the Yoast knowledge base',
	algoliaApplicationId: 'RC8G2UCWJK',
	algoliaApiKey: '459903434a7963f83e7d4cd9bfe89c0d',
	algoliaIndexName: 'acceptance_all'
};


const SearchBar = ( props ) => {
	return (
		<div className="wpseo-kb-search-search-bar">
			<h2>{props.headingText}</h2>
			<form onSubmit={function(e){e.preventDefault(); props.submitAction(e)}}>
				<input type="text"
					   defaultValue={props.searchString}/>
				<button type="submit" className="button wpseo-kb-search-search-button">Search</button>
			</form>
		</div>
	)
};

const SearchResult = ( props ) => {
	let post = props.post;
	let description = post.excerpt || post.metadesc;
	return (
		<div >
			<a onClick={props.showDetail} className="wpseo-kb-search-result-link">
				<div className="wpseo-kb-search-result">
					<h3 className="wpseo-kb-search-result-title">{post.post_title}</h3>
					<p>{description}</p>
				</div>
			</a>
		</div>
	);
};

const ArticleContent = ( props ) => {
	let post = props.post;
	return (
		<div>
			<h3>{post.post_title}</h3>
			<article>
				<div dangerouslySetInnerHTML={{__html: post.post_content}}></div>
			</article>
		</div>
	);
};

const Loading = () => {
	return (
		<div className="wpseo-kb-loader">Loading...</div>
	);
};
export default AlgoliaSearcher;
