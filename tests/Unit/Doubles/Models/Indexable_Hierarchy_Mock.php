<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Models;

use Yoast\WP\SEO\Models\Indexable_Hierarchy;

/**
 * Class Indexable_Hierarchy_Mock
 *
 * Indexable hierarchy mock class.
 */
class Indexable_Hierarchy_Mock extends Indexable_Hierarchy {

	public $indexable_id;

	public $ancestor_id;

	public $depth;

	public $blog_id;
}
