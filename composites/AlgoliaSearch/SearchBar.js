import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { intlShape, injectIntl, defineMessages } from "react-intl";
import debounce from "lodash/debounce";

import colors from "../../style-guide/colors.json";
import SearchIcon from "../../style-guide/svg/search.svg";
import { Icon } from "../Plugin/Shared/components/Icon";
import { YoastButton } from "../Plugin/Shared/components/YoastButton";
import breakpoints from "../../style-guide/responsive-breakpoints.json";

const messages = defineMessages( {
	headingText: {
		id: "searchBar.headingText",
		defaultMessage: "Search the Yoast knowledge base",
	},
	placeholderText: {
		id: "searchBar.placeholderText",
		defaultMessage: "Search the knowledge base",
	},
	buttonText: {
		id: "searchBar.buttonText",
		defaultMessage: "Search",
	},
} );

const SearchBarWrapper = styled.div`

	form {
		display: flex;

		@media screen and ( max-width: ${ breakpoints.mobile } ) {
			flex-wrap: wrap;
		}
	}

	@media screen and ( max-width: ${ breakpoints.mobile } ) {
		button {
			min-width: 100%;
			margin-top: 1em;
		}
	}
`;

const SearchHeading = styled.h2`
	// !important to override WP rules.
	font-size: 1em !important;
	margin: 0.5em 0 0.5em 58px !important;
	padding: 0 !important;
	font-weight: 600 !important;

	@media screen and ( max-width: ${ breakpoints.mobile } ) {
		margin-left: 0;
	}
`;

const SearchLabel = styled.label`
	flex: 0 0 42px;
	height: 48px;
	// This label is already a flex item to be aligned with its siblings.
	// By making it also a flex container, we can align the SVG icon.
	display: inline-flex;
	align-items: center;
`;

const SearchBarInput = styled.input`
	// Increase specificity to override WP rules.
	&& {
		flex: 1 1 auto;
		box-sizing: border-box;
		height: 48px;
		box-shadow: inset 0 2px 8px 0px rgba( 0, 0, 0, 0.3 );
		background: ${ colors.$color_grey_light };
		border: 1px solid transparent;
		font-size: 1em;
		margin-right: 24px;
		padding: 0 8px 0 16px;

		:focus {
			box-shadow:
				inset 0 2px 8px 0px rgba( 0, 0, 0, 0.3 ),
				0 0 2px rgba( 30, 140, 190, 0.8 );
		}

		@media screen and ( max-width: ${ breakpoints.mobile } ) {
			margin-right: 0;
		}
	}
`;

/**
 * Create the JSX to render the search bar.
 *
 * @param {object} props The React props.
 *
 * @returns {ReactElement} The SearchBar component.
 */
class SearchBar extends React.Component {
	/**
	 * Constructs the component and sets its initial state.
	 *
	 * @param {Object} props The props to use for this component.
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
	 * @param {object} event React SyntheticEvent.
	 *
	 * @returns {void}
	 */
	onSearchChange( event ) {
		/*
		 * Manual search: the form already handles the submit event taking the
		 * search string from the state so the state needs to be updated.
		 */
		if ( ! this.props.enableLiveSearch ) {
			this.setState( { searchString: event.target.value } );
			return;
		}

		/*
		 * Live search "while typing": update the state searchString and
		 * debounce the form submission.
		 */
		event.persist();
		this.setState( { searchString: event.target.value }, () => {
			this.doFormSubmission( this.state.searchString );
		} );
	}

	/**
	 * Handles the submit event on the SearchBar.
	 *
	 * @param {object} event React SyntheticEvent.
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
		const placeholderText = this.props.intl.formatMessage( messages.placeholderText );

		return (
			<SearchBarWrapper role="search">
				<SearchHeading>
					{ headingText }
				</SearchHeading>
				<form onSubmit={ this.onSubmit.bind( this ) }>
					<SearchLabel htmlFor="kb-search-input">
						<Icon icon={ SearchIcon } color="inherit" size="30px" />
						<span className="screen-reader-text">
							{ headingText }
						</span>
					</SearchLabel>
					<SearchBarInput
						onChange={ this.onSearchChange.bind( this ) }
						type="text"
						id="kb-search-input"
						name="search-input"
						defaultValue={ this.props.searchString }
						autoComplete="off"
						autoCorrect="off"
						autoCapitalize="off"
						spellCheck="false"
						placeholder={ placeholderText }
					/>
					{ ! this.props.enableLiveSearch && <YoastButton type="submit">
							{ this.props.intl.formatMessage( messages.buttonText ) }
						</YoastButton>
					}
				</form>
			</SearchBarWrapper>
		);
	}
}

SearchBar.propTypes = {
	searchString: PropTypes.string,
	submitAction: PropTypes.func,
	intl: intlShape.isRequired,
	enableLiveSearch: PropTypes.bool,
};

SearchBar.defaultProps = {
};

export default injectIntl( SearchBar );
