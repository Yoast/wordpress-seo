<?php
/**
 * @package WPSEO\Frontend
 */

/**
 * Adds customizations to the front end for the primary category
 */
class WPSEO_Frontend_Primary_Category {

	/**
	 * Registers the hooks necessary for correct primary category behaviour.
	 */
	public function register_hooks() {
		add_filter( 'post_link_category', array( $this, 'post_link_category' ) );
	}

	/**
	 * Filters post_link_category to change the category to the chosen category by the user
	 *
	 * @param stdClass $category The category that is now used for the post link.
	 *
	 * @return array|null|object|WP_Error The category we want to use for the post link.
	 */
	public function post_link_category( $category ) {
		$primary_category = $this->get_primary_category();

		if ( false !== $primary_category && $primary_category !== $category->cat_ID ) {
			$category = $this->get_category( $primary_category );
		}

		return $category;
	}

	/**
	 * /**
	 * Get the id of the primary category
	 *
	 * @return int primary category id
	 */
	protected function get_primary_category() {
		$primary_term = new WPSEO_Primary_Term( 'category', get_the_ID() );

		return $primary_term->get_primary_term();
	}

	/**
	 * Wrapper for get category to make mocking easier
	 *
	 * @param int $primary_category id of primary category.
	 *
	 * @return array|null|object|WP_Error
	 */
	protected function get_category( $primary_category ) {
		$category = get_category( $primary_category );

		return $category;
	}
}
