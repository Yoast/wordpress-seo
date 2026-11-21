// External dependencies.
import React from "react";
import { render } from "@testing-library/react";

// Internal dependencies.
import { BaseButton, LinkButton } from "../src/index";
import IconButtonToggle from "../src/IconButtonToggle";

const noop = () => {};

/**
 * Renders an element with the component's `defaultProps` temporarily removed, mirroring
 * React 19's automatic JSX runtime, which no longer applies `defaultProps` to
 * function/forwardRef components. The buttons keep their defaults working through a
 * styled-components `.attrs` callback instead, so each guard asserts the button still
 * renders when `defaultProps` are not applied (without it the `rgba( props.<color> )`
 * interpolations receive `undefined` and throw).
 *
 * @param {React.ComponentType} Component     The component whose `defaultProps` to drop.
 * @param {Function}            renderElement Callback that returns the element to render.
 *
 * @returns {void}
 */
const expectRendersWithoutDefaultProps = ( Component, renderElement ) => {
	const previousDefaults = Component.defaultProps;
	// `null` makes React's reconciler skip defaultProps (its falsy check), mirroring the automatic
	// runtime. styled components make `defaultProps` non-configurable, so it cannot be deleted.
	Component.defaultProps = null;
	try {
		// Build the element here, after defaultProps is neutralised: the classic runtime applies
		// defaultProps at element-creation time, not at render time, so an element created earlier
		// would keep its defaults and mask the regression.
		expect( () => render( renderElement() ) ).not.toThrow();
	} finally {
		Component.defaultProps = previousDefaults;
	}
};

test( "BaseButton renders when its defaultProps are not applied (React 19 automatic runtime)", () => {
	expectRendersWithoutDefaultProps( BaseButton, () => <BaseButton>ButtonValue</BaseButton> );
} );

test( "LinkButton renders when its defaultProps are not applied (React 19 automatic runtime)", () => {
	expectRendersWithoutDefaultProps( LinkButton, () => <LinkButton>LinkButtonValue</LinkButton> );
} );

test( "IconButtonToggle keeps its default styling when its defaultProps are not applied (React 19 automatic runtime)", () => {
	const props = {
		name: "group1",
		id: "RadioButton",
		ariaLabel: "important toggle",
		icon: "eye",
		pressed: false,
		onClick: noop,
	};
	const withDefaults = render( <IconButtonToggle { ...props } /> ).container.innerHTML;

	const previousDefaults = IconButtonToggle.defaultProps;
	// `null` makes React's reconciler skip defaultProps, mirroring the automatic runtime.
	IconButtonToggle.defaultProps = null;
	try {
		const withoutDefaults = render( <IconButtonToggle { ...props } /> ).container.innerHTML;
		// IconButtonToggle merges its own defaults internally, so dropping defaultProps (which React
		// 19's automatic runtime does) must still produce the same styled output. Comparing the full
		// render, not just checking that it renders, guards those merged default colours against
		// silent regressions: styled-components derives the class names from the generated CSS, so
		// equal markup means equal styles.
		expect( withoutDefaults ).toBe( withDefaults );
	} finally {
		IconButtonToggle.defaultProps = previousDefaults;
	}
} );

test( "BaseButton keeps type=button when its defaultProps are not applied (React 19 automatic runtime)", () => {
	const previousDefaults = BaseButton.defaultProps;
	BaseButton.defaultProps = null;
	try {
		const { container } = render( <BaseButton>ButtonValue</BaseButton> );
		// A typeless <button> defaults to submit and would submit surrounding forms, so the
		// runtime-safe default must keep type="button" even without defaultProps.
		expect( container.firstChild.getAttribute( "type" ) ).toBe( "button" );
	} finally {
		BaseButton.defaultProps = previousDefaults;
	}
} );
