import React from "react";
import styled from "styled-components";

import getPostFeed from "../utils/getPostFeed";

import {
	DashboardWidgetSeoAssessment,
	DashboardWidgetWordpressFeed,
} from "../composites/Plugin/DashboardWidget";

export const DashboardWidgetContainer = styled.div`
   min-height: 700px;
   background-color: white;
`;

export const DashboardContainer = styled.div`
	padding: 8px;
	border: 1px solid black;
	width: 400px;
`;

/**
 * Returns the DashboardWidget component.
 *
 * @returns {ReactElement} The DashboardWidget component.
 */
export default class DashboardWidget extends React.Component {
	/**
	 * Creates the components and initializes its state.
	 */
	constructor() {
		super();

		this.state = {
			seoAssessmentItems: [
				{
					value: 33,
					color: "#F00",
					html: "Posts with a <b>bad</b> score",
				},
				{
					value: 20,
					color: "#FF0",
					html: "Posts with a <b>decent</b> score",
				},
				{
					value: 47,
					color: "#0F0",
					html: "Posts with a <b>good</b> score",
				},
			],
			feed: null,
		};

		this.getFeed( "free" );
	}

	/**
	 * Fetches data from the yoast.com feed, parses it and sets it to the state.
	 *
	 * @returns {void}
	 */
	getFeed() {
		// Developer note: this link should -not- be converted to a shortlink.
		getPostFeed( "https://yoast.com/feed/widget/", 3 )
			.then( ( feed ) => {
				feed.title = "Feed title";
				feed.link  = "https://www.yoast.com";

				feed.items = feed.items.map( ( item ) => {
					item.description = item.description;
					item.description = item.description.replace( `The post ${ item.title } appeared first on Yoast.`, "" ).trim();
					item.content = item.content;

					return item;
				} );

				this.setState( { feed } );
			} )
			/* eslint-disable-next-line no-console */
			.catch( error => console.log( error ) );
	}

	/**
	 * Renders all the Dashboard widget example.
	 *
	 * @returns {ReactElement} The rendered Dashboard widget example.
	 */
	render() {
		const feed = this.state.feed;

		return (
			<DashboardWidgetContainer>
				<DashboardContainer>
					<DashboardWidgetSeoAssessment
						seoAssessmentText="Your SEO score is decent overall, but can be improved! Get to work!"
						seoAssessmentItems={ this.state.seoAssessmentItems }
					/>
					{ feed && <DashboardWidgetWordpressFeed
						feed={ feed }
						footerHtml="View our blog on yoast.com!"
					/> }
				</DashboardContainer>
			</DashboardWidgetContainer>
		);
	}
}
