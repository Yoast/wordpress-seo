import { ProgressBar, SkeletonLoader, Label } from "@yoast/ui-library";
import { __, sprintf } from "@wordpress/i18n";

/**
 * The task progressbar Title component to display title.
 *
 * @param {string} label The label for the progress bar.
 * @param {JSX.Element} children Optional children to display next to the title, e.g. a badge.
 *
 * @returns {JSX.Element} The TasksProgressBarTitle component.
 */
export const TasksProgressBarTitle = ( { label, children } ) => (
	<div className="yst-flex yst-gap-1 yst-mb-2 yst-items-center">
		<Label className="yst-font-medium yst-text-slate-900 yst-text-sm">
			{ label }
		</Label>
		{ children }
	</div>
);

/**
 * The LoadingProgressBar component to display a loading state for the progress bar.
 *
 * @returns {JSX.Element} The LoadingProgressBar component.
 */
const LoadingProgressBar = ( { className, label } ) => (
	<div className={ className }>
		<TasksProgressBarTitle label={ label }>
			<SkeletonLoader className="yst-w-9 yst-h-5" />
		</TasksProgressBarTitle>
		<SkeletonLoader className="yst-w-full yst-h-1.5" />
	</div>
);

/**
 * Component displaying an error state for the progress bar.
 *
 * @returns {JSX.Element} The ErrorProgressBar component.
 */
const ErrorProgressBar = ( { className, label } ) => (
	<div className={ className }>
		<TasksProgressBarTitle label={ label }>
			<span className="yst-w-9 yst-h-5 yst-bg-slate-200 yst-rounded" />
		</TasksProgressBarTitle>
		<div className="yst-w-full yst-h-1.5 yst-bg-slate-200 yst-rounded" />
	</div>
);

/**
 * Component displaying a progress bar for tasks.
 *
 * @param {number} completedTasks Number of completed tasks, should be less than or equal to totalTasks.
 * @param {number} totalTasks Total number of tasks.
 * @param {boolean} isLoading Whether the tasks are loading.
 * @param {string} [className] Additional class names for the wrapper.
 * @param {string} label The label for the progress bar.
 * @returns {JSX.Element} The TasksProgressBar component.
 */
export const TasksProgressBar = ( { completedTasks, totalTasks, isLoading, className, label } ) => {
	if ( isLoading ) {
		return <LoadingProgressBar className={ className } label={ label } />;
	}

	if ( ! totalTasks || completedTasks > totalTasks ) {
		return <ErrorProgressBar className={ className } label={ label } />;
	}

	const screenReaderText = sprintf(
		/* translators: %1$d expands to the number of completed tasks, %2$d expands to the total number of tasks. */
		__( "%1$d out of %2$d tasks completed", "wordpress-seo" ),
		completedTasks,
		totalTasks
	);

	return (
		<div className={ className }>
			<TasksProgressBarTitle label={ label }>
				<span className="yst-text-xs yst-font-medium">
					<span className="yst-text-slate-600">{ completedTasks }</span><span className="yst-text-slate-500">/{ totalTasks }</span>
				</span>
			</TasksProgressBarTitle>
			<ProgressBar
				progress={ completedTasks }
				min={ 0 }
				max={ totalTasks }
				className="yst-h-1.5"
				progressClassName="yst-bg-green-500"
			/>
			<span className="yst-sr-only">{ screenReaderText }</span>
		</div>
	);
};
