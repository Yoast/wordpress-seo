import { Badge, Button, Label, SkeletonLoader, Tooltip, useToggleState } from "@yoast/ui-library";
import classNames from "classnames";
import { SCORE_META } from "../score-meta";

/**
 * @type {import("../index").Score} Score
 */

/**
 * @type {{listItem: string, score: string}}
 */
const CLASSNAMES = {
	listItem: "yst-flex yst-items-center yst-py-3 first:yst-pt-0 last:yst-pb-0 yst-border-b last:yst-border-b-0",
	score: "yst-shrink-0 yst-w-3 yst-aspect-square yst-rounded-full",
	label: "yst-ml-3 yst-mr-2",
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
				<SkeletonLoader className="yst-w-7 yst-mr-3">1</SkeletonLoader>
				<SkeletonLoader className="yst-ml-auto yst-button yst-button--small">View</SkeletonLoader>
			</li>
		) ) }
	</ul>
);

/**
 * @param {Score} score The score.
 * @returns {JSX.Element} The element.
 */
const ScoreListItem = ( { score } ) => {
	const [ isVisible, , , show, hide ] = useToggleState( false );
	// eslint-disable-next-line no-undefined
	const tooltipId = SCORE_META[ score.name ].tooltip ? `tooltip__${ score.name }` : undefined;

	return (
		<li className={ CLASSNAMES.listItem }>
			<span className="yst-relative yst-flex yst-items-center" onMouseEnter={ show } onMouseLeave={ hide } aria-describedby={ tooltipId }>
				<span className={ classNames( CLASSNAMES.score, SCORE_META[ score.name ].color ) } />
				<Label as="span" className={ classNames( CLASSNAMES.label, "yst-leading-4 yst-py-1.5" ) }>
					{ SCORE_META[ score.name ].label }
				</Label>
				<Badge variant="plain" className={ classNames( score.links.view && "yst-mr-3" ) }>{ score.amount }</Badge>
				{ SCORE_META[ score.name ].tooltip && isVisible && (
					<Tooltip id={ tooltipId }>{ SCORE_META[ score.name ].tooltip }</Tooltip>
				) }
			</span>
			{ score.links.view && (
				<Button as="a" variant="secondary" size="small" href={ score.links.view } className="yst-ml-auto">View</Button>
			) }
		</li>
	);
};

/**
 * @param {string} [className] The class name for the UL.
 * @param {Score[]} scores The scores.
 * @returns {JSX.Element} The element.
 */
export const ScoreList = ( { className, scores } ) => (
	<ul className={ className }>
		{ scores.map( ( score ) => <ScoreListItem key={ score.name } score={ score } /> ) }
	</ul>
);
