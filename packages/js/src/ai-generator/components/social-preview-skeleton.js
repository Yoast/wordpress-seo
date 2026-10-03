import { SkeletonLoader } from "@yoast/ui-library";

/**
 * @returns {JSX.Element} The element.
 */
export const SocialPreviewSkeleton = () => (
	<div className="yst-flex yst-flex-col yst-w-[527px] yst-border yst-mx-auto">
		<SkeletonLoader className="yst-h-[273px] yst-w-full yst-rounded-none yst-border yst-border-dashed" />
		<div className="yst-w-full yst-p-4 yst-space-y-1">
			<SkeletonLoader className="yst-h-3 yst-w-1/3" />
			<SkeletonLoader className="yst-h-5 yst-w-10/12" />
			<SkeletonLoader className="yst-h-3 yst-w-full" />
		</div>
	</div>
);
