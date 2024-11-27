import { useEffect, useMemo, useRef } from "@wordpress/element";
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
 * @param {EventListener} onKeydown The keydown event listener.
 * @returns {void}
 */
const useKeydown = ( onKeydown ) => {
	useEffect( () => {
		document.addEventListener( "keydown", onKeydown );
		return () => {
			document.removeEventListener( "keydown", onKeydown );
		};
	}, [ onKeydown ] );
};

/**
 * @param {Score} score The score.
 * @param {string} idSuffix The suffix for the IDs.
 * @returns {JSX.Element} The element.
 */
const ScoreListItem = ( { score, idSuffix } ) => {
	const [ isVisible, , , show, hide ] = useToggleState( false );
	const ref = useRef();

	const TooltipTrigger = SCORE_META[ score.name ].tooltip ? "button" : "span";
	const tooltipTriggerProps = useMemo( () => SCORE_META[ score.name ].tooltip ? {
		onFocus: show,
		onMouseEnter: show,
		"aria-describedby": `tooltip--${ idSuffix }__${ score.name }`,
		"aria-disabled": true,
		className: "yst-rounded-md yst-cursor-default focus:yst-outline-none focus-visible:yst-ring-primary-500 focus-visible:yst-border-primary-500 focus-visible:yst-ring-2 focus-visible:yst-ring-offset-2 focus-visible:yst-bg-white focus-visible:yst-border-opacity-0",
	} : {}, [ show ] );

	useKeydown( ( event ) => {
		if ( event.key === "Escape" ) {
			hide();
			ref.current?.blur();
		}
	} );

	return (
		<li className={ CLASSNAMES.listItem }>
			<div className="yst-tooltip-container">
				<TooltipTrigger
					ref={ ref }
					{ ...tooltipTriggerProps }
					className={ classNames( tooltipTriggerProps.className, "yst-flex yst-items-center" ) }
				>
					<span className={ classNames( CLASSNAMES.score, SCORE_META[ score.name ].color ) } />
					<Label as="span" className={ classNames( CLASSNAMES.label, "yst-leading-4 yst-py-1.5" ) }>
						{ SCORE_META[ score.name ].label }
					</Label>
					<Badge variant="plain" className={ classNames( score.links.view && "yst-mr-3" ) }>{ score.amount }</Badge>
				</TooltipTrigger>
				{ SCORE_META[ score.name ].tooltip && (
					<Tooltip
						id={ tooltipTriggerProps[ "aria-describedby" ] }
						className={ classNames( ! isVisible && "yst-hidden" ) }
					>
						{ SCORE_META[ score.name ].tooltip }
					</Tooltip>
				) }
			</div>
			{ score.links.view && (
				<Button as="a" variant="secondary" size="small" href={ score.links.view } className="yst-ml-auto">View</Button>
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
