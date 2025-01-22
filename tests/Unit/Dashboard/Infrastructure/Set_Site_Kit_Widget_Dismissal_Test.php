<?php

namespace Yoast\WP\SEO\Tests\Unit\Dashboard\Infrastructure;

/**
 * Test class for the set_site_kit_widget_dismissal method.
 *
 * @group Permanently_Dismissed_Site_Kit_Widget_Repository
 *
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Repositories\Permanently_Dismissed_Site_Kit_Widget_Repository::set_site_kit_widget_dismissal
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Set_Site_Kit_Widget_Dismissal_Test extends Abstract_Permanently_Dismissed_Site_Kit_Widget_Repository_Test {

	/**
	 * Tests if the Site Kit widget dismissal status can be retrieved.
	 *
	 * @return void
	 */
	public function test_is_site_kit_widget_dismissed() {
		$this->options_helper->shouldReceive( 'get' )
			->with( 'site_kit_widget_permanently_dismissed', false )
			->andReturn( true );

		$this->assertTrue( $this->instance->is_site_kit_widget_dismissed() );
	}
}
