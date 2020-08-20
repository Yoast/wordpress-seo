<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles;

use Yoast\WP\SEO\Builders\Indexable_Term_Builder;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;

/**
 * Class Indexable_Term_Builder_Double
 */
class Indexable_Term_Builder_Double extends Indexable_Term_Builder {

	/**
	 * @inheritDoc
	 */
	public function get_noindex_value( $meta_value ) {
		return parent::get_noindex_value( $meta_value );
	}
}
