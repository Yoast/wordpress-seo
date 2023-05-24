import { forwardRef } from "@wordpress/element";
import classNames from "classnames";
import PropTypes from "prop-types";

/**
 * @param {React.ReactNode} [as="div"] What component to render as.
 * @param {string} [className] Optional extra className.
 * @param {React.ReactNode} children The content.
 * @returns {React.ReactElement} The element.
 */
const Paper = forwardRef( ( { as: Component = "div", className = "", children }, ref ) => (
	<Component
		ref={ ref }
		className={ classNames( "yst-rounded-lg yst-bg-white yst-shadow", className ) }
	>
		{ children }
	</Component>
) );

const propTypes = {
	as: PropTypes.node,
	className: PropTypes.string,
	children: PropTypes.node.isRequired,
};
Paper.propTypes = propTypes;

Paper.defaultProps = {
	as: "div",
	className: "",
};

// eslint-disable-next-line require-jsdoc
export const StoryComponent = props => <Paper { ...props } />;
StoryComponent.propTypes = propTypes;
StoryComponent.defaultProps = Paper.defaultProps;
StoryComponent.displayName = "Paper";

export default Paper;
