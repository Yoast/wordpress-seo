import React from "react";
import { render } from "@testing-library/react";
import Card, { FullHeightCard } from "../src/Card";
import CourseDetails from "../src/CourseDetails";

test( "The empty Card component matches the snapshot", () => {
	const { container } = render(
		<Card />
	);

	expect( container.firstChild ).toMatchSnapshot();
} );

test( "The FullHeightCard is rendered including some props", () => {
	const { container } = render(
		<FullHeightCard className={ "CourseCard_Empty" } id={ "Test01" } />
	);

	expect( container.firstChild ).toMatchSnapshot();
} );

test( "The FullHeightCard is rendered including the CardBanner and CardDetails components", () => {
	const course = {
		title: "Keyword Research",
		image: "../wp-content/plugins/wordpress-seo/images/sample_course_card_header.png",
		description: "Do you know the essential first step of good SEO? It’s keyword research. In this training, \n" +
		             "you’ll learn how to research and select the keywords that will guide searchers to your pages.",
		courseUrl: "https://yoast.com/academy/keyword-research-training/",
		ctaButtonData: {
			ctaButtonType: "regular",
			ctaButtonCopy: "Start your free trail",
			ctaButtonUrl: "https://yoast.com/cart/?add-to-cart=1311259",
		},
		readMoreLinkText: "Read more about this training »",
		banner: { text: "Free" },

	};
	const header = {
		image: course.image,
		title: course.title,
		link: course.courseUrl,
	};

	const { container } = render(
		<FullHeightCard
			className={ "CourseCard" }
			id={ "Test02" }
			header={ header }
			banner={ course.banner }
		>
			<CourseDetails
				title={ course.title }
				description={ course.description }
				courseUrl={ course.courseUrl }
				ctaButtonData={ course.ctaButtonData }
				readMoreLinkText={ course.readMoreLinkText }
			/>
		</FullHeightCard>
	);

	expect( container.firstChild ).toMatchSnapshot();
} );
