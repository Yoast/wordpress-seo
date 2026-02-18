import { ProgressBar, SkeletonLoader, Label } from "@yoast/ui-library";
import { __, sprintf } from "@wordpress/i18n";
import classNames from "classnames";

const sizeClassNames = {
	small: {
		label: "yst-text-sm",
		count: "yst-text-xs",
	},
	medium: {
		label: "yst-text-lg",
		count: "yst-text-tiny",
	},
};


/**
 * The task progressbar Label component to display label.
 *
 * @param {string} label The label for the progress bar.
 * @param {JSX.Element} children Optional children to display next to the label, e.g. a badge.
 * @param {string} [size] The size of the progress bar label, e.g. 'small', 'medium', 'large'.
 *
 * @returns {JSX.Element} The TasksProgressBarLabel component.
 */
export const TasksProgressBarLabel = ( { label, children, size = "medium" } ) => (
	<div className="yst-flex yst-gap-1 yst-mb-2 yst-items-center">
		<Label className={ classNames( "yst-font-medium yst-text-slate-900", sizeClassNames[ size ]?.label ) }>
			{ label }
		</Label>
		{ children }
	</div>
);

/**
 * The LoadingProgressBar component to display a loading state for the progress bar.
 * @param {string} [className] Additional class names for the wrapper.
 * @param {string} label The label for the progress bar.
 * @param {string} [size] The size of the progress bar, e.g. 'small', 'medium'.
 *
 * @returns {JSX.Element} The LoadingProgressBar component.
 */
const LoadingProgressBar = ( { className, label, size } ) => (
	<div className={ className }>
		<TasksProgressBarLabel label={ label } size={ size }>
			<SkeletonLoader className="yst-w-9 yst-h-5" />
		</TasksProgressBarLabel>
		<SkeletonLoader className="yst-w-full yst-h-1.5" />
	</div>
);

/**
 * Component displaying an error state for the progress bar.
 *
 * @param {string} [className] Additional class names for the wrapper.
 * @param {string} label The label for the progress bar.
 * @param {string} [size] The size of the progress bar, e.g. 'small', 'medium'.
 *
 * @returns {JSX.Element} The ErrorProgressBar component.
 */
const ErrorProgressBar = ( { className, label, size } ) => (
	<div className={ className }>
		<TasksProgressBarLabel label={ label } size={ size }>
			<span className="yst-w-9 yst-h-5 yst-bg-slate-200 yst-rounded" />
		</TasksProgressBarLabel>
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
 * @param {string} [size] The size of the progress bar, e.g. 'small', 'medium', 'large'.
 * @returns {JSX.Element} The TasksProgressBar component.
 */
export const TasksProgressBar = ( { completedTasks, totalTasks, isLoading, className, label, size = "medium" } ) => {
	if ( isLoading ) {
		return <LoadingProgressBar className={ className } label={ label } size={ size } />;
	}

	if ( ! totalTasks || completedTasks > totalTasks ) {
		return <ErrorProgressBar className={ className } label={ label } size={ size } />;
	}

	const screenReaderText = sprintf(
		/* translators: %1$d expands to the number of completed tasks, %2$d expands to the total number of tasks. */
		__( "%1$d out of %2$d tasks completed", "wordpress-seo" ),
		completedTasks,
		totalTasks
	);

	return (
		<div className={ className }>
			<TasksProgressBarLabel label={ label } size={ size }>
				<span className={ classNames( "yst-font-medium yst-flex yst-gap-0.5", sizeClassNames[ size ]?.count ) }>
					<span className="yst-text-slate-600">{ completedTasks }</span>/<span className="yst-text-slate-500">{ totalTasks }</span>
				</span>
			</TasksProgressBarLabel>
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
