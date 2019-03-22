import React from "react";
import renderer from "react-test-renderer";
import YoastWarning from "../src/YoastWarning";
import { ThemeProvider } from "styled-components";

test( "YoastWarning matches the snapshot", () => {
	/* eslint-disable react/jsx-no-target-blank */
	const component = renderer.create(
		<YoastWarning
			message={ [
				"This is a warning message",
				<a key={ 1 } href="https://yoast.com" target="_blank">Go to Yoast.com</a>,
				<p key={ 2 }>React will render this</p>,
			] }
		/>
	);
	/* eslint-enable react/jsx-no-target-blank */

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "YoastWarning does not render without a message", () => {
	const component = renderer.create(
		<YoastWarning />
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
	expect( tree ).toBeNull();
} );

test( "YoastWarning with a right to left language matches the snapshot", () => {
	/* eslint-disable react/jsx-no-target-blank */
	const component = renderer.create(
		<ThemeProvider theme={ { isRtl: true } }>
			<YoastWarning
				message={ [
					"This is a warning message",
					<a key={ 1 } href="https://yoast.com" target="_blank">Go to Yoast.com</a>,
					<p key={ 2 }>React will render this</p>,
				] }
			/>
		</ThemeProvider>
	);
	/* eslint-enable react/jsx-no-target-blank */

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
