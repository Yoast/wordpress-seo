/* eslint-disable react/jsx-no-bind */
import React from "react";
import { render } from "@testing-library/react";
import { SectionTitle } from "../src/SectionTitle";

describe( "SectionTitle", () => {
	it( "renders with only title", () => {
		const { container } = render(
			<SectionTitle title="Test Title" />
		);

		expect( container.firstChild ).toMatchSnapshot();
	} );

	it( "renders with title and subtitle", () => {
		const { container } = render(
			<SectionTitle
				title="Test Title"
				subTitle="Test Subtitle"
			/>
		);

		expect( container.firstChild ).toMatchSnapshot();
	} );

	it( "renders with title and screen reader text", () => {
		const { container } = render(
			<SectionTitle
				title="Test Title"
				titleScreenReaderText="Additional screen reader text"
			/>
		);

		expect( container.firstChild ).toMatchSnapshot();
	} );

	it( "renders with title, subtitle, and screen reader text", () => {
		const { container } = render(
			<SectionTitle
				title="Test Title"
				subTitle="Test Subtitle"
				titleScreenReaderText="Additional screen reader text"
			/>
		);

		expect( container.firstChild ).toMatchSnapshot();
	} );

	it( "renders with new badge label", () => {
		const mockRenderNewBadgeLabel = () => <span>New</span>;

		const { container } = render(
			<SectionTitle
				title="Test Title"
				hasNewBadgeLabel={ true }
				renderNewBadgeLabel={ mockRenderNewBadgeLabel }
			/>
		);

		expect( container.firstChild ).toMatchSnapshot();
	} );

	it( "renders with new badge label, subtitle, and screen reader text", () => {
		const mockRenderNewBadgeLabel = () => <span>New</span>;

		const { container } = render(
			<SectionTitle
				title="Test Title"
				subTitle="Test Subtitle"
				titleScreenReaderText="Additional screen reader text"
				hasNewBadgeLabel={ true }
				renderNewBadgeLabel={ mockRenderNewBadgeLabel }
			/>
		);

		expect( container.firstChild ).toMatchSnapshot();
	} );

	it( "renders without new badge label when hasNewBadgeLabel is false", () => {
		const mockRenderNewBadgeLabel = () => <span>New</span>;

		const { container } = render(
			<SectionTitle
				title="Test Title"
				hasNewBadgeLabel={ false }
				renderNewBadgeLabel={ mockRenderNewBadgeLabel }
			/>
		);

		expect( container.firstChild ).toMatchSnapshot();
	} );
} );
