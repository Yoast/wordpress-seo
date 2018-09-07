import React from "react";
import IFrame from "../basic/IFrame";
import PropTypes from "prop-types";
import styled from "styled-components";

const ArticleContentFullWidth = styled( IFrame )`
	width: 100%;
	height: 600px;
	border: none;
`;

/**
 * Creates the JSX to render the content of the selected article.
 *
 * @param {object} props The React props.
 * @returns {ReactElement} An iFrame with the content of the selected article.
 * @constructor
 */

class ArticleContent extends React.Component {
	/**
	 * Constructs the article content.
	 *
	 * @param {Object} props The props for the article content.
	 */
	constructor( props ) {
		super( props );
	}

	/**
	 * Transforms a given URL to an AMP URL.
	 *
	 * @param {string} originalUrl The original URL.
	 *
	 * @returns {string} The AMP URL.
	 */
	toAmp( originalUrl ) {
		return `${ originalUrl }amp/?source=wpseo-kb-search`;
	}

	/**
	 * Renders the article content with the AMP URL.
	 *
	 * @returns {ReactElement} The rendered element.
	 */
	render() {
		return ( <ArticleContentFullWidth
			src={ this.toAmp( this.props.post.permalink ) }
			className="kb-search-content-frame"
			title={ this.props.title }
		         /> );
	}
}

ArticleContent.propTypes = {
	post: PropTypes.object.isRequired,
	title: PropTypes.string,
};

ArticleContent.defaultProps = {
	title: "Knowledge base article",
};

export default ArticleContent;
