<?php

namespace Yoast\Tests\Doubles;

use Yoast\YoastSEO\Formatters\Indexable_Post as Indexable_Post_Formatter;

class Indexable_Post extends Indexable_Post_Formatter {
	/**
	 * @inheritdoc
	 */
	public function get_meta_value( $meta_key ) {
		return parent::get_meta_value( $meta_key );
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
}
