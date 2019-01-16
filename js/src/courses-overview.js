/* global wpseoCoursesOverviewL10n */

import styled, { ThemeProvider } from "styled-components";
import { CardDetails, FullHeightCard, utils, getRtlStyle } from "yoast-components";
import React from "react";
import ReactDOM from "react-dom";
import { __ } from "@wordpress/i18n";
const { getCourseFeed } = utils;

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
 * @summary CoursesOverview component.
 */
class CoursesOverview extends React.Component {
	/**
	 * Creates the components and initializes its state.
	 */
	constructor() {
		super();

		this.state = {
			courses: null,
		};

		this.getFeed( wpseoCoursesOverviewL10n.version );
	}

	/**
	 * Fetches data from the yoast.com feed, parses it and sets it to the state.
	 *
	 * @param {String} version The active Yoast SEO version.
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
			.catch( error => console.log( error ) );
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
	 * Render the component.
	 *
	 * @returns {ReactElement} The CoursesList component which contains all the courses cards.
	 */
	render() {
		const courses = this.state.courses;

		if ( courses === null ) {
			return null;
		}

		return (
			<CoursesList>
				{ courses.map( course =>
					<CourseListItem key={ course.id }>
						<FullHeightCard
							className={ "CourseCard" }
							id={ course.id }
							header={ this.getHeaderData( course ) }
							banner={ course.isFree === "true" ? { text: __( "Free", "wordpress-seo" ) } : null }
						>
							<CardDetails
								description={ course.content }
								courseUrl={ course.link }
								isBundle={ course.isBundle }
								readMoreLinkText={ course.readMoreLinkText }
								ctaButtonData={ this.getButtonData( course ) }
							/>
						</FullHeightCard>
					</CourseListItem>
				) }
			</CoursesList>
		);
	}
}

const element = document.getElementById( "yoast-courses-overview" );

if ( element ) {
	const theme = {
		isRtl: wpseoCoursesOverviewL10n.isRtl,
	};

	ReactDOM.render(
		<ThemeProvider theme={ theme }>
			<CoursesOverview />
		</ThemeProvider>,
		element
	);
}
