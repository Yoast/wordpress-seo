<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\AI\Content_Planner\Application;

use Yoast\WP\SEO\AI\Content_Planner\Domain\Category;

/**
 * Interface for resolving categories from the blog.
 */
interface Category_Repository_Interface {

	/**
	 * Finds a category by name, returning the empty-category sentinel when no term matches.
	 *
	 * The empty-category sentinel is a Category with name "" and id -1. It signals "no category"
	 * to the frontend so it can hide the category UI and skip applying any category to the post.
	 *
	 * @param string $name The category name.
	 *
	 * @return Category The resolved category, or the empty-category sentinel when no term matches.
	 */
	public function find_by_name( string $name ): Category;
}
