import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { defineMessages, injectIntl, intlShape } from "react-intl";

import ArticleContent from "./ArticleContent";
import { Button } from "../Plugin/Shared/components/Button";

const messages = defineMessages( {
	openButton: {
		id: "searchresultdetail.openbutton",
		defaultMessage: "View in KB",
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

const Nav = styled.nav`
	padding: 8px;
`;

const OpenLink = styled.a`
	float: right;
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

/**
 * Create the JSX to render the SearchResultDetail component.
 *
 * @param {object} props The React props.
 * @returns {ReactElement} A SearchResultDetail component.
 * @constructor
 */
class SearchResultDetail extends React.Component {

	createNavigation() {
		const formatMessage = this.props.intl.formatMessage;
		const openButtonText = formatMessage( messages.openButton );
		const openButtonLabel = formatMessage( messages.openButtonLabel );
		const backButtonText = formatMessage( messages.backButton );
		const backButtonLabel = formatMessage( messages.backButtonLabel );
		return (
			<Nav>
				<Button aria-label={ backButtonLabel } onClick={ this.props.onClick }>
					{ backButtonText }
				</Button>
				<OpenLink href={ this.props.post.permalink } aria-label={ openButtonLabel } target="_blank">
					{ openButtonText }
				</OpenLink>
			</Nav>
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

export default injectIntl( SearchResultDetail );
