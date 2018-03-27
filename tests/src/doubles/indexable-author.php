<?php

namespace Yoast\Tests\Doubles;

class Indexable_Author extends \Yoast\YoastSEO\Watchers\Indexable_Author {
	/**
	 * @inheritdoc
	 */
	public function get_meta_data( $user_id ) {
		return parent::get_meta_data( $user_id );
	}

	/**
	 * @inheritdoc
	 */
	public function get_sitemap_include_value( $meta_value ) {
		return parent::get_sitemap_include_value( $meta_value );
	}

	/**
	 * @inheritdoc
	 */
	public function get_indexable( $author_id, $auto_create = true ) {
		return parent::get_indexable( $author_id, $auto_create );
	}

	/**
	 * @inheritdoc
	 */
	public function get_noindex_value( $value ) {
		return parent::get_noindex_value( $value );
	}
}
