<?php

namespace Yoast\WP\SEO\Tests\Doubles;

use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Presentations\Generators\Schema\Article;

/**
 * Class Article_Double.
 *
 * @package Yoast\Tests\Doubles
 */
class Article_Double extends Article {

	/**
	 * @inheritDoc
	 */
	public function add_terms( $data, $key, $taxonomy, Meta_Tags_Context $context ) {
		return parent::add_terms( $data, $key, $taxonomy, $context );
	}
}
