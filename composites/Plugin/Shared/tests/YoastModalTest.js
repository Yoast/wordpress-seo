import React from "react";
import { mount } from "enzyme";

import YoastModal from "../components/YoastModal";

describe( "YoastModal", () => {
	test( "the YoastModal renders children when open", () => {
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

		expect( wrapper.find( YoastModal ).find( ".yoast-modal__inside" ).text() ).toBe( "Hi!" );
	} );

	test( "the YoastModal with its own elements renders children when open", () => {
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

		const modal = wrapper.find( ".my-modal" );
		expect( modal.find( ".yoast-modal__inside" ).text() ).toBe( "Hello!" );
		expect( modal.find( "h1" ).text() ).toBe( "title" );
		expect( modal.find( "button.yoast-modal__button-close-icon" ).getDOMNode().getAttribute( "aria-label" ) ).toBe( "Close X" );
		expect( modal.find( "button.yoast-modal__button-close" ).text() ).toBe( "Close" );
	} );
} );
