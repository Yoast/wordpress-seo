<?php

namespace Yoast\Tests\Doubles;

class Indexable_Post extends \Yoast\YoastSEO\Watchers\Indexable_Post {
	/**
	 * @inheritdoc
	 */
	public function get_meta_value( $meta_key, $post_id ) {
		return parent::get_meta_value( $meta_key, $post_id );
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
	public function get_meta_lookup() {
		return parent::get_meta_lookup();
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
	public function get_indexable( $post_id, $auto_create = true ) {
		return parent::get_indexable( $post_id, $auto_create );
	}
}
