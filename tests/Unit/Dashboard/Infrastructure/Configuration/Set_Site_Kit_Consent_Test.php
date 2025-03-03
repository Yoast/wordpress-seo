<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\Infrastructure\Configuration;

/**
 * Test class for the set_site_kit_consent method.
 *
 * @group Site_Kit_Consent_Repository
 *
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Configuration\Site_Kit_Consent_Repository::set_site_kit_consent
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Set_Site_Kit_Consent_Test extends Abstract_Site_Kit_Consent_Repository_Test {

	/**
	 * Tests if Site Kit consent can be set..
	 *
	 * @return void
	 */
	public function test_is_consent_granted() {
		$consent = true;
		$this->options_helper->shouldReceive( 'set' )
			->with( 'site_kit_connected', $consent )
			->andReturn( true );

		$this->assertTrue( $this->instance->set_site_kit_consent( $consent ) );
	}
}
