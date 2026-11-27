import React from "react";
import { render } from "@testing-library/react";

import { A11yNotice } from "../src/tests/A11yNotice";

test( "the A11yNotice matches the snapshot", () => {
	const { container } = render(
		<A11yNotice>A11yNoticeValue</A11yNotice>
	);

	expect( container.firstChild ).toMatchSnapshot();
	expect( container.firstChild.textContent ).toBe( "A11yNoticeValue" );
} );


test( "the A11yNotice can be changed to a different element", () => {
	const H2A11yNotice = A11yNotice.withComponent( "h2" );

	const { container } = render(
		<H2A11yNotice>H2A11yNoticeValue</H2A11yNotice>
	);

	expect( container.firstChild ).toMatchSnapshot();
	expect( container.firstChild.tagName ).toEqual( "H2" );
	expect( container.firstChild.textContent ).toBe( "H2A11yNoticeValue" );
} );
