import { CheckCircleIcon } from "@heroicons/react/outline";
import { EllipseWithInnerDot } from ".";
import { __ } from "@wordpress/i18n";

/**
 * The TaskStatusIcon component to display the status of a task. It indicates whether the task is completed or loading.
 * It adds appropriate ARIA labels for accessibility.
 *
 * @param {boolean} isCompleted Whether the task is completed.
 * @param {boolean} isLoading Whether the task is loading.
 * @returns {JSX.Element} The TaskStatusIcon component.
 */
export const TaskStatusIcon = ( { isCompleted, isLoading } ) => {
	if ( isLoading ) {
		return <EllipseWithInnerDot className="yst-w-6 yst-text-slate-200 yst-shrink-0" role="img" aria-label={ __( "Task loading", "wordpress-seo" ) } />;
	}
	if ( isCompleted ) {
		return  <CheckCircleIcon className="yst-w-6 yst-text-green-500 yst-shrink-0" role="img" aria-label={ __( "Task completed", "wordpress-seo" ) } />;
	}
	return <EllipseWithInnerDot className="yst-w-6 yst-text-primary-500 yst-shrink-0" role="img" aria-label={ __( "Task not completed", "wordpress-seo" ) } />;
};
