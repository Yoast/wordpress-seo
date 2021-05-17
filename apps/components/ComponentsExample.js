import { __ } from "@wordpress/i18n";

import { Alert, CourseDetails, FullHeightCard, StarRating, Warning } from "@yoast/components";
import { getCourseFeed, getDirectionalStyle, makeOutboundLink } from "@yoast/helpers";
import React from "react";
import styled from "styled-components";

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
		margin: ${ getDirectionalStyle( "0 16px 16px 0", "0 0 16px 16px" ) };
	}
`;

const CornerstoneLink    = makeOutboundLink();
const NonYoastLink       = makeOutboundLink();
const YoastLink          = makeOutboundLink();
const YoastShortLink     = makeOutboundLink();
const YoastLinkCustomRel = makeOutboundLink();

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
			isAlertDismissed: false,
		};

		this.getFeed( "free" );
		this.onAlertDismissed = () => {
			this.setState( { isAlertDismissed: true } );
		};
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
	 * Renders a Yoast Alert.
	 *
	 * @returns {React.Element} The rendered alert.
	 */
	renderAlert( type ) {
		return <Alert key={ type } type={ type }>
			{ `This is an Alert of type: "${ type }".` }
			<br />
			You can add some content.
			Including a link <YoastShortLink href="https://yoa.st/why-permalinks/">yoa.st/why-permalinks</YoastShortLink>
		</Alert>;
	}

	updateStars( event ) {
		this.setState({
			input: event.target.value
		} );
	}

	/**
	 * Renders all the Component examples.
	 *
	 * @returns {React.Element} The rendered list of the Component examples.
	 */
	render() {
		const courses = this.state.courses;

		/* eslint-disable react/jsx-no-target-blank */
		return (
			<React.Fragment>
				<Container>
					<h2>Yoast alerts</h2>
					{ [ "error", "info", "success", "warning" ].map( this.renderAlert ) }
					{ ! this.state.isAlertDismissed && <Alert type="info" onDismissed={ this.onAlertDismissed }>
						This is the dismissable variant.
						<br />
						You will have to wrap it in order to do actually dismiss it.
						<br />
						Which is currently done through the state of this example.
					</Alert> }
					<h2>Yoast warning</h2>
					<Warning
						message={ [
							"This is a warning message that also accepts arrays, so you can pass links such as ",
							<CornerstoneLink
								key="1"
								href="https://yoa.st/metabox-help-cornerstone"
							>cornerstone content</CornerstoneLink>,
							", for example.",
							<p key="2">This spans to multiple lines.</p>,
						] }
					/>
					<h2>Star rating</h2>
					<i>Accepts a rating from 0-5 and colors the stars yellow accordingly</i>
					<StarRating rating={ 3.5 } />
					<h2>Outbound links</h2>
					<p>
						<NonYoastLink href="http://www.example.org">example.org</NonYoastLink>
						<br /><small>expected: target=&quot;_blank&quot; rel=&quot;noopener&quot; and visually hidden message</small>
					</p>
					<p>
						<YoastLink href="https://yoast.com">yoast.com</YoastLink>
						<br /><small>expected: target=&quot;_blank&quot; and visually hidden message</small>
					</p>
					<p>
						<YoastShortLink href="https://yoa.st/why-permalinks/">yoa.st/why-permalinks</YoastShortLink>
						<br /><small>expected: target=&quot;_blank&quot; and visually hidden message</small>
					</p>
					<p>
						<YoastLinkCustomRel href="https://yoast.com/" rel="bookmark nofollow">yoast.com (custom rel attribute)</YoastLinkCustomRel>
						<br /><small>expected: target=&quot;_blank&quot; rel=&quot;bookmark nofollow&quot; and visually hidden message</small>
					</p>
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
									<CourseDetails
										description={ course.content }
										courseUrl={ course.link }
										readMoreLinkText={ course.readMoreLinkText }
										ctaButtonData={ this.getButtonData( course ) }
										isBundle={ course.isBundle }
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
