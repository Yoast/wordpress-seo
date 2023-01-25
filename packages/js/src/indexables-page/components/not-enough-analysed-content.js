import PropTypes from "prop-types";

import { __, sprintf } from "@wordpress/i18n";

import IndexablesPageCard from "./indexables-card";
import IndexableTitleLink from "./indexable-title-link";
import { useState, useCallback, Fragment } from "@wordpress/element";
import { Button, Link } from "@yoast/ui-library";
import { IndexableLinkCount } from "../indexables-page";

/**
 * Renders the four indexable tables.
 *
 * @returns {WPElement} A div containing the empty state page.
 */
const NotEnoughAnalysedContent = ( { indexablesList, seoEnabled } ) => {
	const [ step, setStep ] = useState( 5 );
	const [ numberOfVisibleIndexables, setNumberOfVisibleIndexables ] = useState( step );

	const handleShowMore = useCallback( ( e ) => {
		e.preventDefault();
		const number = numberOfVisibleIndexables + step > indexablesList.length ? indexablesList.length : numberOfVisibleIndexables + step;
		const newStep = indexablesList.length - number > step ? step :  indexablesList.length - number;
		setNumberOfVisibleIndexables( number );
		setStep( newStep );
	}, [ numberOfVisibleIndexables, setNumberOfVisibleIndexables ] );

	const title = seoEnabled
		? sprintf(
			/* translators: %1$s expands to the number of posts without a focus keyphrase */
			__(
				"Posts and pages without a focus keyphrase (%1$s)",
				"wordpress-seo"
			),
			indexablesList.length
		)
		: sprintf(
			/* translators: %1$s expands to the number of posts which hasn't been analyzed */
			__(
				"Posts and pages that haven't been analyzed (%1$s)",
				"wordpress-seo"
			),
			indexablesList.length
		);

	const description = seoEnabled
		? <Fragment>
			<p>{ __( "Most of your posts and pages don't have a focus keyphrase yet. Help us to analyze your content by adding focus keyphrases. Below, we ordered your posts and pages on the highest number of incoming links, so you can start adding focus keyphrases for your most important content first.", "wordpress-seo" ) }</p>
			<p className="yst-mt-4">{ __( "Clicking the 'Add focus keyphrase' button will open the editor in a new browser tab. Once you're done, don't forget to click 'Update'.", "wordpress-seo" ) }</p>
		</Fragment>
		: <p>{ __( "Most of your posts and pages haven't been analyzed yet. Help us to analyze your content by opening and updating it. Clicking the 'Open editor' button will open the editor in a new browser tab. Make sure to click 'Update' at the top of that page.", "wordpress-seo" ) }</p>;

	return <div className="yst-max-w-full">
		<div
			id="start-writing-content"
			className="yst-max-w-7xl yst-grid yst-grid-cols-1 2xl:yst-grid-cols-2 2xl:yst-grid-flow-row yst-gap-6"
		>
			<IndexablesPageCard
				title={ title }
			>
				{ description }
				<ul className="yst-divide-y yst-divide-slate-200">
					{ indexablesList.slice( 0, numberOfVisibleIndexables ).map(
						( indexable, index ) => {
							return <li
								key={ `article-${ index }-li` }
								className={ "yst-my-0 yst-max-w-none yst-font-medium yst-text-slate-700 yst-flex yst-flex-row yst-items-center yst-h-14 last:yst-border-b-slate-200 last:yst-border-b-1" }
							>
								<IndexableLinkCount key={ `no-keyphrase-indexable-${ indexable.id }` } count={ parseInt( indexable.incoming_link_count, 10 ) } />
								<IndexableTitleLink
									indexable={ indexable }
									showType={ false }
									additionalClassNames="yst-ml-2.5"
								/>
								<Button
									as="a"
									type="button"
									href={ "/wp-admin/post.php?action=edit&post=" + indexable.object_id }
									target="_blank"
									rel="noopener noreferrer"
									variant="secondary"
									className="yst-button yst-button--secondary yst-text-slate-700 yst-shrink-0"
								>
									{ seoEnabled ? __( "Add focus keyphrase", "wordpress-seo" ) : __( "Open editor", "wordpress-seo" ) }
								</Button>
							</li>;
						}
					)
					}
				</ul>
				{
					( numberOfVisibleIndexables < indexablesList.length ) &&
					<div className="yst-flex yst-justify-center yst-border-solid yst-border-t-[1px] yst-pt-6">
						<Link as="button" onClick={ handleShowMore }>
							{
								/* translators: %1$s expands to the step value (i.e. the number of posts to be added to the visible list) */
								sprintf(
									__(
										"Show %1$s more...",
										"wordpress-seo"
									),
									step
								)
							}
						</Link>
					</div>
				}
			</IndexablesPageCard>
		</div>
	</div>;
};

NotEnoughAnalysedContent.propTypes = {
	indexablesList: PropTypes.arrayOf( PropTypes.object ).isRequired,
	seoEnabled: PropTypes.bool.isRequired,
};

export default NotEnoughAnalysedContent;
