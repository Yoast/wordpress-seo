<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\Infrastructure\Integrations;

use Mockery;
use Yoast\WP\SEO\Dashboard\Infrastructure\Configuration\Permanently_Dismissed_Site_Kit_Configuration_Repository_Interface as Configuration_Repository;
use Yoast\WP\SEO\Dashboard\Infrastructure\Configuration\Site_Kit_Consent_Repository;
use Yoast\WP\SEO\Dashboard\Infrastructure\Connection\Site_Kit_Is_Connected_Call;
use Yoast\WP\SEO\Dashboard\Infrastructure\Integrations\Site_Kit;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Site Kit configuration object tests.
 *
 * @group site-kit
 *
 * @coversDefaultClass \Yoast\WP\SEO\Dashboard\Infrastructure\Integrations\Site_Kit
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Site_Kit_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Site_Kit
	 */
	protected $instance;

	/**
	 * Holds the site kit consent repository.
	 *
	 * @var Mockery\MockInterface|Site_Kit_Consent_Repository
	 */
	protected $site_kit_consent_repository;

	/**
	 * Holds the configuration repository.
	 *
	 * @var Mockery\MockInterface|Configuration_Repository
	 */
	protected $configuration_repository;

	/**
	 * Holds the site kit connected calls.
	 *
	 * @var Mockery\MockInterface|Site_Kit_Is_Connected_Call
	 */
	protected $site_kit_is_connected_call;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();
		if ( ! \defined( 'WP_PLUGIN_DIR' ) ) {
			\define( 'WP_PLUGIN_DIR', '/' );
		}
		$this->site_kit_consent_repository = Mockery::mock( Site_Kit_Consent_Repository::class );
		$this->configuration_repository    = Mockery::mock( Configuration_Repository::class );
		$this->site_kit_is_connected_call  = Mockery::mock( Site_Kit_Is_Connected_Call::class );

		$this->instance = new Site_Kit( $this->site_kit_consent_repository, $this->configuration_repository, $this->site_kit_is_connected_call );
	}
}
