import { Component, render } from "@wordpress/element";
import styled from "styled-components";
import PropTypes from "prop-types";
import { FullHeightCard } from "./components/courses/Card";
import CourseDetails from "./components/courses/CourseDetails";

const element = document.getElementById( "yoast-courses-overview" );

const OuterContainer = styled.ul`
	display: grid;
	grid-template-columns: repeat(auto-fill, 288px);
	grid-column-gap: 16px;
	grid-row-gap: 16px;
	justify-content: center;
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
		header: {
			image: "../wp-content/plugins/wordpress-seo/js/src/components/courses/sample_course_card_header.png",
			title: "SEO for Beginners",
			link: "http://yoast.academy.test/awesome_seo",
		},
		banner: {
			text: "Free",
		},
		title: "SEO for Beginners",
		description: "In this free course, you'll get quick wins to make your site rank higher in Google, Bing, and Yahoo.",
		courseUrl: "https://yoast.com/academy/keyword-research-training/",
		shopUrl: "https://yoast.com/cart/?add-to-cart=1311259",
	},
	{
		header: {
			image: "../wp-content/plugins/wordpress-seo/js/src/components/courses/sample_course_card_header.png",
			title: "Keyword Research",
			link: "http://yoast.academy.test/awesome_seo",
		},
		title: "Keyword Research",
		description: "Do you know the essential first step of good SEO? It’s keyword research. In this training, you’ll learn how to research and select the keywords that will guide searchers to your pages.",
		courseUrl: "https://yoast.com/academy/keyword-research-training/",
		shopUrl: "https://yoast.com/cart/?add-to-cart=1311259",
	},
	{
		header: {
			image: "../wp-content/plugins/wordpress-seo/js/src/components/courses/sample_course_card_header.png",
			title: "Structured Data",
			link: "http://yoast.academy.test/awesome_seo",
		},
		banner: {
			text: "Free trial available",
		},
		title: "Structured Data",
		description: "Get your site ready for rich search results that bring in loads of customers. Make your site stand out from the crowd by adding structured data!",
		courseUrl: "https://yoast.com/academy/keyword-research-training/",
		shopUrl: "https://yoast.com/cart/?add-to-cart=1311259",
	},
];

render(
	<OuterContainer>
		{ courses.map( ( course, i ) =>
			<CourseListItem key={ i }>
				<FullHeightCard
					className={ "CourseCard" }
					id={ i }
					header={ course.header }
					banner={ course.banner }
				>
					<CourseDetails
						title={ course.title }
						description={ course.description }
						courseUrl={ course.courseUrl }
					/>
				</FullHeightCard>
			</CourseListItem>
		) }
	</OuterContainer>,
	element
);
