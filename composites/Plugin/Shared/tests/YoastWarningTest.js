import React from "react";
import renderer from "react-test-renderer";
import YoastWarning from "../components/YoastWarning";
import { ThemeProvider } from "styled-components";

test( "YoastWarning matches the snapshot", () => {
	const component = renderer.create(
		<YoastWarning
			message={ [
				"This is a warning message",
				<a key={ 1 } href="https://yoast.com" target="_blank">Go to Yoast.com</a>,
				<p key={ 2 }>React will render this</p>,
			] }
		/>
	);

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

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
