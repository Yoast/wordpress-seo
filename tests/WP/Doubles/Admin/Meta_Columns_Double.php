<?php

namespace Yoast\WP\SEO\Tests\WP\Doubles\Admin;

use WPSEO_Meta_Columns;

/**
 * Test Helper Class.
 */
final class Meta_Columns_Double extends WPSEO_Meta_Columns {

	/**
	 * The current post type.
	 *
	 * @var string|null
	 */
	private $current_post_type;

	/**
	 * Determines the SEO score filter to be later used in the meta query, based on the passed SEO filter.
	 *
	 * @param string $seo_filter The SEO filter to use to determine what further filter to apply.
	 *
	 * @return array The SEO score filter.
	 */
	public function determine_seo_filters( $seo_filter ) {
		return parent::determine_seo_filters( $seo_filter );
	}

	/**
	 * Determines the Readability score filter to the meta query, based on the passed Readability filter.
	 *
	 * @param string $readability_filter The Readability filter to use to determine what further filter to apply.
	 *
	 * @return array The Readability score filter.
	 */
	public function determine_readability_filters( $readability_filter ) {
		return parent::determine_readability_filters( $readability_filter );
	}

	/**
	 * Determines whether the passed filter is considered to be valid.
	 *
	 * @param mixed $filter The filter to check against.
	 *
	 * @return bool Whether or not the filter is considered valid.
	 */
	public function is_valid_filter( $filter ) {
		return parent::is_valid_filter( $filter );
	}

	/**
	 * Uses the vars to create a complete filter query that can later be executed to filter out posts.
	 *
	 * @param array $vars    Array containing the variables that will be used in the meta query.
	 * @param array $filters Array containing the filters that we need to apply in the meta query.
	 *
	 * @return array Array containing the complete filter query.
	 */
	public function build_filter_query( $vars, $filters ) {
		return parent::build_filter_query( $vars, $filters );
	}

	/**
	 * Sets the current post type.
	 *
	 * @param string|null $post_type The post type.
	 *
	 * @return void
	 */
	public function set_current_post_type( $post_type ) {
		$this->current_post_type = $post_type;
	}

	/**
	 * Gets the current post type.
	 *
	 * @return string
	 */
	public function get_current_post_type() {
		if ( ! \is_null( $this->current_post_type ) ) {
			return $this->current_post_type;
		}
		else {
			return parent::get_current_post_type();
		}
	}

	/**
	 * Determines whether a particular post_id is of an indexable post type.
	 *
	 * @param string $post_id The post ID to check.
	 *
	 * @return bool Whether or not it is indexable.
	 */
	public function is_indexable( $post_id ) {
		return parent::is_indexable( $post_id );
	}

	/**
	 * Determines whether the given post ID uses the default indexing settings.
	 *
	 * @param int $post_id The post ID to check.
	 *
	 * @return bool Whether or not the default indexing is being used for the post.
	 */
	public function uses_default_indexing( $post_id ) {
		return parent::uses_default_indexing( $post_id );
	}
}
