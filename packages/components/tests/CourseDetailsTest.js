import React from "react";
import { render } from "@testing-library/react";
import CourseDetails from "../src/CourseDetails";

test( "The empty CardDetails component matches the snapshot", () => {
	const { asFragment } = render(
		<CourseDetails />
	);

	expect( asFragment() ).toMatchSnapshot();
} );

test( "The CardDetails component matches the snapshot when given specific props", () => {
	const course = {
		title: "Keyword Research",
		description: "Do you know the essential first step of good SEO? It’s keyword research. In this training, \n" +
		             "you’ll learn how to research and select the keywords that will guide searchers to your pages.",
		courseUrl: "https://yoast.com/academy/keyword-research-training/",
		ctaButtonData: {
			ctaButtonType: "regular",
			ctaButtonCopy: "Start your free trail",
			ctaButtonUrl: "https://yoast.com/cart/?add-to-cart=1311259",
		},
		readMoreLinkText: "Read more about this training »",
	};

	const { asFragment } = render(
		<CourseDetails
			title={ course.title }
			description={ course.description }
			courseUrl={ course.courseUrl }
			ctaButtonData={ course.ctaButtonData }
			readMoreLinkText={ course.readMoreLinkText }
		/>
	);

	expect( asFragment() ).toMatchSnapshot();
} );
