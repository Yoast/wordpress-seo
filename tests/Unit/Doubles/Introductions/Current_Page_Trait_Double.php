<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Introductions;

use Yoast\WP\SEO\Introductions\Application\Current_Page_Trait;

/**
 * Exposes the current page trait as public.
 */
final class Current_Page_Trait_Double {

	use Current_Page_Trait {
		is_on_yoast_page as public;
		is_on_installation_page as public;
		get_page as public;
	}
}
