<?php

namespace Yoast\WP\SEO\Tests\Doubles\Generators\Schema;

use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Generators\Schema\Article;

/**
 * Class Article_Double.
 *
 * @package Yoast\Tests\Doubles
 */
class Article_Double extends Article {

	/**
	 * @inheritDoc
	 */
	public function add_terms( $data, $key, $taxonomy ) {
		return parent::add_terms( $data, $key, $taxonomy );
	}
}
