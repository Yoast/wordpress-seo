import React from "react";

/**
 * Overrides the default submit action with a custom one.
 *
 * @param {Event} submitEvent The submit event.
 * @param {object} props The React props.
 * @returns {void}
 */
const onSubmit = ( submitEvent, props ) => {
	submitEvent.preventDefault();
	props.submitAction( submitEvent );
};

/**
 * Create the JSX to render the search bar.
 *
 * @param {object} props The React props.
 * @returns {ReactElement} A div with the searchbar.
 * @constructor
 */
const SearchBar = ( props ) => {
	return (
		<div className="wpseo-kb-search-search-bar">
			<h2 id="wpseo-kb-search-heading">{ props.headingText }</h2>
			<form onSubmit={ ( submitEvent ) => onSubmit( submitEvent, props ) }>
				<input type="text" aria-labelledby="wpseo-kb-search-heading" defaultValue={ props.searchString }/>
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
