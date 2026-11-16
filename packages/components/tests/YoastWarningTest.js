import React from "react";
import { render } from "@testing-library/react";
import Warning from "../src/Warning";
import { ThemeProvider } from "styled-components";

test( "YoastWarning matches the snapshot", () => {
	/* eslint-disable react/jsx-no-target-blank */
	const { container } = render(
		<Warning
			message={ [
				"This is a warning message",
				<a key={ 1 } href="https://yoast.com" target="_blank">Go to Yoast.com</a>,
				<p key={ 2 }>React will render this</p>,
			] }
		/>
	);
	/* eslint-enable react/jsx-no-target-blank */

	expect( container.firstChild ).toMatchSnapshot();
} );

test( "YoastWarning does not render without a message", () => {
	const { container } = render(
		<Warning />
	);

	const tree = container.firstChild;
	expect( tree ).toMatchSnapshot();
	expect( tree ).toBeNull();
} );

test( "YoastWarning with a right to left language matches the snapshot", () => {
	/* eslint-disable react/jsx-no-target-blank */
	const { container } = render(
		<ThemeProvider theme={ { isRtl: true } }>
			<Warning
				message={ [
					"This is a warning message",
					<a key={ 1 } href="https://yoast.com" target="_blank">Go to Yoast.com</a>,
					<p key={ 2 }>React will render this</p>,
				] }
			/>
		</ThemeProvider>
	);
	/* eslint-enable react/jsx-no-target-blank */

	expect( container.firstChild ).toMatchSnapshot();
} );
