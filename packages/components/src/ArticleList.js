/* External dependencies */
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

/* Yoast dependencies */
import { makeOutboundLink } from "@yoast/helpers";

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

const ArticleListContainer = styled.div`
	box-sizing: border-box;

	p {
		margin: 0;
		font-size: 14px;
	}
`;

const ArticleListHeader = styled.h3`
	margin: 8px 0;
	font-size: 1em;
`;

const FeedList = styled.ul`
	margin: 0;
	list-style: none;
	padding: 0;
`;

const ArticleListLink = makeOutboundLink( styled.a`
	display: inline-block;
	margin-bottom: 4px;
	font-size: 14px;
` );

const ArticleListItemContainer = styled.li`
	margin: 8px 0;
`;

const ArticleListFooter = styled.div`
	a {
		margin: 8px 0 0;
	}
`;

/**
 * The WordpressFeedListItem component.
 *
 * @param {object} props The component's props.
 *
 * @returns {ReactElement} The WordpressFeedListItem component.
 */
const ArticleListItem = ( props ) => {
	return (
		<ArticleListItemContainer
			className={ props.className }
		>
			<ArticleListLink
				className={ `${ props.className }-link` }
				href={ props.link }
			>
				{ props.title }
			</ArticleListLink>
			<p className={ `${ props.className }-description` }>
				{ props.description }
			</p>
		</ArticleListItemContainer>
	);
};

ArticleListItem.propTypes = {
	className: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	link: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
};

/**
 * Displays a parsed wordpress feed.
 *
 * @param {Object} props                The component props.
 * @param {Feed}   props.feed           The feed object.
 * @param {string} props.title          The title. Defaults to feed title.
 * @param {string} props.footerLinkText The footer link text.
 * @param {string} props.feedLink       The footer link. Defaults to feed link.
 *
 * @returns {ReactElement} The ArticleList component.
 */
const ArticleList = ( props ) => {
	return (
		<ArticleListContainer
			className={ props.className }
		>
			<ArticleListHeader
				className={ `${ props.className }__header` }
			>
				{ props.title ? props.title : props.feed.title }
			</ArticleListHeader>
			<FeedList
				className={ `${ props.className }__posts` }
				role="list"
			>
				{ props.feed.items.map( item => (
					<ArticleListItem
						className={ `${ props.className }__post` }
						key={ item.link }
						title={ item.title }
						link={ item.link }
						description={ item.description }
					/>
				) ) }
			</FeedList>
			{ props.footerLinkText &&
			<ArticleListFooter
				className={ `${ props.className }__footer` }
			>
				<ArticleListLink
					className={ `${ props.className }__footer-link` }
					href={ props.feedLink ? props.feedLink : props.feed.link }
				>
					{ props.footerLinkText }
				</ArticleListLink>
			</ArticleListFooter>
			}
		</ArticleListContainer>
	);
};

ArticleList.propTypes = {
	className: PropTypes.string,
	feed: PropTypes.object.isRequired,
	title: PropTypes.string,
	footerLinkText: PropTypes.string,
	feedLink: PropTypes.string,
};

ArticleList.defaultProps = {
	className: "articlelist-feed",
};

export default ArticleList;
