import { Badge, useSvgAria } from "@yoast/ui-library";
import { LockClosedIcon } from "@heroicons/react/solid";

const HighlightingUpsellBadge = () => {
	const svgAriaProps = useSvgAria();
	console.log( "TEST" );

	return <div className="yst-root">
		<Badge size="small" variant="upsell">
			<LockClosedIcon className="yst-w-2.5 yst-h-2.5 yst-shrink-0" { ...svgAriaProps } />
		</Badge>
	</div>;
};

export default HighlightingUpsellBadge;
