import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import colors from "../../../style-guide/colors.json";

/**
 * @typedef  {Object}     Feed
 * @property {string}     title       The title of the website.
 * @property {string}     description A description of the website.
 * @property {string}     link        A link to the website.
 * @property {FeedItem[]} items     The items in the feed.
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
	padding: 0 8px;
`;

const WordpressFeedList = styled.ul`
	margin: 0;
	list-style: none;
	padding: 0;
`;

const WordpressFeedLink = styled.a`
`;

const WordpressFeedListItemContainer = styled.li`
	padding: 0 8px 8px;

	a {
		padding-bottom: 4px;
		display: inline-block;
	}

	:last-child {
		border-bottom: 1px solid ${ colors.$palette_grey };
	}
`;

const WordpressFeedFooter = styled.div`
	padding: 8px;
`;

const WordpressFeedListItem = ( props ) => {
	return (
		<WordpressFeedListItemContainer>
			<WordpressFeedLink
				href={ props.link }
				target="_blank">
				{ props.title }
			</WordpressFeedLink>
			<p>{ props.description }</p>
		</WordpressFeedListItemContainer>
	);
};

WordpressFeedListItem.propTypes = {
	title: PropTypes.string.isRequired,
	link: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
};

/**
 * Displays a parsed wordpress feed.
 *
 * @param {Object} props    The component props.
 * @param {Feed} props.feed The feed object.
 *
 * @returns {ReactElement} The WordpressFeed component.
 */
const WordpressFeed = ( props ) => {
	return (
		<WordpressFeedContainer>
			<WordpressFeedHeader>
				{ props.title }
			</WordpressFeedHeader>
			<WordpressFeedList>
				{ props.feed.items.map( item => (
					<WordpressFeedListItem
						title={ item.title }
						link={ item.link }
						description={ item.description } />
				) ) }
			</WordpressFeedList>
			<WordpressFeedFooter>
				<WordpressFeedLink
					href={ props.feed.link }
					target="_blank">
					{ props.footerText }
				</WordpressFeedLink>
			</WordpressFeedFooter>
		</WordpressFeedContainer>
	);
};

WordpressFeed.propTypes = {
	feed: PropTypes.object.isRequired,
	title: PropTypes.object.isRequired,
	footerText: PropTypes.string.isRequired,
};

export default WordpressFeed;
