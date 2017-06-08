import React from "react";

/**
 * Create the JSX to render the search bar.
 *
 * @param {object} props The React props.
 * @returns {JSX} A div with the searchbar.
 * @constructor
 */
const SearchBar = ( props ) => {
	return (
		<div className="wpseo-kb-search-search-bar">
			<h2 id="wpseo-kb-search-heading">{props.headingText}</h2>
			<form onSubmit={ ( evt ) => {
				evt.preventDefault(); props.submitAction( evt );
			} }>
				<input type="text" aria-labelledby="wpseo-kb-search-heading"
				       defaultValue={ props.searchString }/>
				<button type="submit" className="button wpseo-kb-search-search-button">{ props.searchButtonText }</button>
			</form>
		</div>
	);
};

SearchBar.propTypes = {
	headingText: React.PropTypes.string,
	searchButtonText: React.PropTypes.string,
	searchString: React.PropTypes.string,
	submitAction: React.PropTypes.func,
};

SearchBar.defaultProps = {
	headingText: "Search the Yoast knowledge base",
	searchButtonText: "Search",
};

export default SearchBar;
