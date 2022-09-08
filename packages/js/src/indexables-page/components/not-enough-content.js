/* global wpseoIndexablesPageData */
import apiFetch from "@wordpress/api-fetch";
import { ExternalLinkIcon, PlusIcon } from "@heroicons/react/outline";
import { useEffect, useState, useCallback, Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { makeOutboundLink } from "@yoast/helpers";
import { Checkbox } from "@yoast/ui-library";

import IndexablesPageCard from "./indexables-card";
/* eslint-disable no-warning-comments */

const Link = makeOutboundLink();

const readingList = [
	{
		title: "How to write a blog post: A step-by-step guide from preparation to publication",
		link: wpseoIndexablesPageData.shortlinks.howToWriteABlogPost,
	},
	{
		title: "10 tips for an awesome and SEO-friendly blog post",
		link: wpseoIndexablesPageData.shortlinks.friendlyBlogPost,
	},
	{
		title: "Keyword research for SEO: the ultimate guide",
		link: wpseoIndexablesPageData.shortlinks.keywordResearchUltimateGuide,
	},
	{
		title: "How to start a blog",
		link: wpseoIndexablesPageData.shortlinks.howToStartABlog,
	},
	{
		title: "SEO copywriting must-reads",
		link: wpseoIndexablesPageData.shortlinks.seoCopywritingMustRead,
	},
];

/**
 * Renders the four indexable tables.
 *
 * @returns {WPElement} A div containing the empty state page.
 */
const NotEnoughContent = () => {
	const [ readingListState, setReadingListState ] = useState(
		[ false, false, false, false, false ]
	);

	useEffect( async() => {
		try {
			const response = await apiFetch( {
				path: "yoast/v1/get_reading_list",
				method: "GET",
			} );

			const parsedResponse = await response.json;

			setReadingListState( parsedResponse.state );
		} catch ( error ) {
			return false;
		}
	}, [] );

	const flagArticleAsRead = useCallback( async( e ) => {
		const index = parseInt( e.currentTarget.dataset.index, 10 );
		const oldState = [ ...readingListState ];
		const newState = [ ...readingListState ];
		newState[ index ] = e.target.checked;
		setReadingListState( newState );
		try {
			const response = await apiFetch( {
				path: "yoast/v1/set_reading_list",
				method: "POST",
				data: { state: newState },
			} );

			const parsedResponse = await response.json;

			if ( ! parsedResponse.success ) {
				setReadingListState( oldState );
				return false;
			}
		} catch ( error ) {
			setReadingListState( oldState );
			return false;
		}
	}, [ readingListState, setReadingListState, apiFetch ] );

	return <div className="yst-max-w-full">
		<div
			id="start-writing-content"
			className="yst-max-w-7xl yst-grid yst-grid-cols-1 2xl:yst-grid-cols-2 2xl:yst-grid-flow-row yst-gap-6"
		>
			<IndexablesPageCard title={ __( "Start writing content!", "wordpress-seo" ) }>
				<div className="yst-mb-6 yst-text-gray-500">
					<p>{ __( "You need to have more content on your site to make your website rank well in the search engines.", "wordpress-seo" ) }</p><br />
					<p>
						{ __( "There are three major elements you need to consider when writing good content for SEO:", "wordpress-seo" ) }
					</p>
					<p>
						{ __( "keyword strategy, site structure and copywriting.", "wordpress-seo" ) }
					</p>
					<br />
					<p>{ __( "Don't know where to start? Have a look at our recommended reading list!", "wordpress-seo" ) }</p>
				</div>
				<Link
					href={ "/wp-admin/post-new.php" }
					className="yst-button yst-button--primary yst-text-white"
				>
					<PlusIcon className="yst-w-4 yst-h-4 yst-mr-1" />{ __( "Start writing a new post", "wordpress-seo" ) }
				</Link>
			</IndexablesPageCard>
			<IndexablesPageCard title={ __( "Recommended reading list", "wordpress-seo" ) }>
				<ul className="yst-divide-y yst-divide-gray-200">
					{ readingList.map(
						( article, index ) => {
							return <li
								key={ `article-${ index }-li` }
								className={ "yst-my-0 yst-max-w-none yst-font-medium yst-text-gray-700 yst-flex yst-flex-row yst-items-center yst-h-14 " }
							>
								<Checkbox
									id={ `article-${ index }-checkbox` }
									name={ `article-${ index }-checkbox` }
									className="yst-mr-1 yst-text-white"
									label=""
									value=""
									onChange={ flagArticleAsRead }
									data-index={ index }
									checked={ readingListState[ index ] }
								/>
								{ ( readingListState[ index ] )
									? <Fragment>
										<span className="yst-font-medium yst-text-gray-400 yst-text-sm yst-line-through yst-mr-2">{ article.title }</span>
										<ExternalLinkIcon className="yst-shrink-0 yst-h-[13px] yst-w-[13px] yst-text-gray-400" />
									</Fragment>
									: <Link href={ article.link } className="yst-min-w-0 yst-rounded-md focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-offset-2 focus:yst-ring-primary-500 yst-flex yst-items-center yst-gap-2 yst-no-underline yst-text-inherit hover:yst-text-indigo-500">
										<span className="yst-text-ellipsis yst-whitespace-nowrap yst-overflow-hidden">{ article.title }</span><ExternalLinkIcon className="yst-shrink-0 yst-h-[13px] yst-w-[13px]" />
									</Link>
								}
							</li>;
						}
					)
					}
				</ul>
			</IndexablesPageCard>
		</div>
	</div>;
};

export default NotEnoughContent;
