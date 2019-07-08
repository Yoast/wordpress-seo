<?php

namespace Yoast\WP\Free\Tests\Doubles;

use Yoast\WP\Free\Formatters\Indexable_Post_Formatter;

/**
 * Test Helper Class.
 */
class Indexable_Post_Formatter_Double extends Indexable_Post_Formatter {

	/**
	 * @inheritdoc
	 */
	public function get_keyword_score( $keyword, $score ) {
		return parent::get_keyword_score( $keyword, $score );
	}

	/**
	 * @inheritdoc
	 */
	public function get_meta_value( $post_id, $meta_key ) {
		return parent::get_meta_value( $post_id, $meta_key );
	}

	/**
	 * @inheritdoc
	 */
	public function get_robots_noindex( $value ) {
		return parent::get_robots_noindex( $value );
	}

	/**
	 * @inheritdoc
	 */
	public function get_robots_options() {
		return parent::get_robots_options();
	}

	/**
	 * @inheritdoc
	 */
	public function get_indexable_lookup() {
		return parent::get_indexable_lookup();
	}

	/**
	 * @inheritdoc
	 */
	public function set_link_count( $post_id, $indexable ) {
		return parent::set_link_count( $post_id, $indexable );
	}

	/**
	 * @inheritdoc
	 */
	public function get_seo_meta( $post_id ) {
		return parent::get_seo_meta( $post_id );
	}
}
