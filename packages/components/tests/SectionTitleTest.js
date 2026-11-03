/* eslint-disable react/jsx-no-bind */
import React, { act } from "react";
import renderer from "react-test-renderer";
import { SectionTitle } from "../src/SectionTitle";

describe( "SectionTitle", () => {
	it( "renders with only title", () => {
		let component;
		act( () => {
			component = renderer.create(
				<SectionTitle title="Test Title" />
			);
		} );
		expect( component.toJSON() ).toMatchSnapshot();
	} );

	it( "renders with title and subtitle", () => {
		let component;
		act( () => {
			component = renderer.create(
				<SectionTitle
					title="Test Title"
					subTitle="Test Subtitle"
				/>
			);
		} );
		expect( component.toJSON() ).toMatchSnapshot();
	} );

	it( "renders with title and screen reader text", () => {
		let component;
		act( () => {
			component = renderer.create(
				<SectionTitle
					title="Test Title"
					titleScreenReaderText="Additional screen reader text"
				/>
			);
		} );
		expect( component.toJSON() ).toMatchSnapshot();
	} );

	it( "renders with title, subtitle, and screen reader text", () => {
		let component;
		act( () => {
			component = renderer.create(
				<SectionTitle
					title="Test Title"
					subTitle="Test Subtitle"
					titleScreenReaderText="Additional screen reader text"
				/>
			);
		} );
		expect( component.toJSON() ).toMatchSnapshot();
	} );

	it( "renders with new badge label", () => {
		const mockRenderNewBadgeLabel = () => <span>New</span>;

		let component;
		act( () => {
			component = renderer.create(
				<SectionTitle
					title="Test Title"
					hasNewBadgeLabel={ true }
					renderNewBadgeLabel={ mockRenderNewBadgeLabel }
				/>
			);
		} );
		expect( component.toJSON() ).toMatchSnapshot();
	} );

	it( "renders with new badge label, subtitle, and screen reader text", () => {
		const mockRenderNewBadgeLabel = () => <span>New</span>;

		let component;
		act( () => {
			component = renderer.create(
				<SectionTitle
					title="Test Title"
					subTitle="Test Subtitle"
					titleScreenReaderText="Additional screen reader text"
					hasNewBadgeLabel={ true }
					renderNewBadgeLabel={ mockRenderNewBadgeLabel }
				/>
			);
		} );
		expect( component.toJSON() ).toMatchSnapshot();
	} );

	it( "renders without new badge label when hasNewBadgeLabel is false", () => {
		const mockRenderNewBadgeLabel = () => <span>New</span>;

		let component;
		act( () => {
			component = renderer.create(
				<SectionTitle
					title="Test Title"
					hasNewBadgeLabel={ false }
					renderNewBadgeLabel={ mockRenderNewBadgeLabel }
				/>
			);
		} );
		expect( component.toJSON() ).toMatchSnapshot();
	} );
} );
