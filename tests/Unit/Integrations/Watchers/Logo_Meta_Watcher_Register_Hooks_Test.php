<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Watchers;

/**
 * Tests the register_hooks method of the Logo_Meta_Watcher.
 *
 * @group integrations
 * @group watchers
 *
 * @covers \Yoast\WP\SEO\Integrations\Watchers\Logo_Meta_Watcher::__construct
 * @covers \Yoast\WP\SEO\Integrations\Watchers\Logo_Meta_Watcher::register_hooks
 */
final class Logo_Meta_Watcher_Register_Hooks_Test extends Abstract_Logo_Meta_Watcher_Test {

	/**
	 * Tests that the filter runs before the default priority.
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertSame(
			9,
			\has_filter( 'pre_update_option_wpseo_titles', [ $this->instance, 'add_logo_meta' ] ),
		);
	}
}
