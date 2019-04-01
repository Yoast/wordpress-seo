import React from "react";
import styled from "styled-components";

import ExamplesContainer from "./ExamplesContainer";

import { getPostFeed  } from "@yoast/helpers";
import { ArticleList } from "@yoast/components";
import { SiteSEOReport } from "@yoast/analysis-report";

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
			siteSEOReportItems: [
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

		this.getFeed();
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
				feed.items = feed.items.map( ( item ) => {
					// The implementation on wordpress-seo makes use of jQuery for escaping.
					item.description = item.description;
					item.description = item.description.replace( `The post ${ item.title } appeared first on Yoast.`, "" ).trim();

					return item;
				} );

				this.setState( { feed } );
			} )
			/* eslint-disable-next-line no-console */
			.catch( error => console.error( error ) );
	}

	/**
	 * Renders all the Dashboard widget example.
	 *
	 * @returns {ReactElement} The rendered Dashboard widget example.
	 */
	render() {
		const feed = this.state.feed;

		return (
			<ExamplesContainer>
				<DashboardContainer>
					<SiteSEOReport
						seoAssessmentText="Your SEO score is decent overall, but can be improved! Get to work!"
						seoAssessmentItems={ this.state.siteSEOReportItems }
					/>
					{ feed && <ArticleList
						feed={ feed }
						footerLinkText="View our blog on yoast.com!"
					/> }
				</DashboardContainer>
			</ExamplesContainer>
		);
	}
}
