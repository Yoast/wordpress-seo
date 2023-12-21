<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Introductions;

use Yoast\WP\SEO\Introductions\Application\User_Allowed_Trait;

/**
 * Exposes the user allowed trait as public.
 */
final class User_Allowed_Trait_Double {

	use User_Allowed_Trait {
		is_user_allowed as public;
	}
}
