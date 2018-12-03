import React from "react";
import renderer from "react-test-renderer";
import CardDetails from "../CardDetails";

test( "The empty CardDetails component matches the snapshot", () => {
	const component = renderer.create(
		<CardDetails />
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "The CardDetails component matches the snapshot when given specific props", () => {
	const course = {
		title: "Keyword Research",
		description: "Do you know the essential first step of good SEO? It’s keyword research. In this training, \n" +
		             "you’ll learn how to research and select the keywords that will guide searchers to your pages.",
		courseUrl: "https://yoast.com/academy/keyword-research-training/",
		shopUrl: "https://yoast.com/cart/?add-to-cart=1311259",
	};

	const component = renderer.create(
		<CardDetails
			title={ course.title }
			description={ course.description }
			courseUrl={ course.courseUrl }
			shopUrl={ course.shopUrl }
		/>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
