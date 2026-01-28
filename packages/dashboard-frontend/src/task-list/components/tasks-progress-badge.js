import { Badge } from "@yoast/ui-library";
import { __, sprintf } from "@wordpress/i18n";
import { CheckCircleIcon } from "@heroicons/react/outline";

/**
 * Converts polar coordinates to Cartesian coordinates.
 *
 * Used for positioning points along a circle (e.g. SVG arcs),
 * where angles are provided in degrees and start from the top (12 o'clock).
 *
 * @param {number} cx - X coordinate of the circle center
 * @param {number} cy - Y coordinate of the circle center
 * @param {number} r - Radius of the circle
 * @param {number} angleDeg - Angle in degrees (0° = top, increases clockwise)
 * @returns {{ x: number, y: number }} Cartesian coordinates for the given angle
 */
const polarToCartesian = ( cx, cy, r, angleDeg ) => {
	const angleRad = ( ( angleDeg - 90 ) * Math.PI ) / 180;
	return {
		x: cx + r * Math.cos( angleRad ),
		y: cy + r * Math.sin( angleRad ),
	};
};

/**
 * The ProgressPie component displays progress in the form of a pie.
 *
 * @param {number} completedValue Number of completed tasks, should be less than or equal to totalTasks.
 * @param {number} totalValue Total number of tasks.
 * @returns {JSX.Element} The progress pie.
 */
const ProgressPie = ( {
	totalValue,
	completedValue,
} ) => {
	const svgSize = 16;
	const innerSize = 13.5;
	const strokeWidth = 1.5;
	const borderColor = "#16A34A";
	const fillColor = "#86EFAC";
	const progress = totalValue > 0 ? Math.min( 1, Math.max( 0, completedValue / totalValue ) ) : 0;

	const cx = svgSize / 2;
	const cy = svgSize / 2;

	// Stroke radius inside the circle.
	const rStroke = innerSize / 2 - strokeWidth / 2;

	// Fill touches the inner edge of the stroke.
	const rFill = rStroke - strokeWidth / 2;

	const angle = progress * 360;
	const isFull = progress >= 0.999999;

	const largeArcFlag = angle > 180 ? 1 : 0;
	const sweepFlag = 1;

	const strokeStart = polarToCartesian( cx, cy, rStroke, 0 );
	const strokeEnd = polarToCartesian( cx, cy, rStroke, angle );

	const fillStart = polarToCartesian( cx, cy, rFill, 0 );
	const fillEnd = polarToCartesian( cx, cy, rFill, angle );

	const borderPath = `
    M ${strokeStart.x} ${strokeStart.y}
    A ${rStroke} ${rStroke} 0 ${largeArcFlag} ${sweepFlag} ${strokeEnd.x} ${strokeEnd.y}
  `;

	const fillPath = `
    M ${cx} ${cy}
    L ${fillStart.x} ${fillStart.y}
    A ${rFill} ${rFill} 0 ${largeArcFlag} ${sweepFlag} ${fillEnd.x} ${fillEnd.y}
    Z
  `;

	return (
		<svg
			width={ svgSize }
			height={ svgSize }
			viewBox={ `0 0 ${svgSize} ${svgSize}` }
			fill="none"
		>
			{ /* Track */ }
			<circle
				cx={ cx }
				cy={ cy }
				r={ rStroke }
				stroke="#CBD5E1"
				strokeWidth={ strokeWidth }
			/>

			{ /* Fill */ }
			{ progress > 0 && ! isFull && <path d={ fillPath } fill={ fillColor } /> }
			{ isFull && <circle cx={ cx } cy={ cy } r={ rFill } fill={ fillColor } /> }

			{ /* Border progress */ }
			{ progress > 0 && ! isFull && (
				<path
					d={ borderPath }
					stroke={ borderColor }
					strokeWidth={ strokeWidth }
					fill="none"
					strokeLinecap="round"
				/>
			) }
			{ isFull && (
				<circle
					cx={ cx }
					cy={ cy }
					r={ rStroke }
					stroke={ borderColor }
					strokeWidth={ strokeWidth }
					fill="none"
				/>
			) }
		</svg>
	);
};

/**
 * The tasks progresss badge.
 *
 * @param {string} [label=""] The label of the badge.
 * @param {number} completedTasks Number of completed tasks, should be less than or equal to totalTasks.
 * @param {number} totalTasks Total number of tasks.
 * @returns {JSX.Element} The TasksProgressBadge component.
 */
export const TasksProgressBadge = ( { label, completedTasks, totalTasks } ) => {
	const screenReaderText = sprintf(
		/* translators: %1$d expands to the number of completed tasks, %2$d expands to the total number of tasks. */
		__( "%1$d out of %2$d tasks completed", "wordpress-seo" ),
		completedTasks,
		totalTasks
	);

	return <Badge size="large" className="yst-bg-white yst-border yst-border-slate-200 yst-ps-1.5 yst-pe-2 yst-shadow-sm">
		<span className="yst-sr-only">{ screenReaderText }</span>
		<span className="yst-flex yst-gap-1 yst-justify-between yst-items-center">
			{ completedTasks >= totalTasks && <CheckCircleIcon className="yst-text-green-500 yst-h-4 yst-w-4 yst-shrink-0" /> }
			{ completedTasks < totalTasks && <ProgressPie completedValue={ completedTasks } totalValue={ totalTasks } /> }
			<span className="yst-text-xs">
				<span className="yst-text-slate-600 yst-font-medium">{ completedTasks }</span><span className="yst-text-slate-500 yst-font-normal">/{ totalTasks }</span>
			</span>
			{ label && <span className="yst-text-xs yst-font-medium yst-text-slate-900"> { label } </span> }
		</span>
	</Badge>;
};
