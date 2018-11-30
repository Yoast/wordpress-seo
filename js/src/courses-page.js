import { Component, render } from "@wordpress/element";
import styled from "styled-components";
import { FullHeightCard } from "./components/courses/Card";
import CourseDetails from "./components/courses/CourseDetails";

const element = document.getElementById( "yoast-courses-overview" );

const OuterContainer = styled.ul`
	display: grid;
	grid-template-columns: repeat(auto-fill, 288px);
	grid-column-gap: 16px;
	grid-row-gap: 16px;
	align-items: flex-start;
	padding: 0;
`;

const CourseListItem = styled.li`
	list-style-type: none;
	height: 100%;
	width: 100%;
`;

const courses = [
	{
		title: "SEO for Beginners",
		image: "../wp-content/plugins/wordpress-seo/js/src/components/courses/sample_course_card_header.png",
		description: "In this free course, you'll get quick wins to make your site rank higher in Google, Bing, and Yahoo.",
		courseUrl: "https://yoast.com/academy/keyword-research-training/",
		shopUrl: "https://yoast.com/cart/?add-to-cart=1311259",
		banner: {
			text: "Free",
		},
	},
	{
		title: "Keyword Research",
		image: "../wp-content/plugins/wordpress-seo/js/src/components/courses/sample_course_card_header.png",
		description: "Do you know the essential first step of good SEO? It’s keyword research. In this training, you’ll learn how to research and select the keywords that will guide searchers to your pages.",
		courseUrl: "https://yoast.com/academy/keyword-research-training/",
		shopUrl: "https://yoast.com/cart/?add-to-cart=1311259",
	},
	{
		title: "Structured Data",
		image: "../wp-content/plugins/wordpress-seo/js/src/components/courses/sample_course_card_header.png",
		description: "Get your site ready for rich search results that bring in loads of customers. Make your site stand out from the crowd by adding structured data!",
		courseUrl: "https://yoast.com/academy/keyword-research-training/",
		shopUrl: "https://yoast.com/cart/?add-to-cart=1311259",
		banner: {
			text: "Free trial available",
		},
	},
];

const getHeaderData = ( course ) => {
	return {
		image: course.image,
		title: course.title,
		link: course.courseUrl,
	};
}

render(
	<OuterContainer>
		{ courses.map( ( course, i ) =>
			<CourseListItem key={ i }>
				<FullHeightCard
					className={ "CourseCard" }
					id={ i }
					header={ getHeaderData( course ) }
					banner={ course.banner }
				>
					<CourseDetails
						title={ course.title }
						description={ course.description }
						courseUrl={ course.courseUrl }
						shopUrl={ course.shopUrl }
					/>
				</FullHeightCard>
			</CourseListItem>
		) }
	</OuterContainer>,
	element
);