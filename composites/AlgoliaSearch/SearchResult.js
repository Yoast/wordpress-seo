import React from "react";
import PropTypes from "prop-types";

/**
 * Overrides the default onClick behavior with a custom one.
 *
 * @param {Event} clickEvent The click event.
 * @param {object} props The React props.
 * @returns {void}
 */
const onClick = ( clickEvent, props ) => {
	clickEvent.preventDefault();
	props.showDetail();
};

/**
 * Create the JSX to render a single searchresult.
 *
 * @param {object} props The React props.
 * @returns {ReactElement} A list item with a single search result.
 * @constructor
 */
const SearchResult = ( props ) => {
	let post = props.post;
	let description = post.excerpt || post.metadesc;
	return (
		<li>
			<a href={ post.permalink }
			   onClick={ ( clickEvent ) => onClick( clickEvent, props ) }
			   className="wpseo-kb-search-result-link">
				<div className="wpseo-kb-search-result">
					<h3 className="wpseo-kb-search-result-title">{ post.post_title }</h3>
					{ description && <p>{ description }</p> }
				</div>
			</a>
		</li>
	);
};

SearchResult.propTypes = {
	post: PropTypes.object,
	showDetail: PropTypes.func,
};

export default SearchResult;
