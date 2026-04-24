import { Badge, SkeletonLoader, Toggle } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";
import { noop } from "lodash";

/**
 * @typedef {import( "../constants" ).Category} Category
 */

/**
 *
 * @param {Object} props
 * @param {string|null} props.categoryName The name of the category, or null.
 * @param {boolean} [props.isEnabled=false] Whether the category toggle is on.
 * @param {boolean} [props.isLoading=false] Whether content is still loading.
 *
 * @returns {JSX.Element|null} The CategoryBadge component.
 */
const CategoryBadge = ( { categoryName, isEnabled = false, isLoading = false } ) => {
	if ( isLoading ) {
		return <div className="yst-inline-flex yst-items-center yst-w-20 yst-h-5 yst-px-2 yst-py-1 yst-rounded-full yst-border yst-border-slate-300">
			<SkeletonLoader className="yst-w-16 yst-h-3 yst-rounded" />
		</div>;
	}
	if ( isEnabled && categoryName ) {
		return <Badge variant="plain" className="yst-w-fit">{ categoryName }</Badge>;
	}
	return null;
};

/**
 * Category toggle section with optional loading skeleton.
 *
 * @param {Category|null} category  The category object with name and id, or null.
 * @param {boolean}     [isEnabled=false] Whether the category toggle is on.
 * @param {Function}    [onToggle=noop] Callback when the toggle changes.
 * @param {boolean}     [isLoading=false] Whether content is still loading.
 *
 * @returns {JSX.Element} The CategorySection component.
 */
export const CategorySection = ( { category, isEnabled = false, onToggle = noop, isLoading = false } ) => (
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
		<CategoryBadge categoryName={ category?.name } isEnabled={ isEnabled } isLoading={ isLoading } />
	</div>
);
