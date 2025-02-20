<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\Infrastructure\Configuration;

/**
 * Test class for the is_site_kit_configuration_dismissed method.
 *
 * @group Permanently_Dismissed_Site_Kit_Configuration_Repository
 *
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Configuration\Permanently_Dismissed_Site_Kit_Configuration_Repository::is_site_kit_configuration_dismissed
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Is_Site_Kit_Configuration_Dismissed_Test extends Abstract_Permanently_Dismissed_Site_Kit_Configuration_Repository_Test {

	/**
	 * Tests if the Site Kit configuration dismissal status can be retrieved.
	 *
	 * @return void
	 */
	public function test_is_site_kit_configuration_dismissed() {
		$this->options_helper->shouldReceive( 'get' )
			->with( 'site_kit_configuration_permanently_dismissed', false )
			->andReturn( true );

		$this->assertTrue( $this->instance->is_site_kit_configuration_dismissed() );
	}
}
