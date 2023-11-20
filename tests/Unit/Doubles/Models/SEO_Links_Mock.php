<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Models;

use Yoast\WP\SEO\Models\SEO_Links;

/**
 * Class SEO_Links_Mock
 *
 * SEO_Links mock class.
 */
class SEO_Links_Mock extends SEO_Links {

	public $id;

	public $url;

	public $post_id;

	public $target_post_id;

	public $type;

	public $indexable_id;

	public $target_indexable_id;

	public $height;

	public $width;

	public $size;

	public $language;

	public $region;
}
