import React from "react";
import { render } from "@testing-library/react";

import Icon from "../src/Icon";
import YoastSeoIcon from "../src/YoastSeoIcon";

test( "the Icon without props matches the snapshot", () => {
	const { container } = render(
		<Icon icon={ YoastSeoIcon } />
	);

	expect( container.firstChild ).toMatchSnapshot();
} );

test( "the Icon with props matches the snapshot", () => {
	const { container } = render(
		<Icon icon={ YoastSeoIcon } color="red" width="200px" height="200px" />
	);

	expect( container.firstChild ).toMatchSnapshot();
} );
