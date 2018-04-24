import React from "react";
import { mount } from "enzyme";

import YoastModal from "../components/YoastModal";

describe( "YoastModal", () => {
	test( "the YoastModal renders its children when open", () => {
		const hook = document.createElement( "div" );

		const wrapper = mount(
			<YoastModal
				isOpen={ true }
				appElement={ hook }
				onClose={ () => {} }
				modalAriaLabel="Some label"
			>
				Hi!
			</YoastModal>
		);

		// Get the real generated HTML excluding the wrapper components.
		const modal = wrapper.find( "div.yoast-modal__overlay" );
		expect( modal.find( ".yoast-modal__inside" ).text() ).toBe( "Hi!" );
	} );

	test( "the YoastModal has a role dialog and aria label", () => {
		const hook = document.createElement( "div" );

		const wrapper = mount(
			<YoastModal
				isOpen={ true }
				appElement={ hook }
				onClose={ () => {} }
				modalAriaLabel="Some label"
			>
				Hi!
			</YoastModal>
		);

		// Get the real generated HTML excluding the wrapper components.
		const modalContent = wrapper.find( "div.yoast-modal__overlay .yoast-modal__content" );
		expect( modalContent.getDOMNode().getAttribute( "role" ) ).toBe( "dialog" );
		expect( modalContent.getDOMNode().getAttribute( "aria-label" ) ).toBe( "Some label" );
	} );

	test( "the YoastModal renders its default elements", () => {
		const hook = document.createElement( "div" );

		const wrapper = mount(
			<YoastModal
				isOpen={ true }
				appElement={ hook }
				onClose={ () => {} }
				modalAriaLabel="Some label"
				heading="title"
				closeIconButton="Close X"
				closeButton="Close"
				className="my-modal"
			>
				Hello!
			</YoastModal>
		);

		// Get the real generated HTML excluding the wrapper components.
		const modal = wrapper.find( "div.yoast-modal__overlay" );

		/*
		 * Note: `styled-components` wraps the DOM nodes and also passes class names e.g.
		 *    <styled.h1 className="yoast-modal__title">
		 *        <h1 className="yoast-modal__title sc-bdVaJa iXppQv">
		 * so we need to get the real DOM element.
		 */
		expect( modal.find( "h1.yoast-modal__title" ).text() ).toBe( "title" );
		expect( modal.find( "button.yoast-modal__button-close-icon" ).getDOMNode().getAttribute( "aria-label" ) ).toBe( "Close X" );
		expect( modal.find( "button.yoast-modal__button-close" ).text() ).toBe( "Close" );
	} );
} );
