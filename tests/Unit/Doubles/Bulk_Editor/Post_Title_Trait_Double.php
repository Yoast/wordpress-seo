<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Bulk_Editor;

use Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Post_Title_Trait;

/**
 * Exposes the post title trait as public.
 */
final class Post_Title_Trait_Double {

	use Post_Title_Trait {
		get_normalized_title as public;
	}
}
