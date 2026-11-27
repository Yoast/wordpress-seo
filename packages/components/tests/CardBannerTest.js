import React from "react";
import { render } from "@testing-library/react";
import CardBanner from "../src/CardBanner";

test( "The empty CardBanner matches the snapshot", () => {
	const { asFragment } = render(
		<CardBanner />
	);

	expect( asFragment() ).toMatchSnapshot();
} );

test( "The CardBanner with specific props matches the snapshot", () => {
	const banner = {
		backgroundColor: "purple",
		textColor: "yellow",
		text: "Free Trial Available.",
	};
	const { asFragment } = render(
		<CardBanner { ...banner }>
			{ banner.text }
		</CardBanner>
	);

	expect( asFragment() ).toMatchSnapshot();
} );
