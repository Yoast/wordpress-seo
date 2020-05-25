<?php

namespace Yoast\WP\SEO\Tests\Doubles\Generators\Schema;

use Yoast\WP\SEO\Generators\Schema\Article;

/**
 * Class Article_Double.
 */
class Article_Double extends Article {

	/**
	 * @inheritDoc
	 */
	public function add_terms( $data, $key, $taxonomy ) {
		return parent::add_terms( $data, $key, $taxonomy );
	}
}
