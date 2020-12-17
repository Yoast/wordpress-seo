<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Generators\Schema;

use Yoast\WP\SEO\Generators\Schema\Article;

/**
 * Class Article_Double.
 */
class Article_Double extends Article {

	/**
	 * Adds a term or multiple terms, comma separated, to a field.
	 *
	 * @param array  $data     Article data.
	 * @param string $key      The key in data to save the terms in.
	 * @param string $taxonomy The taxonomy to retrieve the terms from.
	 *
	 * @return mixed array $data Article data.
	 */
	public function add_terms( $data, $key, $taxonomy ) {
		return parent::add_terms( $data, $key, $taxonomy );
	}
}
