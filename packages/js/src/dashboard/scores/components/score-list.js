import { Badge, Button, Label, SkeletonLoader, TooltipContainer, TooltipTrigger, TooltipWithContext } from "@yoast/ui-library";
import classNames from "classnames";
import { SCORE_META } from "../score-meta";
import { __ } from "@wordpress/i18n";

/**
 * @type {import("../index").Score} Score
 */

/**
 * @type {{listItem: string, score: string}}
 */
const CLASSNAMES = {
	listItem: "yst-flex yst-items-center yst-py-3 first:yst-pt-0 last:yst-pb-0 yst-border-b last:yst-border-b-0",
	score: "yst-shrink-0 yst-w-3 yst-aspect-square yst-rounded-full",
	label: "yst-ms-3 yst-me-2",
};

/**
 * @param {string} [className] The class name for the UL.
 * @returns {JSX.Element} The element.
 */
export const ScoreListSkeletonLoader = ( { className } ) => (
	<ul className={ className }>
		{ Object.entries( SCORE_META ).map( ( [ name, { label } ] ) => (
			<li
				key={ `skeleton-loader--${ name }` }
				className={ CLASSNAMES.listItem }
			>
				<SkeletonLoader className={ CLASSNAMES.score } />
				<SkeletonLoader className={ CLASSNAMES.label }>{ label }</SkeletonLoader>
				<SkeletonLoader className="yst-w-7 yst-me-3">1</SkeletonLoader>
				<SkeletonLoader className="yst-ms-auto yst-button yst-button--small">{ __( "View", "wordpress-seo" ) }</SkeletonLoader>
			</li>
		) ) }
	</ul>
);

/**
 * @param {Score} score The score.
 * @returns {JSX.Element} The element.
 */
const ScoreListItemContent = ( { score } ) => (
	<>
		<span className={ classNames( CLASSNAMES.score, SCORE_META[ score.name ].color ) } />
		<Label as="span" className={ classNames( CLASSNAMES.label, "yst-leading-4 yst-py-1.5" ) }>
			{ SCORE_META[ score.name ].label }
		</Label>
		<Badge variant="plain" className={ classNames( score.links.view && "yst-me-3" ) }>{ score.amount }</Badge>
	</>
);

/**
 * @param {Score} score The score.
 * @param {string} idSuffix The suffix for the IDs.
 * @returns {JSX.Element} The element.
 */
const ScoreListItemContentWithTooltip = ( { score, idSuffix } ) => {
	const id = `tooltip--${ idSuffix }__${ score.name }`;

	return (
		<TooltipContainer>
			<TooltipTrigger className="yst-flex yst-items-center" ariaDescribedby={ id }>
				<ScoreListItemContent score={ score } />
			</TooltipTrigger>
			<TooltipWithContext id={ id } className="max-[784px]:yst-max-w-full">
				{ SCORE_META[ score.name ].tooltip }
			</TooltipWithContext>
		</TooltipContainer>
	);
};

/**
 * @param {Score} score The score.
 * @param {string} idSuffix The suffix for the IDs.
 * @returns {JSX.Element} The element.
 */
const ScoreListItem = ( { score, idSuffix } ) => {
	const Content = SCORE_META[ score.name ].tooltip ? ScoreListItemContentWithTooltip : ScoreListItemContent;

	return (
		<li className={ CLASSNAMES.listItem }>
			<Content score={ score } idSuffix={ idSuffix } />
			{ score.links.view && (
				<Button as="a" variant="secondary" size="small" href={ score.links.view } className="yst-ms-auto">{ __( "View", "wordpress-seo" ) }</Button>
			) }
		</li>
	);
};

/**
 * @param {string} [className] The class name for the UL.
 * @param {Score[]} scores The scores.
 * @param {string} idSuffix The suffix for the IDs.
 * @returns {JSX.Element} The element.
 */
export const ScoreList = ( { className, scores, idSuffix } ) => (
	<ul className={ className }>
		{ scores.map( ( score ) => <ScoreListItem key={ score.name } score={ score } idSuffix={ idSuffix } /> ) }
	</ul>
);
