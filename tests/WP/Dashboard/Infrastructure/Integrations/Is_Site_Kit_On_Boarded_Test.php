<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\WP\Dashboard\Infrastructure\Integrations;

use Generator;
use Yoast\WP\SEO\Dashboard\Infrastructure\Configuration\Site_Kit_Consent_Repository_Interface;
use Yoast\WP\SEO\Dashboard\Infrastructure\Connection\Site_Kit_Is_Connected_Call;
use Yoast\WP\SEO\Dashboard\Infrastructure\Integrations\Site_Kit;
use Yoast\WP\SEO\Tests\Unit\Dashboard\Infrastructure\Configuration\Permanently_Dismissed_Site_Kit_Configuration_Repository_Fake;
use Yoast\WP\SEO\Tests\Unit\Dashboard\Infrastructure\Configuration\Site_Kit_Consent_Repository_Fake;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Test class for the is_onboarded method.
 *
 * @group  site-kit
 *
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Integrations\Site_Kit::__construct
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Integrations\Site_Kit::is_onboarded
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Integrations\Site_Kit::is_site_kit_installed
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Integrations\Site_Kit::is_setup_completed
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Integrations\Site_Kit::is_connected
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Is_Site_Kit_On_Boarded_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Site_Kit
	 */
	protected $instance;

	/**
	 * The site kit consent repository fake.
	 *
	 * @var Site_Kit_Consent_Repository_Interface
	 */
	private $site_kit_consent_repository;

	/**
	 * Plugin basename of the plugin dependency this group of tests has.
	 *
	 * @var string
	 */
	public $prereq_plugin_basename = 'google-site-kit/google-site-kit.php';

	/**
	 * Set up the class which will be tested.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->site_kit_consent_repository = new Site_Kit_Consent_Repository_Fake();
		$configuration_repository          = new Permanently_Dismissed_Site_Kit_Configuration_Repository_Fake();
		$site_kit_is_connected_call        = new Site_Kit_Is_Connected_Call();
		$this->instance                    = new Site_Kit( $this->site_kit_consent_repository, $configuration_repository, $site_kit_is_connected_call );
	}

	/**
	 * Tests if Site kit consent is granted.
	 *
	 * @requires PHP >= 7.4
	 *
	 * @dataProvider generate_site_kit_onboarded_provider
	 *
	 * @param string $oauth_keys         Json representation of some fake API keys.
	 * @param bool   $is_consent_granted If consent is granted to our integration.
	 * @param bool   $expected           The expected value.
	 *
	 * @return void
	 */
	public function test_is_site_kit_onboarded(
		string $oauth_keys,
		bool $is_consent_granted,
		bool $expected
	) {
		$this->markTestSkipped( 'This test needs working Site Kit rest routes' );
		\add_filter(
			'googlesitekit_oauth_secret',
			static function () use ( $oauth_keys ) {
				return $oauth_keys;
			}
		);

		$this->site_kit_consent_repository->set_site_kit_consent( $is_consent_granted );
		$this->assertSame( $expected, $this->instance->is_onboarded() );
	}

	/**
	 * Provides data testing if the Site Kit is fully configured.
	 *
	 * @return Generator Test data to use.
	 */
	public static function generate_site_kit_onboarded_provider() {
		yield 'Everything setup' => [
			'oauth_keys'            => \json_encode(
				[
					'web' => [
						'client_id'     => 'client_id',
						'client_secret' => 'client_secret',
					],
				]
			),
			'is_consent_granted'    => true,
			'expected'              => true,
		];
		yield 'No consent given' => [
			'oauth_keys'            => \json_encode(
				[
					'web' => [
						'client_id'     => 'client_id',
						'client_secret' => 'client_secret',
					],
				]
			),
			'is_consent_granted'    => false,
			'expected'              => false,
		];
		yield 'Fresh install' => [
			'oauth_keys'            => \json_encode( [] ),
			'is_consent_granted'    => false,
			'expected'              => false,
		];
		yield 'Site kit setup completed with unexpected value' => [
			'oauth_keys'            => \json_encode(
				[
					'web' => [
						'client_id'     => 'client_id',
					],
				]
			),
			'is_consent_granted'    => true,
			'expected'              => false,
		];
	}
}
