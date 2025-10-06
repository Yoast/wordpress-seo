<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\Application\Configuration;

use Yoast\WP\SEO\Dashboard\Application\Content_Types\Content_Types_Repository;
use Yoast\WP\SEO\Dashboard\Application\Endpoints\Endpoints_Repository;
use Yoast\WP\SEO\Dashboard\Application\Tracking\Setup_Steps_Tracking;
use Yoast\WP\SEO\Dashboard\Infrastructure\Browser_Cache\Browser_Cache_Configuration;
use Yoast\WP\SEO\Dashboard\Infrastructure\Integrations\Site_Kit;
use Yoast\WP\SEO\Dashboard\Infrastructure\Nonces\Nonce_Repository;
use Yoast\WP\SEO\Editors\Application\Analysis_Features\Enabled_Analysis_Features_Repository;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;

/**
 * Test class for the constructor.
 *
 * @group Dashboard_Configuration
 *
 * @covers Yoast\WP\SEO\Dashboard\Application\Configuration\Dashboard_Configuration::__construct
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Dashboard_Configuration_Constructor_Test extends Abstract_Dashboard_Configuration_Test {

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Content_Types_Repository::class,
			$this->getPropertyValue( $this->instance, 'content_types_repository' )
		);
		$this->assertInstanceOf(
			Indexable_Helper::class,
			$this->getPropertyValue( $this->instance, 'indexable_helper' )
		);
		$this->assertInstanceOf(
			User_Helper::class,
			$this->getPropertyValue( $this->instance, 'user_helper' )
		);
		$this->assertInstanceOf(
			Enabled_Analysis_Features_Repository::class,
			$this->getPropertyValue( $this->instance, 'enabled_analysis_features_repository' )
		);

		$this->assertInstanceOf(
			Endpoints_Repository::class,
			$this->getPropertyValue( $this->instance, 'endpoints_repository' )
		);
		$this->assertInstanceOf(
			Nonce_Repository::class,
			$this->getPropertyValue( $this->instance, 'nonce_repository' )
		);
		$this->assertInstanceOf(
			Site_Kit::class,
			$this->getPropertyValue( $this->instance, 'site_kit_integration_data' )
		);
		$this->assertInstanceOf(
			Setup_Steps_Tracking::class,
			$this->getPropertyValue( $this->instance, 'setup_steps_tracking' )
		);
		$this->assertInstanceOf(
			Browser_Cache_Configuration::class,
			$this->getPropertyValue( $this->instance, 'browser_cache_configuration' )
		);
	}
}
