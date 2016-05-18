import React from 'react';
import AlgoliaSearch from 'algoliasearch';
import debounce from 'lodash/debounce';
// import ReactDom from 'react-dom';

class AlgoliaSearcher extends React.Component {

    constructor(props){
        super();
        this.state = {
            searchString: '',
            results: [],
            errorMessage: '',
            showDetail: false
        };
        this.props = props;
        this.usedQueries = [];
        this.initAlgoliaClient();

        this.searchInputChanged = this.searchInputChanged.bind(this);
        this.hideDetail = this.hideDetail.bind(this);

        this.debouncedUpdateSearchResults = debounce(this.updateSearchResults.bind(this), this.props.debounceTime);
    }

    initAlgoliaClient(){
        this.client = AlgoliaSearch(this.props.algoliaApplicationId, this.props.algoliaApiKey);
        this.index = this.client.initIndex(this.props.algoliaIndexName);
    }

    searchInputChanged(e){
        this.searchString = e.target.value;
        this.usedQueries.push(this.searchString);
        this.debouncedUpdateSearchResults();
    }

    updateSearchResults(){
        let searchString = this.searchString;
        this.getSearchResults(searchString).then(function(searchResults){
            this.setState({
                searchString: searchString,
                results: searchResults,
                errorMessage: ''
            })
        }.bind(this)).catch(function(error){
            this.setState({
                searchString: searchString,
                errorMessage: error.message
            })
        }.bind(this));
    }

    getSearchResults(searchString){
        return new Promise(function(resolve, reject){
            this.index.search(searchString, function(err, data){
                if (err){
                    reject(err);
                    return;
                }
                resolve(data.hits);
            });
        }.bind(this));
    }

    showDetail(resultArrayIndex){
        this.setState({showDetail: resultArrayIndex});
    }

    hideDetail(){
        this.setState({showDetail: false});
    }

    renderSearchResults(){
        var searchResultContent;
        if (this.state.results.length > 0){
            var results = this.state.results.map((result, arrayIndex) =>{
                return <SearchResult key={result.objectID} post={result}
                                     showDetail={this.showDetail.bind(this, arrayIndex)}/>
            });
            searchResultContent = <div className="kb-search-results">{results}</div>;
        } else{
            searchResultContent = <div className="kb-search-results no-results">{this.props.noResultsText}</div>;
        }
        return searchResultContent;
    }

    renderDetail(){
        let detailIndex = this.state.showDetail;
        let post = this.state.results[detailIndex];
        return (
            <div className="kb-search-detail">
                <button onClick={this.hideDetail}>&lt;-</button>
                <a href={post.permalink} target="_blank">Read this article in {post.source}.</a>
                <ArticleContent post={post}/>
            </div>
        );
    }

    renderError(errorMessage){
        return (
            <div>
                An error has occurred:<br/>
                {errorMessage}
            </div>
        );
    }

    render(){
        var searchBar = <SearchBar headingText={this.props.headingText} searchInputChanged={this.searchInputChanged}/>;
        if (this.state.errorMessage){
            return (
                <div>
                    {searchBar}
                    {this.renderError(this.state.errorMessage)}
                </div>
            );
        }
        if (this.state.showDetail === false){ // if showDetail is not false, render the search results
            return (
                <div>
                    {searchBar}
                    {this.renderSearchResults()}
                </div>
            );
        }
        //else show the article content/detail view
        return this.renderDetail();
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


const SearchBar = (props) =>{
    return (
        <div>
            <h2>{props.headingText}</h2>
            <input type="text" onChange={props.searchInputChanged}/>
            <hr/>
        </div>
    )
};

const SearchResult = (props) =>{
    let post = props.post;
    let description = post.excerpt || post.metadesc;
    return (
        <div className="wpseo-kb-search-result">
            <a onClick={props.showDetail}>
                <div>
                    <h3 className="wpseo-kb-search-result-title">{post.post_title}</h3>
                    <span className="wpseo-kb-search-result-link">
                        {post.permalink}
                        </span>
                    <p>{description}</p>
                </div>
            </a>
        </div>
    );
};

const ArticleContent = (props) =>{
    let post = props.post;
    return (
        <div>
            <h3>{post.post_title}</h3>
            <article>
                <div dangerouslySetInnerHTML={{__html: post.post_content}}></div>
            </article>
        </div>
    )
};

export default AlgoliaSearcher

