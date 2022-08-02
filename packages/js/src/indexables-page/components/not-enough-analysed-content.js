import PropTypes from "prop-types";

import { __, sprintf } from "@wordpress/i18n";

import SimpleCard from "./simple-card";
import { useState, useCallback } from "@wordpress/element";
import { Button, Link } from "@yoast/ui-library";
import { IndexableLinkCount } from "../indexables-page";
/* eslint-disable camelcase */
/* eslint-disable no-warning-comments */
/* eslint-disable complexity */

/**
 * Renders the four indexable tables.
 *
 * @returns {WPElement} A div containing the empty state page.
 */
const NotEnoughAnalysedContent = ( { indexablesList } ) => {
	const [ numberOfVisibleIndexables, setNumberOfVisibleIndexables ] = useState( 5 );

	const handleShowMore = useCallback( ( e ) => {
		e.preventDefault();
		const number = numberOfVisibleIndexables + 5 > indexablesList.length ? indexablesList.length : numberOfVisibleIndexables + 5;
		setNumberOfVisibleIndexables( number );
	}, [ numberOfVisibleIndexables, setNumberOfVisibleIndexables ] );
	return <div className="yst-max-w-full yst-mt-6">
		<div
			id="start-writing-content"
			className="yst-max-w-7xl yst-grid yst-grid-cols-1 2xl:yst-grid-cols-2 2xl:yst-grid-rows-2 2xl:yst-grid-flow-row 2xl:yst-auto-rows-fr yst-gap-6"
		>
			<SimpleCard
				title={
					/* translators: %1$s expands to the number of posts without a focus keyphrase */
					sprintf(
						__(
							"Posts without a focus keyphrase (%1$s)",
							"wordpress-seo"
						),
						indexablesList.length
					)
				}
			>
				<ul className="yst-divide-y yst-divide-gray-200">
					{ indexablesList.slice( 0, numberOfVisibleIndexables ).map(
						( indexable, index ) => {
							return <li
								key={ `article-${ index }-li` }
								className={ "yst-my-0 yst-max-w-none yst-font-medium yst-text-gray-700 yst-flex yst-flex-row yst-items-center yst-h-14 " }
							>
								<IndexableLinkCount key={ `no-keyphrase-indexable-${ indexable.id }` } count={ parseInt( indexable.incoming_link_count, 10 ) } />
								<span className="yst-min-w-0 yst-rounded-md yst-flex yst-items-center yst-gap-2 yst-no-underline yst-text-inherit yst-grow">
									<span className="yst-text-ellipsis yst-whitespace-nowrap yst-overflow-hidden">{ indexable.breadcrumb_title }</span>
								</span>
								<Button
									as="a"
									href={ "/wp-admin/post.php?action=edit&post=" + indexable.object_id }
									target="_blank"
									rel="noopener noreferrer"
									variant="secondary"
									className="yst-shrink-0"
								>
									{ __( "Add focus keyphrase", "wordpress-seo" ) }
								</Button>
							</li>;
						}
					)
					}
				</ul>
				<div className="yst-flex yst-justify-center">
					<Link as="button" onClick={ handleShowMore }>
						Show 5 more...
					</Link>
				</div>
			</SimpleCard>

		</div>
	</div>;
};

NotEnoughAnalysedContent.propTypes = {
	indexablesList: PropTypes.arrayOf( PropTypes.object ).isRequired,
};

export default NotEnoughAnalysedContent;
