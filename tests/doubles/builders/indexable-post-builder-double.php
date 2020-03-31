<?php

namespace Yoast\WP\SEO\Tests\Doubles;

use Yoast\WP\SEO\Builders\Indexable_Post_Builder;

/**
 * Class Indexable_Post_Builder_Double.
 *
 * @package Yoast\Tests\Doubles
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
}
