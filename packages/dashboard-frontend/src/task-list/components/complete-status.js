import { CheckCircleIcon } from "@heroicons/react/solid";
import { __ } from "@wordpress/i18n";
import { useSvgAria } from "@yoast/ui-library";

/**
 * Component to display the completed status of a task.
 * @returns {JSX.Element} The CompleteStatus component.
 */
export const CompleteStatus = () => {
	const svgAriaProps = useSvgAria();
	return <span className="yst-text-xs yst-text-slate-600 yst-flex yst-gap-0.5 yst-items-center">
		<CheckCircleIcon className="yst-w-4 yst-text-green-500" { ...svgAriaProps } />
		{ __( "Completed", "wordpress-seo" ) }
	</span>;
};

