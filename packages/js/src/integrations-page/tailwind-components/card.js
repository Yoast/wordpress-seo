import { useState, createContext, useContext } from "@wordpress/element";
import { PropTypes } from "prop-types";
import { ToggleField } from "@yoast/ui-library";

const CardContext = createContext( {
	isActive: true,
	toggleActive: () => {},
} );

/**
 * A hook for getting the CardContext value, with an informative error message.
 *
 * @returns {*} The value provided to the CardContext provider.
 */
export function useCardContext() {
	const context = useContext( CardContext );
	if ( ! context ) {
	  throw new Error(
			"Card compound components cannot be rendered outside the Card component"
	  );
	}
	return context;
}
/* eslint-disable complexity */

/**
 * The header.
 *
 * @param {JSX.node} children The children.
 *
 * @returns {JSX.Element} The header.
 */
const Header = ( { children } ) => {
	const { isActive } = useCardContext();

	return (
		<header className={ `yst-relative yst-flex yst-items-center yst-justify-center yst-h-24 yst-bg-gray-100 yst--mx-6 yst--mt-6 yst-py-6 ${ isActive ? "" : "yst-opacity-50 yst-filter yst-grayscale" }` }>
			{ children }
		</header>
	);
};

Header.propTypes = {
	children: PropTypes.node,
};

/**
 * The content.
 *
 * @param {JSX.node} children The children.
 *
 * @returns {JSX.Element} The content.
 */
const Content = ( { children } ) => {
	const { isActive } = useCardContext();
	return (
		<div className={ `yst-flex-grow ${ isActive ? "" : "yst-opacity-50  yst-filter yst-grayscale" } ` }>
			{ children }
		</div>
	);
};

Content.propTypes = {
	children: PropTypes.node,
};


/**
 * The footer.
 *
 * @param {JSX.node} children The children.
 *
 * @returns  {JSX.Element} The footer.
 */
const Footer = ( { children } ) => {
	return (
		<footer className="yst-border-t yst-border-gray-200 yst-pt-6">
			{ children }
		</footer>
	);
};

Footer.propTypes = {
	children: PropTypes.node,
};

/**
 * The toggle footer.
 *
 * @param {String}   props.toggleLabel The label to be used by the toggle.
 * @param {JSX.node} children          The children.

 * @returns  {JSX.Element} The footer.
 */
const ToggleFooter = ( { toggleLabel, children } ) => {
	const { isActive, toggleActive } = useCardContext();
	return (
		<footer className="yst-border-t yst-border-gray-200 yst-pt-6">
			{ children }
			<ToggleField checked={ isActive } label={ toggleLabel } onChange={ toggleActive } />
		</footer>
	);
};

ToggleFooter.propTypes = {
	toggleLabel: PropTypes.string,
	children: PropTypes.node,
};

/**
 * Card component.
 *
 * @param {Boolean}  props.initialState    Toggle initial state.
 * @param {String}   props.integrationSlug The integration slug.
 * @param {Function} props.beforeToggle    Function to call before changing the state of the toggle.
 * @param {JSX.node} props.children        The children.

 *
 * @returns {JSX.Element} The card element.
 */
export function Card( { initialState, integrationSlug, beforeToggle, children } ) {
	const [ isActive, setIsActive ] = useState( initialState );
	/**
	 * The toggle.
	 *
	 * @returns  {Boolean} The footer.
	 */
	const toggleActive =
		async() => {
			let canToggle = true;
			// Immediately switch the toggle for enhanced UX
			setIsActive( ! isActive );

			if ( beforeToggle ) {
				canToggle = false;
				canToggle = await beforeToggle( integrationSlug, ! isActive );
			}
			if ( ! canToggle ) {
				// If something went wrong, switch the toggle back
				setIsActive( ! isActive );
			}
		};

	const value = { isActive, toggleActive };
	return (
		<div className="yst-relative yst-flex yst-flex-col yst-bg-white yst-rounded-lg yst-border yst-p-6 yst-space-y-6 yst-overflow-hidden yst-transition-transform yst-ease-in-out yst-duration-200">
			<CardContext.Provider value={ value }>
				{ children }
			</CardContext.Provider>
		</div>
	);
}

Card.propTypes = {
	initialState: PropTypes.bool,
	integrationSlug: PropTypes.string,
	beforeToggle: PropTypes.func,
	children: PropTypes.node,
};

Card.defaultProps = {
	initialState: true,
};
Card.Header = Header;
Card.Content = Content;
Card.Footer = Footer;
Card.ToggleFooter = ToggleFooter;
