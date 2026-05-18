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
	 * Finds a category by name, returning the empty-category sentinel when no term matches.
	 *
	 * The empty-category sentinel is a Category with name "" and id -1. It signals "no category"
	 * to the frontend so it can hide the category UI and skip applying any category to the post.
	 *
	 * @param string $name The category name.
	 *
	 * @return Category The resolved category, or the empty-category sentinel when no term matches.
	 */
	public function find_by_name( string $name ): Category {
		$term = \get_term_by( 'name', $name, 'category' );

		if ( $term instanceof WP_Term ) {
			return new Category( $term->name, $term->term_id );
		}

		return new Category( '', -1 );
	}
}
