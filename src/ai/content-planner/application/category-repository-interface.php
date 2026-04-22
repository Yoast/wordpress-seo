<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\AI\Content_Planner\Application;

use Yoast\WP\SEO\AI\Content_Planner\Domain\Category;

/**
 * Interface for resolving categories from the blog.
 */
interface Category_Repository_Interface {

	/**
	 * Finds a category by name, falling back to the blog's default category when no term matches.
	 *
	 * @param string $name The category name.
	 *
	 * @return Category The resolved category, or the blog's default category when no term matches.
	 */
	public function find_by_name( string $name ): Category;
}
