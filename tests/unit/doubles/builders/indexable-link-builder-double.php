<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Builders;

use Yoast\WP\SEO\Builders\Indexable_Link_Builder;

/**
 * Class Indexable_Link_Builder_Double.
 */
class Indexable_Link_Builder_Double extends Indexable_Link_Builder {

    /**
	 * Updates incoming link counts for related indexables.
	 *
	 * @param int[] $related_indexable_ids The IDs of all related indexables.
	 *
	 * @return void
	 */
    public function exposed_update_incoming_links_for_related_indexables( $related_indexable_ids ) {
        $this->update_incoming_links_for_related_indexables( $related_indexable_ids );
    }

}