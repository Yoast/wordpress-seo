<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Introductions;

use Yoast\WP\SEO\Introductions\Application\Version_Trait;

/**
 * Exposes the version trait as public.
 */
final class Version_Trait_Double {

	use Version_Trait {
		is_version_between as public;
	}
}
