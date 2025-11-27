import { ProgressBar, SkeletonLoader, Title } from "@yoast/ui-library";
import { __, sprintf } from "@wordpress/i18n";

/**
 * The LoadingProgressBar component to display a loading state for the progress bar.
 *
 * @returns {JSX.Element} The LoadingProgressBar component.
 */
const LoadingProgressBar = () => (
	<>
		<SkeletonLoader className="yst-w-[184px] yst-h-1.5" />
		<SkeletonLoader className="yst-w-9 yst-h-5" />
	</>
);

/**
 * Component displaying an error state for the progress bar.
 *
 * @returns {JSX.Element} The ErrorProgressBar component.
 */
const ErrorProgressBar = () => (
	<>
		<div className="yst-w-[184px] yst-h-1.5 yst-bg-slate-200 yst-rounded" />
		<span className="yst-w-9 yst-h-5 yst-bg-slate-200 yst-rounded" />
	</>
);

/**
 * Wrapper component for the progress bar with title.
 *
 * @param {JSX.Element} children Child elements.
 * @returns {JSX.Element} The ProgressBarWrapper component.
 */
const ProgressBarWrapper = ( { children } ) => (
	<div>
		<Title as="h2" className="yst-text-lg yst-font-medium yst-text-slate-900 yst-mb-2">{ __( "Tasks", "wordpress-seo" ) }</Title>
		<div className="yst-flex yst-gap-3 yst-items-center">
			{ children }
		</div>
	</div>
);


/**
 * Component displaying a progress bar for tasks.
 *
 * @param {number} completedTasks Number of completed tasks, should be less than or equal to totalTasks.
 * @param {number} totalTasks Total number of tasks.
 * @param {boolean} isLoading Whether the tasks are loading.
 * @returns {JSX.Element} The TasksProgressBar component.
 */
export const TasksProgressBar = ( { completedTasks, totalTasks, isLoading } ) => {
	if ( isLoading ) {
		return <ProgressBarWrapper>
			<LoadingProgressBar />
		</ProgressBarWrapper>;
	}

	if ( ! totalTasks || completedTasks > totalTasks ) {
		return <ProgressBarWrapper>
			<ErrorProgressBar />
		</ProgressBarWrapper>;
	}

	const screenReaderText = sprintf(
		/* translators: %1$d expands to the number of completed tasks, %2$d expands to the total number of tasks. */
		__( "%1$d out of %2$d tasks completed", "wordpress-seo" ),
		completedTasks,
		totalTasks
	);

	return (
		<ProgressBarWrapper>
			<ProgressBar
				label={ __( "Tasks Progress", "wordpress-seo" ) }
				progress={ completedTasks }
				min={ 0 }
				max={ totalTasks }
				className="yst-w-[184px] yst-h-1.5"
				progressClassName="yst-bg-green-500"
			/>
			<span className="yst-sr-only">{ screenReaderText }</span>
			<span className="yst-text-tiny yst-font-medium yst-leading-5">
				<span className="yst-text-slate-600">{ completedTasks }</span><span className="yst-text-slate-500">/{ totalTasks }</span>
			</span>
		</ProgressBarWrapper>
	);
};
