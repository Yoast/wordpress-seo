import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import styled from "styled-components";
import colors from "style-guide/colors.json";
import PropTypes from "prop-types";


const messages = defineMessages( {
	validationFormatURL: {
		id: "validation.format.keyword",
		message: "Are you trying to use multiple keywords? You should add them separately below.",
	},
} );

const KeywordField = styled.input`
	margin-right: 0.5em;
`;

const WarningMessage = styled.div`
	padding: 1em;
	background-color: ${ colors.$color_yellow };
	margin: 0.5em 0 0 0;
	overflow: auto;
	display: flex;
	align-items: center;
	justify-content: flex-start;
`;

const ErrorText = styled.div`
	font-size: 1em;
	color: ${ colors.$color_red};
	margin: 1em 0;
	min-height: 1.8em;
`;

class KeywordInput extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			showErrorMessage: false,
			keyword: props.keyword,
		};
	}

	checkKeywordInput( keywordText ) {
		let separatedWords = keywordText.split( "," );
		if ( separatedWords.length > 1) {
			this.setState( { showErrorMessage: true } );
		}
	}

	displayErrorMessage( input = "" ) {
		if ( this.state.showErrorMessage && input !== "" ) {
			return (
				<ErrorText>
					<FormattedMessage
						id="sites.addSite.urlValidationMessage"
						defaultMessage={ messages.message }
						role="alert"
					/>
				</ErrorText>
			);
		}
		return (
			<ErrorText />
		);
	}

	handleChange( event ) {
		this.setState( { keyword: event.target.keyword }, () => this.props.onChange( this.state.keyword ) );
		this.checkKeywordInput( event.target.keyword );
	}

	render() {
		return(
			<React.Fragment>
				<KeywordField type="text" id={ this.props.id } onChange={ this.handleChange.bind( this ) }>
					<label htmlFor={ this.props.id }>
						{ this.props.label }
					</label>
				</KeywordField>
				<WarningMessage error={ this.state.showErrorMessage } />

				{ this.displayErrorMessage( this.props.keyword ) }
			</React.Fragment>
		);
	}
}

KeywordInput.propTypes = {
	id: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	label: PropTypes.oneOfType( [
		PropTypes.string,
		PropTypes.array,
	] ).isRequired,
	keyword: PropTypes.string,
};

KeywordInput.defaultProps = {
	keyword: "",
};

export default KeywordInput;
