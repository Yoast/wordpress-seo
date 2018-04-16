<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Meta_Columns_Double extends WPSEO_Meta_Columns {
	private $current_post_type;

	/**
	 * @inheritdoc
	 */
	public function determine_seo_filters( $seo_filter ) {
		return parent::determine_seo_filters( $seo_filter );
	}

	/**
	 * @inheritdoc
	 */
	public function determine_readability_filters( $readability_filter ) {
		return parent::determine_readability_filters( $readability_filter );
	}

	/**
	 * @inheritdoc
	 */
	public function is_valid_filter( $filter ) {
		return parent::is_valid_filter( $filter );
	}

	/**
	 * @inheritdoc
	 */
	public function build_filter_query( $vars, $filter ) {
		return parent::build_filter_query( $vars, $filter );
	}

	/**
	 * @inheritdoc
	 */
	public function set_current_post_type( $post_type ) {
		$this->current_post_type = $post_type;
	}

	/**
	 * @inheritdoc
	 */
	public function get_current_post_type() {
		return $this->current_post_type;
	}

	/**
	 * @inheritdoc
	 */
	public function is_indexable( $post_id ) {
		return parent::is_indexable( $post_id );
	}

	/**
	 * @inheritdoc
	 */
	public function uses_default_indexing( $post_id ) {
		return parent::uses_default_indexing( $post_id );
	}
}
