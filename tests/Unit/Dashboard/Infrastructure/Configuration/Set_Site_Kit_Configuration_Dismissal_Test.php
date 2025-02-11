<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\Infrastructure\Configuration;

/**
 * Test class for the set_site_kit_configuration_dismissal method.
 *
 * @group Permanently_Dismissed_Site_Kit_configuration_Repository
 *
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Configuration\Permanently_Dismissed_Site_Kit_Configuration_Repository::set_site_kit_configuration_dismissal
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Set_Site_Kit_Configuration_Dismissal_Test extends Abstract_Permanently_Dismissed_Site_Kit_Configuration_Repository_Test {

	/**
	 * Tests if the Site Kit configuration dismissal status can be set.
	 *
	 * @return void
	 */
	public function test_set_site_kit_configuration_dismissal() {
		$is_dismissed = true;
		$this->options_helper->shouldReceive( 'set' )
			->with( 'site_kit_configuration_permanently_dismissed', $is_dismissed )
			->andReturn( true );

		$this->assertTrue( $this->instance->set_site_kit_configuration_dismissal( $is_dismissed ) );
	}
}
