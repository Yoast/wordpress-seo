import React from "react";

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
			<a href={ post.permalink } onClick={ ( evt ) => {
				evt.preventDefault(); props.showDetail();
			} } className="wpseo-kb-search-result-link">
				<div className="wpseo-kb-search-result">
					<h3 className="wpseo-kb-search-result-title">{ post.post_title }</h3>
					{ description && <p>{ description }</p> }
				</div>
			</a>
		</li>
	);
};

SearchResult.propTypes = {
	post: React.PropTypes.object,
	showDetail: React.PropTypes.func,
};

export default SearchResult;
