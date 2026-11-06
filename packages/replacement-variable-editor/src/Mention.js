// External dependencies.
import React, { useCallback, useContext } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import classNames from "classnames";
import { __, sprintf } from "@wordpress/i18n";

/**
 * Holds the function that removes a replacement variable from the editor.
 *
 * The Draft.js mention plugin only passes the entity to the mention component,
 * so the editor itself provides the removal function through this context. When
 * there is no function the variable cannot be removed, for instance when the
 * editor is read-only.
 */
export const MentionRemovalContext = React.createContext( null );

const StyledMention = styled.span`
	display: inline-flex;
	align-items: center;
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

const StyledRemoveButton = styled.button`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	margin: 0 0 0 0.25rem;
	padding: 0;
	border: 0;
	background: none;
	color: inherit;
	line-height: 0;
	cursor: pointer;
	opacity: 0.6;

	&:hover,
	&:focus {
		opacity: 1;
	}
`;

/**
 * Stops the browser from moving the caret when the remove button is pressed.
 *
 * Without this the editor loses its selection before the click handler runs.
 *
 * @param {Event} event The mouse down event.
 *
 * @returns {void}
 */
const preventMouseDown = ( event ) => {
	event.preventDefault();
};

/**
 * The StyledMention component.
 *
 * @param {object} props               The component's props.
 * @param {string} props.entityKey     The key of the entity that this mention represents.
 * @param {object} props.mention       The data of the entity that this mention represents.
 * @param {string} props.decoratedText The label that is shown for the mention.
 * @param {node}   props.children      The label of the mention.
 *
 * @returns {ReactElement} The StyledMention component.
 */
export const Mention = ( { entityKey, mention, decoratedText = "", children, className } ) => {
	const removeMention = useContext( MentionRemovalContext );

	const handleRemove = useCallback( () => {
		removeMention( entityKey );
	}, [ removeMention, entityKey ] );

	/*
	 * The entity data only holds the name of the replacement variable, while the
	 * label that is shown comes from the decorated text. Fall back to the name so
	 * the button always has a label to announce.
	 */
	const label = decoratedText || mention.name || mention.replaceName;

	return <StyledMention
		className={ classNames( "yst-replacevar__mention", className ) }
		spellCheck={ false }
	>
		{ children }
		{ removeMention && <StyledRemoveButton
			type="button"
			onMouseDown={ preventMouseDown }
			onClick={ handleRemove }
			contentEditable={ false }
			aria-label={ sprintf(
				/* translators: %s expands to the name of the replacement variable. */
				__( "Remove %s", "wordpress-seo" ),
				label
			) }
		>
			<svg
				aria-hidden="true"
				focusable="false"
				width="10"
				height="10"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M10 2c4.42 0 8 3.58 8 8s-3.58 8-8 8-8-3.58-8-8 3.58-8 8-8zm5 11l-3-3 3-3-2-2-3 3-3-3-2 2 3 3-3 3 2 2 3-3 3 3z"
					fill="currentColor"
				/>
			</svg>
		</StyledRemoveButton> }
	</StyledMention>;
};

Mention.propTypes = {
	entityKey: PropTypes.string.isRequired,
	mention: PropTypes.object.isRequired,
	decoratedText: PropTypes.string,
	children: PropTypes.node.isRequired,
	className: PropTypes.string.isRequired,
};
