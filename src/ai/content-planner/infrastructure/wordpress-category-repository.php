<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\AI\Content_Planner\Infrastructure;

use WP_Term;
use Yoast\WP\SEO\AI\Content_Planner\Application\Category_Repository_Interface;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Category;

/**
 * Retrieves the WordPress categories taxonomy.
 */
class WordPress_Category_Repository implements Category_Repository_Interface {

	/**
	 * Finds a category by name, returning null if the category does not exist in the blog.
	 *
	 * @param string $name The category name.
	 *
	 * @return Category|null The category or null if not found.
	 */
	public function find_by_name( string $name ): ?Category {
		$term = \get_term_by( 'name', $name, 'category' );

		if ( ! $term instanceof WP_Term ) {
			return null;
		}

		return new Category( $term->name, $term->term_id );
	}
}
