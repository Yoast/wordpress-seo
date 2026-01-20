import { SkeletonLoader } from "@yoast/ui-library";

/**
 * @returns {JSX.Element} The element.
 */
export const GooglePreviewSkeleton = () => (
	<div className="yst-max-w-[400px] yst-py-4 yst-px-3 yst-border yst-rounded-lg yst-w-full yst-mx-auto">
		<div className="yst-flex yst-gap-x-3">
			<SkeletonLoader className="yst-flex-shrink-0 yst-h-7 yst-w-7 yst-rounded-full" />
			<div className="yst-flex yst-flex-col yst-w-full yst-gap-y-1">
				<SkeletonLoader className="yst-h-3 yst-w-1/3" />
				<SkeletonLoader className="yst-h-2.5 yst-w-10/12" />
			</div>
		</div>
		<SkeletonLoader className="yst-h-4 yst-w-full yst-mt-6 yst-mb-4" />
		<SkeletonLoader className="yst-h-3 yst-w-full" />
		<SkeletonLoader className="yst-h-3 yst-w-10/12 yst-mt-2.5" />
	</div>
);
