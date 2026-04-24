import { Badge, SkeletonLoader, Toggle } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";

/**
 * @typedef {import( "../constants" ).Category} Category
 */

/**
 * Category toggle section with optional loading skeleton.
 *
 * @param {Category|null} category  The category object with name and id, or null.
 * @param {boolean}     isEnabled Whether the category toggle is on.
 * @param {Function}    onToggle  Callback when the toggle changes.
 * @param {boolean}     isLoading Whether content is still loading.
 *
 * @returns {JSX.Element} The CategorySection component.
 */
export const CategorySection = ( { category, isEnabled, onToggle, isLoading } ) => (
	<div className="yst-flex yst-flex-col yst-gap-3 yst-max-w-sm yst-mb-6">
		<div className="yst-flex yst-flex-col yst-gap-1.5">
			<div className="yst-flex yst-items-center yst-justify-between">
				<span className="yst-font-medium yst-text-sm yst-text-slate-800">
					{ __( "Suggest category", "wordpress-seo" ) }
				</span>
				<Toggle
					id="suggest-category-toggle"
					checked={ isEnabled }
					onChange={ onToggle }
					disabled={ isLoading }
					screenReaderLabel={ __( "Suggest category", "wordpress-seo" ) }
				/>
			</div>
			<p className="yst-text-sm yst-text-slate-600">
				{ __( "Adds post to an existing category, when applicable.", "wordpress-seo" ) }
			</p>
		</div>
		{ isEnabled && ! isLoading && category && <Badge variant="plain" className="yst-w-fit">{ category?.name }</Badge> }
		{ isLoading && <div className="yst-inline-flex yst-items-center yst-w-20 yst-h-5 yst-px-2 yst-py-1 yst-rounded-full yst-border yst-border-slate-300">
			<SkeletonLoader className="yst-w-16 yst-h-3 yst-rounded" />
		</div> }
	</div>
);
