// External dependencies.
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import classNames from "classnames";

const StyledMention = styled.span`
	color: rgb(15 23 42);
	background-color: rgb(226 232 240);
	padding: 0.125rem 0.5rem;
	margin: 0 0.125rem;
	border-radius: 17px;
  	font-size: .75rem;
  	font-weight: 500;
  	line-height: 1.25;
}
	&:hover {
      color: rgb(15 23 42);
	  background-color: rgb(226 232 240);
	  cursor: auto;
	}
`;

/**
 * The StyledMention component.
 *
 * @param {object} props The component's props.
 *
 * @returns {ReactElement} The StyledMention component.
 */
export const Mention = ( { children, className } ) => {
	return <StyledMention
		className={ classNames( "yst-replacevar__mention", className ) }
		spellCheck={ false }
	>
		{ children }
	</StyledMention>;
};

Mention.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string.isRequired,
};
