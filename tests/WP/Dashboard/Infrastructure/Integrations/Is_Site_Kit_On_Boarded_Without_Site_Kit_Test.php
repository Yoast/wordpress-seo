<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\WP\Dashboard\Infrastructure\Integrations;

use Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Site_Kit_Analytics_4_Adapter;
use Yoast\WP\SEO\Dashboard\Infrastructure\Integrations\Site_Kit;
use Yoast\WP\SEO\Tests\Unit\Dashboard\Infrastructure\Configuration\Permanently_Dismissed_Site_Kit_Configuration_Repository_Fake;
use Yoast\WP\SEO\Tests\Unit\Dashboard\Infrastructure\Configuration\Site_Kit_Consent_Repository_Fake;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Test class for the is_onboarded method.
 *
 * @group  site_kit
 *
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Integrations\Site_Kit::__construct
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Integrations\Site_Kit::is_onboarded
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Integrations\Site_Kit::is_site_kit_installed
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Is_Site_Kit_On_Boarded_Without_Site_Kit_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Site_Kit
	 */
	protected $instance;

	/**
	 * Set up the class which will be tested.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$site_kit_consent_repository  = new Site_Kit_Consent_Repository_Fake();
		$configuration_repository     = new Permanently_Dismissed_Site_Kit_Configuration_Repository_Fake();
		$site_kit_analytics_4_adapter = new Site_Kit_Analytics_4_Adapter();
		$this->instance               = new Site_Kit( $site_kit_consent_repository, $configuration_repository, $site_kit_analytics_4_adapter );
	}

	/**
	 * Tests that the onboarded function returns early if there is no site kit installation.
	 *
	 * @return void
	 */
	public function test_is_site_kit_onboarded() {
		$this->assertSame( false, $this->instance->is_onboarded() );
	}
}
