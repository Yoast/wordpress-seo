import React from "react";
import styled from "styled-components";
import { __ } from "@wordpress/i18n";

import YoastWarning from "../composites/Plugin/Shared/components/YoastWarning";
import { FullHeightCard } from "../composites/CoursesOverview/Card";
import CardDetails from "../composites/CoursesOverview/CardDetails";
import getCourseFeed from "../utils/getCourseFeed";

const Container = styled.div`
	max-width: 1024px;
	margin: 0 auto;
	padding: 24px;
	box-sizing: border-box;
`;

// Use this only for testing purposes in the standalone examples.
const WordPressStylesEmulator = styled.div`
	/* Emulate WordPress font metrics. */
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
	font-size: 13px;
	line-height: 1.4em;
	/* Emulate WordPress list styles. */
	li {
		margin-bottom: 6px;
	}
`;

const CoursesList = styled.ul`
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

/**
 * Renders the yoast-component Components Examples.
 *
 * @returns {ReactElement} The Components example container component.
 */
export default class ComponentsExample extends React.Component {
	/**
	 * Creates the components and initializes its state.
	 */
	constructor() {
		super();

		this.state = {
			courses: null,
		};

		this.getFeed( "free" );
	}

	/**
	 * Fetches data from the yoast.com feed, parses it and sets it to the state.
	 *
	 * @param {String} version Active Yoast SEO version.
	 *
	 * @returns {void}
	 */
	getFeed( version ) {
		// Developer note: this link should -not- be converted to a shortlink.
		getCourseFeed( "https://yoast.com/?feed=courses&license=" + version )
			.then( ( feed ) => {
				feed.items = feed.items.map( ( item ) => {
					return item;
				} );
				this.setState( { courses: feed.items } );
			} )
			/* eslint-disable-next-line no-console */
			.catch( error => console.error( error ) );
	}

	/**
	 * Converts the relevant data in a course to a header object.
	 *
	 * @param {Object} course The course to create a header for.
	 *
	 * @returns {Object} The header object.
	 */
	getHeaderData( course ) {
		return {
			image: course.image,
			title: course.title,
			link: course.link,
		};
	}

	/**
	 * Converts the relevant data from a course for the ctaButton to an object.
	 *
	 * @param {string} course The course to create a ctaButton for.
	 *
	 * @returns {Object} The data object for the ctaButton.
	 */
	getButtonData( course ) {
		return {
			ctaButtonCopy: course.ctaButtonCopy,
			ctaButtonType: course.ctaButtonType,
			ctaButtonUrl: course.ctaButtonUrl,
		};
	}

	/**
	 * Renders all the Component examples.
	 *
	 * @returns {ReactElement} The rendered list of the Component examples.
	 */
	render() {
		const courses = this.state.courses;

		/* eslint-disable react/jsx-no-target-blank */
		return (
			<Container>
				<h2>Yoast warning</h2>
				<YoastWarning
					message={ [
						"This is a warning message that also accepts arrays, so you can pass links such as ",
						<a
							key="1"
							href="https://yoa.st/metabox-help-cornerstone"
							target="_blank"
						>cornerstone content</a>,
						", for example.",
						<p key="2">This spans to multiple lines.</p>,
					] }
				/>

				<h2>Courses overview cards</h2>
				<WordPressStylesEmulator>
					{ courses && <CoursesList>
						{ courses.map( course =>
							<CourseListItem key={ course.id }>
								<FullHeightCard
									className={ "CourseCard" }
									id={ course.id }
									header={ this.getHeaderData( course ) }
									banner={ course.isFree === "true" ? { text: __( "Free", "yoast-components" ) } : null }
								>
									<CardDetails
										description={ course.content }
										courseUrl={ course.link }
										readMoreLinkText={ course.readMoreLinkText }
										ctaButtonData={ this.getButtonData( course ) }
									/>
								</FullHeightCard>
							</CourseListItem>
						) }
					</CoursesList> }
				</WordPressStylesEmulator>
			</Container>
		);
		/* eslint-enable react/jsx-no-target-blank */
	}
}
