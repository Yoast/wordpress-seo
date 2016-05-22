import React from 'react';
import AlgoliaSearch from 'algoliasearch';
import debounce from 'lodash/debounce';

class AlgoliaSearcher extends React.Component {

	constructor( props ) {
		super();
		this.state = {
			searchString: '',
			results: [],
			errorMessage: '',
			showDetail: false,
			searching: false
		};
		this.props = props;
		this.usedQueries = [];
		this.initAlgoliaClient();

		this.searchInputChanged = this.searchInputChanged.bind(this);
		this.hideDetail = this.hideDetail.bind(this);
		this.openExternal = this.openExternal.bind(this);

		this.debouncedUpdateSearchResults = debounce(this.updateSearchResults.bind(this), this.props.debounceTime);
	}

	initAlgoliaClient() {
		this.client = AlgoliaSearch(this.props.algoliaApplicationId, this.props.algoliaApiKey);
		this.index = this.client.initIndex(this.props.algoliaIndexName);
	}

	searchInputChanged( e ) {
		let searchString = e.target.value;
		this.usedQueries.push(searchString);
		this.setState({
						  searchString: searchString
					  });
		this.debouncedUpdateSearchResults();
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
		this.setState({showDetail: resultArrayIndex});
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
			searchResultContent = <div className="kb-search-results">{results}</div>;
		}
		else {
			searchResultContent = <div className="kb-search-results no-results">{this.props.noResultsText}</div>;
		}
		return searchResultContent;
	}

	renderDetail() {
		let detailIndex = this.state.showDetail;
		let post = this.state.results[ detailIndex ];
		return (
			<div className="kb-search-detail">
				<button type="button" className="kb-search-detail-btn button dashicons-before dashicons-arrow-left"
						onClick={this.hideDetail}>
					Back
				</button>
				<button type="button"
						className="kb-search-detail-btn kb-external button dashicons-before dashicons-external"
						onClick={this.openExternal}>
					Open
				</button>
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
		var searchBar = <SearchBar headingText={this.props.headingText} searchInputChanged={this.searchInputChanged}
								   searchString={this.state.searchString}/>;
		if ( this.state.errorMessage ) { // Show an error message.
			content = (
				<div>
					{searchBar}
					{this.renderError(this.state.errorMessage)}
				</div>
			);
		}
		else if ( this.state.searching ) { // Show a loading indicator.
			content = (
				<div>
					{searchBar}
					{Spinner}
					{this.renderSearchResults()}
				</div>
			);
		}
		else if ( this.state.showDetail === false ) { // Show the list of search results if the postId for the detail view isn't set.
			content = (
				<div>
					{searchBar}
					{Spinner}
					{this.renderSearchResults()}
				</div>
			);
		}
		else { // Else show the article content/detail view
			content = this.renderDetail();
		}
		return <div className="wpseo-kb-search-container">{Spinner}{content}</div>
	}
}

AlgoliaSearcher.propTypes = {
	debounceTime: React.PropTypes.number.isRequired,
	noResultsText: React.PropTypes.string,
	headingText: React.PropTypes.string,
	algoliaApplicationId: React.PropTypes.string.isRequired,
	algoliaApiKey: React.PropTypes.string.isRequired,
	algoliaIndexName: React.PropTypes.string.isRequired
};

AlgoliaSearcher.defaultProps = {
	debounceTime: 300,
	noResultsText: 'No results found.',
	headingText: 'Search the Yoast knowledge base',
	algoliaApplicationId: 'RC8G2UCWJK',
	algoliaApiKey: '459903434a7963f83e7d4cd9bfe89c0d',
	algoliaIndexName: 'acceptance_all'
};


const SearchBar = ( props ) => {
	return (
		<div>
			<h2>{props.headingText}</h2>
			<input type="text" onkeypress="preventDefault()" onChange={props.searchInputChanged}
				   value={props.searchString}/>
			<hr/>
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

const Spinner = () => {
	return (
		<div>
			<div class="spinner">
				<div class="bounce1"></div>
				<div class="bounce2"></div>
				<div class="bounce3"></div>
			</div>
		</div>
	);
};
export default AlgoliaSearcher;

