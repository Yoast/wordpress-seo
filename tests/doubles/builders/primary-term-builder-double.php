<?php

namespace Yoast\WP\SEO\Tests\Doubles;

use Yoast\WP\SEO\Builders\Primary_Term_Builder;

/**
 * Class Primary_Term_Builder_Double
 */
class Primary_Term_Builder_Double extends Primary_Term_Builder {

	/**
	 * @inheritDoc
	 */
	public function save_primary_term( $post_id, $taxonomy ) {
		parent::save_primary_term( $post_id, $taxonomy );
	}
}
