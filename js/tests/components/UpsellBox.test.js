import React from "react";
import { mount } from "enzyme";
import UpsellBox from "../../src/components/UpsellBox";

describe( "UpsellBox", () => {
	it( "renders the snippet editor inside of it", () => {
		const tree = mount(
			<UpsellBox
				benefits={ [
					"<strong>Strong text</strong> and not so strong text",
					"<strong>Strong text two</strong>",
				] }
				infoParagraphs={ [
					"Text",
					[ "Array with ", <a key="1" href="https://example.org">links</a>, " test" ],
				] }
				upsellButtonText="A button"
				upsellButton={ {
					href: "https://example.org",
					className: "class name",
					"aria-labelledby": "label-id",
				} }
				buttonLabel="Small text below button"
			/>
		);
		expect( tree ).toMatchSnapshot();
	} );
} );
