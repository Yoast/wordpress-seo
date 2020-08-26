<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Builders;

use Yoast\WP\SEO\Builders\Indexable_Post_Builder;
use Yoast\WP\SEO\Models\Indexable;

/**
 * Class Indexable_Post_Builder_Double.
 */
class Indexable_Post_Builder_Double extends Indexable_Post_Builder {

	/**
	 * @inheritDoc
	 */
	public function is_public( $indexable ) {
		return parent::is_public( $indexable );
	}

	/**
	 * @inheritDoc
	 */
	public function is_public_attachment( $indexable ) {
		return parent::is_public_attachment( $indexable );
	}

	/**
	 * @inheritDoc
	 */
	public function has_public_posts( $indexable ) {
		return parent::has_public_posts( $indexable );
	}

	/**
	 * @inheritDoc
	 */
	public function get_number_of_pages_for_post( $post ) {
		return parent::get_number_of_pages_for_post( $post );
	}

	/**
	 * @inheritDoc
	 */
	public function get_robots_noindex( $value ) {
		return parent::get_robots_noindex( $value );
	}

	/**
	 * @inheritDoc
	 */
	public function get_permalink( $post_type, $post_id ) {
		return parent::get_permalink( $post_type, $post_id );
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
	public function find_alternative_image( Indexable $indexable ) {
		return parent::find_alternative_image( $indexable );
	}
}
