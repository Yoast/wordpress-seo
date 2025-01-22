<?php

namespace Yoast\WP\SEO\Tests\Unit\Dashboard\Infrastructure\Repositories;

/**
 * Test class for the is_site_kit_widget_dismissed method.
 *
 * @group Permanently_Dismissed_Site_Kit_Widget_Repository
 *
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Repositories\Permanently_Dismissed_Site_Kit_Widget_Repository::is_site_kit_widget_dismissed
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Is_Site_Kit_Widget_Dismissed_Test extends Abstract_Permanently_Dismissed_Site_Kit_Widget_Repository_Test {

	/**
	 * Tests if the Site Kit widget dismissal status can be set.
	 *
	 * @return void
	 */
	public function test_set_site_kit_widget_dismissal() {
		$is_dismissed = true;
		$this->options_helper->shouldReceive( 'set' )
			->with( 'site_kit_widget_permanently_dismissed', $is_dismissed )
			->andReturn( true );

		$this->assertTrue( $this->instance->set_site_kit_widget_dismissal( $is_dismissed ) );
	}
}
