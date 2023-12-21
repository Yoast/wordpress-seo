<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Builders;

use Yoast\WP\SEO\Builders\Indexable_Term_Builder;
use Yoast\WP\SEO\Models\Indexable;

/**
 * Class Indexable_Term_Builder_Double.
 */
final class Indexable_Term_Builder_Double extends Indexable_Term_Builder {

	/**
	 * Converts the meta noindex value to the indexable value.
	 *
	 * @param string $meta_value Term meta to base the value on.
	 *
	 * @return bool|null
	 */
	public function get_noindex_value( $meta_value ) {
		return parent::get_noindex_value( $meta_value );
	}

	/**
	 * Finds an alternative image for the social image.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return array|bool False when not found, array with data when found.
	 */
	public function find_alternative_image( Indexable $indexable ) {
		return parent::find_alternative_image( $indexable );
	}

	/**
	 * Determines the focus keyword score.
	 *
	 * @param string $keyword The focus keyword that is set.
	 * @param int    $score   The score saved on the meta data.
	 *
	 * @return int|null Score to use.
	 */
	public function get_keyword_score( $keyword, $score ) {
		return parent::get_keyword_score( $keyword, $score );
	}

	/**
	 * Retrieves a meta value from the given meta data.
	 *
	 * @param string $meta_key  The key to extract.
	 * @param array  $term_meta The meta data.
	 *
	 * @return string|null The meta value.
	 */
	public function get_meta_value( $meta_key, $term_meta ) {
		return parent::get_meta_value( $meta_key, $term_meta );
	}
}
