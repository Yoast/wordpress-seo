import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { intlShape, injectIntl, defineMessages } from "react-intl";
import debounce from "lodash/debounce";

import colors from "../../style-guide/colors.json";
import SearchIcon from "../../style-guide/svg/search.svg";
import { Icon } from "../Plugin/Shared/components/Icon";

const messages = defineMessages( {
	headingText: {
		id: "searchbar.headingtext",
		defaultMessage: "Search the Yoast knowledge base",
	},
} );

const SearchLabel = styled.label`
	width: 2em;
	height: 2em;
	float: left;
	margin-top: 0.25em;
`;

const SearchBarWrapper = styled.div`
	overflow: hidden;
	width: 100%;
`;

const SearchBarInput = styled.input`
	box-sizing: border-box;
	height: 2.5em;
	width: calc(100% - 2em);
	box-shadow: inset 0 2px 8px 0px rgba(0,0,0,0.3);
	background: ${ colors.$color_grey_light };
	border: 0;
	font-size: 1em;
	float: left;
	padding-left: 16px;
`;

const SearchHeading = styled.h2`
	font-size: 1em;
	margin: 0.5em 0;
`;

/**
 * Create the JSX to render the search bar.
 *
 * @param {object} props The React props.
 * @returns {ReactElement} A div with the searchbar.
 * @constructor
 */
class SearchBar extends React.Component {

	/**
	 * Constructs the component and sets its initial state.
	 *
	 * @param {Object} props The props to use for this component.
	 *
	 * @constructor
	 */
	constructor( props ) {
		super( props );

		this.state = {
			doRequest: false,
			searchString: "",
		};

		this.doFormSubmission = debounce( ( searchString ) => {
			this.props.submitAction( searchString );
		}, 1000 );
	}

	/**
	 * Cancel form submission on unmount.
	 *
	 * @returns {void}
	 */
	componentWillUnmount() {
		this.doFormSubmission.cancel();
	}

	/**
	 * Handles the change event on the SearchBar.
	 *
	 * @param {DOMEvent} event The event being triggered on the SearchBar.
	 *
	 * @returns {void}
	 */
	onSearchChange( event ) {
		event.persist();
		this.setState( { searchString: event.target.value }, () => {
			this.doFormSubmission( this.state.searchString );
		} );
	}

	/**
	 * Handles the search bar form submit.
	 *
	 * @param {DOMEvent} event The event being triggered on the SearchBar.
	 *
	 * @returns {void}
	 */
	onSubmit( event ) {
		event.preventDefault();
		this.doFormSubmission.cancel();
		this.props.submitAction( this.state.searchString );
	}

	/**
	 * Renders the SearchBar component.
	 *
	 * @returns {ReactElement} The SearchBar component.
	 */
	render() {
		const headingText = this.props.intl.formatMessage( messages.headingText );
		return (
			<SearchBarWrapper role="search">
				<SearchHeading>
					{ headingText }
				</SearchHeading>
				<form onSubmit={ this.onSubmit.bind( this ) }>
					<SearchLabel htmlFor="search-input">
						<Icon icon={ SearchIcon } color="inherit" size="30px" />
						<span className="screen-reader-text">
							{ headingText }
						</span>
					</SearchLabel>
					<SearchBarInput
						onChange={ this.onSearchChange.bind( this ) }
						type="text"
						name="search-input"
						id="search-input"
						defaultValue={ this.props.searchString }
						autoComplete="off"
						autoCorrect="off"
						autoCapitalize="off"
						spellCheck="false"
					/>
				</form>
			</SearchBarWrapper>
		);
	}
}

SearchBar.propTypes = {
	searchString: PropTypes.string,
	submitAction: PropTypes.func,
	intl: intlShape.isRequired,
};

SearchBar.defaultProps = {
};

export default injectIntl( SearchBar );
