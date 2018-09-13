import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

/**
 * @typedef  {Object}     Feed
 * @property {string}     title       The title of the website.
 * @property {string}     description A description of the website.
 * @property {string}     link        A link to the website.
 * @property {FeedItem[]} items       The items in the feed.
 */

/**
 * @typedef  {Object} FeedItem
 * @property {string} title       The title of the item.
 * @property {string} content     The content of the item, will be HTML encoded.
 * @property {string} description A summary of the content, will be HTML encoded.
 * @property {string} link        A link to the item.
 * @property {string} creator     The creator of the item.
 * @property {string} date        The publication date of the item.
 */

const WordpressFeedContainer = styled.div`
	box-sizing: border-box;

	p, a {
		font-size: 14px;
		margin: 0;
	}
`;

const WordpressFeedHeader = styled.h3`
	margin: 8px 0;
	font-size: 1em;
`;

const WordpressFeedList = styled.ul`
	margin: 0;
	list-style: none;
	padding: 0;
`;

const WordpressFeedLink = styled.a`
	display: inline-block;
	padding-bottom: 4px;
`;

const A11yNotice = styled.span`
	border: 0;
	clip: rect(1px, 1px, 1px, 1px);
	clip-path: inset(50%);
	height: 1px;
	margin: -1px;
	overflow: hidden;
	padding: 0;
	position: absolute !important;
	width: 1px;
	word-wrap: normal !important;
`;

const WordpressFeedListItemContainer = styled.li`
	margin: 8px 0;
	overflow: hidden;
`;

const WordpressFeedFooter = styled.div`
	a {
		margin: 8px 0 0;
	}
`;

const WordpressFeedListItem = ( props ) => {
	return (
		<WordpressFeedListItemContainer
			className={ props.className }
		>
			<WordpressFeedLink
				className={ `${ props.className }-link` }
				href={ props.link }
				target="_blank"
				rel="noopener noreferrer"
			>
				{ props.title }
				<A11yNotice>
					( Opens in a new browser tab )
				</A11yNotice>
			</WordpressFeedLink>
			<p className={ `${ props.className }-description` }>
				{ props.description }
			</p>
		</WordpressFeedListItemContainer>
	);
};

WordpressFeedListItem.propTypes = {
	className: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	link: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
};

/**
 * Displays a parsed wordpress feed.
 *
 * @param {Object} props            The component props.
 * @param {Feed} props.feed         The feed object.
 * @param {string} props.title      The title. Defaults to feed title.
 * @param {string} props.footerHtml The footer HTML contents.
 * @param {string} props.feedLink   The footer link. Defaults to feed link.
 *
 * @returns {ReactElement} The WordpressFeed component.
 */
const WordpressFeed = ( props ) => {
	return (
		<WordpressFeedContainer
			className={ props.className }
		>
			<WordpressFeedHeader
				className={ `${ props.className }__header` }
			>
				{ props.title ? props.title : props.feed.title }
			</WordpressFeedHeader>
			<WordpressFeedList
				className={ `${ props.className }__posts` }
				role="list"
			>
				{ props.feed.items.map( item => (
					<WordpressFeedListItem
						className={ `${ props.className }__post` }
						key={ item.link }
						title={ item.title }
						link={ item.link }
						description={ item.description }
					/>
				) ) }
			</WordpressFeedList>
			{ props.footerHtml &&
				<WordpressFeedFooter
					className={ `${ props.className }__footer` }
				>
					<WordpressFeedLink
						className={ `${ props.className }__footer-link` }
						href={ props.feedLink ? props.feedLink : props.feed.link }
						target="_blank"
						rel="noopener noreferrer"
						dangerouslySetInnerHTML={ { __html: props.footerHtml } }
					/>
				</WordpressFeedFooter>
			}
		</WordpressFeedContainer>
	);
};

WordpressFeed.propTypes = {
	className: PropTypes.string,
	feed: PropTypes.object.isRequired,
	title: PropTypes.string,
	footerHtml: PropTypes.string,
	feedLink: PropTypes.string,
};

WordpressFeed.defaultProps = {
	className: "wordpress-feed",
};

export default WordpressFeed;
