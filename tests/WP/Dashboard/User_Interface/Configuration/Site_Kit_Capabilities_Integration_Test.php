<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\WP\Dashboard\User_Interface\Configuration;

use Generator;
use Yoast\WP\SEO\Dashboard\User_Interface\Configuration\Site_Kit_Capabilities_Integration;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Class Site_Kit_Capabilities_Integration_Test
 *
 * @group site_kit_consent_management_route
 *
 * @covers Yoast\WP\SEO\Dashboard\User_Interface\Configuration\Site_Kit_Capabilities_Integration::enable_site_kit_capabilities
 */
final class Site_Kit_Capabilities_Integration_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Site_Kit_Capabilities_Integration
	 */
	private $instance;

	/**
	 * Plugin basename of the plugin dependency this group of tests has.
	 *
	 * @var string
	 */
	public $prereq_plugin_basename = 'google-site-kit/google-site-kit.php';

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->instance = new Site_Kit_Capabilities_Integration();
	}

	/**
	 * Tests if Site kit consent is granted.
	 *
	 * @requires PHP >= 7.4
	 *
	 * @dataProvider generate_site_kit_capabilities_provider
	 *
	 * @param array<string> $current_capabilities The current capabilities of the user.
	 * @param array<string> $capability_to_check  The capability to check if it needs to be added.
	 * @param array<string> $user_roles           The current roles of the user.
	 * @param array<string> $expected             The expected list of capabilities.
	 *
	 * @return void
	 */
	public function test_enable_site_kit_capabilities( $current_capabilities, $capability_to_check, $user_roles, $expected ) {
		$user_id = self::factory()->user->create_and_get(
			[
				'role' => $user_roles,
			]
		);
		\wp_set_current_user( $user_id );
		$this->assertSame( $expected, $this->instance->enable_site_kit_capabilities( $current_capabilities, $capability_to_check ) );
	}

	/**
	 * Data provider for test_enable_site_kit_capabilities.
	 *
	 * @return Generator
	 */
	public static function generate_site_kit_capabilities_provider() {

		yield 'SEO manager without capabilities' => [
			'current_capabilities' => [],
			'capability_to_check'  => [ 'googlesitekit_view_dashboard' ],
			'user_roles'           => 'wpseo_manager',
			'expected'             => [ 'googlesitekit_view_dashboard' => true ],
		];
		yield 'SEO manager with already existing capabilities' => [
			'current_capabilities' => [ 'googlesitekit_view_dashboard' => true ],
			'capability_to_check'  => [ 'googlesitekit_view_dashboard' ],
			'user_roles'           => 'wpseo_manager',
			'expected'             => [ 'googlesitekit_view_dashboard' => true ],
		];
		yield 'Another role without capabilities' => [
			'current_capabilities' => [],
			'capability_to_check'  => [ 'googlesitekit_view_dashboard' ],
			'user_roles'           => 'another role',
			'expected'             => [],
		];
		yield 'Another with already existing capabilities' => [
			'current_capabilities' => [ 'googlesitekit_view_dashboard' => true ],
			'capability_to_check'  => [ 'googlesitekit_view_dashboard' ],
			'user_roles'           => 'another role',
			'expected'             => [ 'googlesitekit_view_dashboard' => true ],
		];
	}
}
