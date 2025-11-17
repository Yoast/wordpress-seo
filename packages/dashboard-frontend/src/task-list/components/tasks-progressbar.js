import { ProgressBar, SkeletonLoader, Title } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";

/**
 * Component displaying a progress bar for tasks.
 *
 * @param {number} completedTasks Number of completed tasks.
 * @param {number} totalTasks Total number of tasks.
 * @param {boolean} isLoading Whether the tasks are loading.
 * @returns {JSX.Element} The TasksProgressBar component.
 */
export const TasksProgressBar = ( { completedTasks, totalTasks, isLoading } ) => {
	return (
		<div>
			<Title as="h2" className="yst-text-lg yst-font-medium yst-text-slate-900 yst-mb-2">{ __( "Tasks", "wordpress-seo" ) }</Title>
			<div className="yst-flex yst-gap-3 yst-items-center">
				{ isLoading ? <>
					<SkeletonLoader className="yst-w-[184px] yst-h-1.5" /><SkeletonLoader className="yst-w-9 yst-h-5" />
				</> : <>
					<ProgressBar
						label="Tasks Progress"
						progress={ completedTasks }
						min={ 0 }
						max={ totalTasks }
						className="yst-w-[184px] yst-h-1.5"
						progressClassName="yst-bg-green-500"
					/>
					<span className="yst-text-tiny yst-font-medium yst-leading-5">
						<span className="yst-text-slate-600">{ completedTasks }</span><span className="yst-text-slate-500">/{ totalTasks }</span>
					</span>
				</>
				}
			</div>
		</div>
	);
};
