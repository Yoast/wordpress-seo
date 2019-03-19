import React from "react";
import styled from "styled-components";
import { __ } from "@wordpress/i18n";

import YoastWarning from "yoast-components/composites/Plugin/Shared/components/YoastWarning";
import { FullHeightCard } from "yoast-components/composites/CoursesOverview/Card";
import CardDetails from "yoast-components/composites/CoursesOverview/CardDetails";
import getCourseFeed from "yoast-components/utils/getCourseFeed";
import { getRtlStyle } from "yoast-components/utils/helpers/styled-components";

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
	/* Emulate WordPress outline reset. */
	a, div {
		outline: 0;
	}
	/* Emulate WordPress list styles. */
	li {
		margin-bottom: 6px;
	}
`;

const CoursesList = styled.ul`
	display: flex;
	flex-wrap: wrap;
	list-style-type: none;
	padding: 0;
	/* Max 5 cards per row. */
	max-width: 1520px;
`;

const CourseListItem = styled.li`
	/* Higher specificity to override WordPress margins. */
	&& {
		flex: 0 0 288px;
		margin: ${ getRtlStyle( "0 16px 16px 0", "0 0 16px 16px" ) };
	}
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
			<React.Fragment>
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
				</Container>
				<h2>Courses overview cards</h2>
				<p>Full width example to test the cards wrapping.</p>
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
			</React.Fragment>
		);
		/* eslint-enable react/jsx-no-target-blank */
	}
}
