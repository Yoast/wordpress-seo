import React from "react";
import { render } from "@testing-library/react";

import { YoastLinkButton } from "../src/buttons/YoastLinkButton";

test( "the YoastLinkButton matches the snapshot", () => {
	const { container } = render(
		<YoastLinkButton>YoastLinkButtonValue</YoastLinkButton>
	);

	expect( container.firstChild ).toMatchSnapshot();
} );
