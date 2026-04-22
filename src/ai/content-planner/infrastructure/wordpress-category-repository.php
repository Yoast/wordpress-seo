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
	 * Finds a category by name, falling back to the blog's default category when no term matches.
	 *
	 * @param string $name The category name.
	 *
	 * @return Category The resolved category, or the blog's default category when no term matches.
	 */
	public function find_by_name( string $name ): Category {
		$term = \get_term_by( 'name', $name, 'category' );

		if ( $term instanceof WP_Term ) {
			return new Category( $term->name, $term->term_id );
		}

		return $this->get_default_category();
	}

	/**
	 * Retrieves the blog's default category as a Category.
	 *
	 * @return Category The default category.
	 */
	private function get_default_category(): Category {
		$default_id   = (int) \get_option( 'default_category' );
		$default_term = \get_term( $default_id, 'category' );

		return new Category( $default_term->name, $default_term->term_id );
	}
}
