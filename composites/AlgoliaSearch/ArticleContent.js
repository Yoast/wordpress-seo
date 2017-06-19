import React from "react";

/**
 * Creates the JSX to render the content of the selected article.
 *
 * @param {object} props The React props.
 * @returns {ReactElement} A div with the content of the selected article.
 * @constructor
 */
const ArticleContent = ( props ) => {
	let url = props.post.permalink + "amp?source=wpseo-kb-search";

	return ( <iframe src={ url } className="kb-search-content-frame" title={ props.iframeTitle } /> );
};

ArticleContent.propTypes = {
	post: React.PropTypes.object,
	iframeTitle: React.PropTypes.string,
};

ArticleContent.defaultProps = {
	iframeTitle: "Knowledge base article",
};

export default ArticleContent;
