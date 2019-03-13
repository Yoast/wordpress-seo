import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const TwitterTitleWrapper = styled.p`
    font-weight: bold;
    font-size: 14px;
    max-height: 18.2px;
    line-height: 18.2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 2.1px
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

	// Do not render when there is no title.
	if ( title.length === 0 ) {
		return null;
	}

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
	title: PropTypes.string,
	maximumTitleLength: PropTypes.number,
};

TwitterTitle.defaultProps = {
	title: "",
	maximumTitleLength: 70,
};

export default TwitterTitle;
