<?php

namespace Yoast\WP\SEO\Tests\Unit\Dashboard\Infrastructure\Repositories;

use Yoast\WP\SEO\Dashboard\Infrastructure\Repositories\Permanently_Dismissed_Site_Kit_Widget_Repository_Interface;

class Permanently_Dismissed_Site_Kit_Widget_Repository_Fake implements Permanently_Dismissed_Site_Kit_Widget_Repository_Interface {
	public function is_site_kit_widget_dismissed(): bool {
		// Return a fake value for testing purposes.
		return true;
	}

	public function set_site_kit_widget_dismissal(bool $is_dismissed): bool {
		return $is_dismissed;
	}
}
