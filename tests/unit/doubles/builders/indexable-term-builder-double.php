<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles;

use Yoast\WP\SEO\Builders\Indexable_Term_Builder;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Models\Indexable;

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

	/**
	 * @inheritDoc
	 */
	public function find_alternative_image( Indexable $indexable ) {
		return parent::find_alternative_image( $indexable );
	}
}
