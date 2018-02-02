import React from "react";
import renderer from "react-test-renderer";

import Icon from "../components/Icon";

// Replace this Fake component with a real component, when there will be one.
const CircleIcon = ( props ) => {
	/* eslint-disable max-len */
	return(
		<svg { ...props } width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
			<path d="M1664 896q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z" />
		</svg>
	);
	/* eslint-enable max-len */
};

test( "the Icon matches the snapshot", () => {
	const component = renderer.create(
		<Icon icon={ CircleIcon } color="red" size="44px" />
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
