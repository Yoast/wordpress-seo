<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Builders;

use Yoast\WP\SEO\Builders\Primary_Term_Builder;

/**
 * Class Primary_Term_Builder_Double
 */
class Primary_Term_Builder_Double extends Primary_Term_Builder {

	/**
	 * Save the primary term for a specific taxonomy.
	 *
	 * @param int    $post_id  Post ID to save primary term for.
	 * @param string $taxonomy Taxonomy to save primary term for.
	 *
	 * @return void
	 */
	public function save_primary_term( $post_id, $taxonomy ) {
		parent::save_primary_term( $post_id, $taxonomy );
	}
}
