/**
 * Create the JSX to render the SearchResultDetail component.
 *
 * @param {object} props The React props.
 * @returns {ReactElement} A SearchResultDetail component.
 * @constructor
 */
import React from "react";
import PropTypes from "prop-types";
import ArticleContent from "./ArticleContent";
import styled from "styled-components";
import { defineMessages, injectIntl, intlShape } from "react-intl";

const messages = defineMessages( {
	openButton: {
		id: "searchresultdetail.openbutton",
		defaultMessage: "Open",
	},
	openButtonLabel: {
		id: "searchresultdetail.openbuttonlabel",
		defaultMessage: "Open the knowledge base article in a new window or read it in the iframe below",
	},
	backButton: {
		id: "searchresultdetail.backbutton",
		defaultMessage: "Back",
	},
	backButtonLabel: {
		id: "searchresultdetail.backbuttonlabel",
		defaultMessage: "Back to the search results",
	},
} );

const Detail = styled.section``;

const BackButton = styled.button`
	display: inline-block;
    text-decoration: none;
    font-size: 13px;
    line-height: 24px;
    height: 24px;
    margin: 0;
    padding: 0 10px 1px;
    cursor: pointer;
    border-width: 1px;
    border-style: solid;
    border-radius: 3px;
    white-space: nowrap;
    box-sizing: border-box;
`;

const OpenLink = styled.a`
	display: inline-block;
    text-decoration: none;
    font-size: 13px;
    line-height: 26px;
    height: 28px;
    margin: 0;
    padding: 0 10px 1px;
    cursor: pointer;
    border-width: 1px;
    border-style: solid;
    border-radius: 3px;
    white-space: nowrap;
    box-sizing: border-box;
`;

class SearchResultDetail extends React.Component {

	createNavigation() {
		const formatMessage = this.props.intl.formatMessage;
		const openButtonText = formatMessage( messages.openButton );
		const openButtonLabel = formatMessage( messages.openButtonLabel );
		const backButtonText = formatMessage( messages.backButton );
		const backButtonLabel = formatMessage( messages.backButtonLabel );
		return (
			<nav>
				<BackButton aria-label={ backButtonLabel } onClick={ this.props.onClick }>
					{ backButtonText }
				</BackButton>

				<OpenLink href={ this.props.post.permalink } aria-label={ openButtonLabel } target="_blank">
					{ openButtonText }
				</OpenLink>
			</nav>
		);
	}

	render() {
		return (
			<Detail>
				{ this.createNavigation() }

				<ArticleContent permalink={ this.props.post.permalink } title={ this.props.iframeTitle }/>
			</Detail>
		);
	}
}

SearchResultDetail.propTypes = {
	post: PropTypes.object.isRequired,
	onClick: PropTypes.func.isRequired,
	iframeTitle: PropTypes.string.isRequired,
	intl: intlShape.isRequired,
};

SearchResultDetail.defaultProps = {
};

export default injectIntl( SearchResultDetail );
