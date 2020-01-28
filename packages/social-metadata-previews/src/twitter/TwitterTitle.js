/* External dependencies */
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const TwitterTitleWrapper = styled.p`
	font-weight: 400;
	font-size: 14px;
	max-height: 18px;
	line-height: 18px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	margin-top: 0;
	margin-bottom: 2px;
	color: rgb(20, 23, 26);
`;

/**
 * Renders a TwitterTitle component.
 *
 * @param {object} props The props.
 *
 * @returns {React.Element} The rendered element.
 */
const TwitterTitle = ( props ) => {
	let title = props.title;

	// Only allow a certain amount of characters.
	if ( props.maximumTitleLength && title.length > props.maximumTitleLength ) {
		title = title.substr( 0, props.maximumTitleLength );
	}

	return (
		<TwitterTitleWrapper>
			{ title }
		</TwitterTitleWrapper>
	);
};

TwitterTitle.propTypes = {
	title: PropTypes.string.isRequired,
	maximumTitleLength: PropTypes.number,
};

TwitterTitle.defaultProps = {
	maximumTitleLength: 70,
};

export default TwitterTitle;
