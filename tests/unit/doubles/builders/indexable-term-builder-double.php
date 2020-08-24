<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles;

use Yoast\WP\SEO\Builders\Indexable_Term_Builder;
use Yoast\WP\SEO\Models\Indexable;

/**
 * Class Indexable_Term_Builder_Double.
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

	/**
	 * @inheritDoc
	 */
	public function get_keyword_score( $keyword, $score ) {
		return parent::get_keyword_score( $keyword, $score );
	}

	/**
	 * @inheritDoc
	 */
	public function get_meta_value( $meta_key, $term_meta ) {
		return parent::get_meta_value( $meta_key, $term_meta );
	}
}
