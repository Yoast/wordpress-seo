import React from "react";
import renderer from "react-test-renderer";
import CardBanner from "../src/CardBanner";

test( "The empty CardBanner matches the snapshot", () => {
	const component = renderer.create(
		<CardBanner />
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "The CardBanner with specific props matches the snapshot", () => {
	const banner = {
		backgroundColor: "purple",
		textColor: "yellow",
		text: "Free Trial Available.",
	};
	const component = renderer.create(
		<CardBanner { ...banner }>
			{ banner.text }
		</CardBanner>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

