/* global wpseoCoursesOverviewL10n */

import styled from "styled-components";
import { CardDetails, FullHeightCard, utils } from "yoast-components";
import React from "react";
import ReactDOM from "react-dom";
import { __ } from "@wordpress/i18n";
const { getCourseFeed } = utils;

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
	 * @returns {ReactElement} The OuterContainer component which contains all the courses cards.
	 */
	render() {
		const courses = this.state.courses;

		if ( courses === null ) {
			return null;
		}

		return (
			<OuterContainer>
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
								readMoreLinkText={ course.readMoreLinkText }
								ctaButtonData={ this.getButtonData( course ) }
							/>
						</FullHeightCard>
					</CourseListItem>
				) }
			</OuterContainer>
		);
	}
}

const element = document.getElementById( "yoast-courses-overview" );

if ( element ) {
	ReactDOM.render( <CoursesOverview />, element );
}
