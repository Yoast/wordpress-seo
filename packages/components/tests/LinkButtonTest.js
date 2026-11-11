import React from "react";
import { render } from "@testing-library/react";

import { LinkButton } from "../src/index";

test( "the LinkButton matches the snapshot", () => {
	const { container } = render(
		<LinkButton>LinkButtonValue</LinkButton>
	);

	expect( container.firstChild ).toMatchSnapshot();
} );
