<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Models;

use Yoast\WP\SEO\Models\Primary_Term;

/**
 * Class Primary_Term_Mock
 *
 * Primary_Term mock class.
 */
class Primary_Term_Mock extends Primary_Term {

	public $id;

	public $post_id;

	public $term_id;

	public $taxonomy;

	public $blog_id;

	public $created_at;

	public $updated_at;
}
