import classNames from "classnames";
import PropTypes from "prop-types";
import { XIcon } from "@heroicons/react/outline";
import React, { createContext, useContext } from "react";
import { isArray, noop } from "lodash";

const PopoverContext = createContext( { handleDismiss: noop } );

/**
 * @returns {Object} The popover context.
 */
export const usePopoverContext = () => useContext( PopoverContext );

const positionClassNameMap = {
	top: "yst-popover--top",
	topLeft: "yst-popover--top-left",
	topRight: "yst-popover--top-right",
	right: "yst-popover--right",
	bottom: "yst-popover--bottom",
	left: "yst-popover--left",
	bottomLeft: "yst-popover--bottom-left",
	bottomRight: "yst-popover--bottom-right",
};

/**
 * @param {string} dismissScreenReaderLabel The screen reader label for the dismiss button.
 * @param {string} [className] The additional class name.
 * @returns {JSX.Element} The close button.
 */
const CloseButton = ( {
	dismissScreenReaderLabel,
} ) => {
	return (
		<div className="yst-flex-shrink-0 yst-flex yst-self-start">
			<button
				type="button"
				popovertargetaction="hide"
				popovertarget="yst-popover"
				className="yst-bg-transparent yst-rounded-md yst-inline-flex yst-text-slate-400 hover:yst-text-slate-500 focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-offset-2 focus:yst-ring-primary-500"
			>
				<span className="yst-sr-only">{ dismissScreenReaderLabel }</span>
				<XIcon className="yst-h-5 yst-w-5" />
			</button>
		</div>

	);
};

CloseButton.propTypes = {
	dismissScreenReaderLabel: PropTypes.string.isRequired,
};


/**
 * @param {string|string[]} content The popover content.
 * @param {string} [className] The additional class name.
 * @returns {JSX.Element} The content.
 */
const Content = ( {
	content,
	className = "",
} ) => {
	return isArray( content ) ? (
		<ul className={ classNames( "yst-list-disc yst-ms-4", className ) }>
			{ content.map( ( text, index ) => (
				<li className="yst-pt-1" key={ `${ text }-${ index }` }>{ text }</li>
			) ) }
		</ul>
	) : (
		<p className={ classNames( "yst-overflow-hidden yst-text-left yst-font-light", className ) }>{ content }</p>
	);
};

Content.propTypes = {
	content: PropTypes.oneOfType( [ PropTypes.node, PropTypes.arrayOf( PropTypes.node ) ] ),
	className: PropTypes.string,
};

/**
 * @param {string} title The popover title.
 * @param {string} [className] The additional class name.
 * @returns {JSX.Element} The title.
 */
const Title = ( {
	title,
	className = "",
} ) => {
	return <h1 className={ classNames( "yst-text-sm yst-font-medium yst-text-slate-800", className ) }>
		{ title }
	</h1>;
};

Title.propTypes = {
	title: PropTypes.string.isRequired,
	className: PropTypes.string,
};

/**
 * @param {JSX.node} children Children of the popover.
 * @param {string} id The popover id.
 * @param {string|JSX.Element} [as] Base component.
 * @param {string} [className] Additional CSS classes.
 * @param {string} [position] The position of the popover.
 * @returns {JSX.Element} The popover component.
 */

const Popover = ( {
	children,
	id,
	as: Component = "div",
	className,
	position,
} ) => {
	return (
		<Component
			popover="manual"
			id={ id }
			role="dialog"
			className={ classNames( "yst-popover", positionClassNameMap[ position ], className ) }
		>
			{ children }
		</Component>
	);
};

Popover.displayName = "Popover";

Popover.propTypes = {
	as: PropTypes.elementType,
	children: PropTypes.node,
	id: PropTypes.string.isRequired,
	className: PropTypes.string,
	position: PropTypes.oneOf( Object.keys( positionClassNameMap ) ),
};

Popover.defaultProps = {
	as: "div",
	className: "",
};

export default Popover;

Popover.Title = Title;
Popover.CloseButton = CloseButton;
Popover.Content = Content;
