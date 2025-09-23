<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\Infrastructure\Integrations;

use Generator;

/**
 * Test class for the is_onboarded method.
 *
 * @group  site-kit
 *
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Integrations\Site_Kit::to_array
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Integrations\Site_Kit::to_legacy_array
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Integrations\Site_Kit::can_read_data
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Integrations\Site_Kit::is_enabled
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Integrations\Site_Kit::is_ga_connected
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Integrations\Site_Kit::is_connected
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Integrations\Site_Kit::is_setup_completed
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Site_Kit_To_Array_No_Conditional_Met_Test extends Abstract_Site_Kit_Test {

	/**
	 * Tests if to_array returns an empty array when the conditional is not met.
	 *
	 * @dataProvider generate_site_kit_to_array_provider
	 *
	 * @param bool               $is_site_kit_installed   If the Site Kit plugin is installed.
	 * @param bool               $is_site_kit_activated   If the Site Kit plugin is activated.
	 * @param bool               $is_consent_granted      If consent is granted to our integration.
	 * @param bool               $is_ga_connected         If the Google analytics setup is completed.
	 * @param bool               $is_config_dismissed     If the configuration widget is dismissed.
	 * @param string             $access_role_needed      The needed role for using the widgets.
	 * @param string             $access_role_user        The role the user has.
	 * @param int                $search_console_owner_id The id of the user that owns the SC connection.
	 * @param int                $ga_owner_id             The id of the user that owns the GA connection.
	 * @param array<bool|string> $expected                The expected value.
	 *
	 * @return void
	 */
	public function test_to_array(
		bool $is_site_kit_installed,
		bool $is_site_kit_activated,
		bool $is_consent_granted,
		bool $is_ga_connected,
		bool $is_config_dismissed,
		string $access_role_needed,
		string $access_role_user,
		int $search_console_owner_id,
		int $ga_owner_id,
		array $expected
	) {
		$this->site_kit_conditional->expects( 'is_met' )->andReturn( false );

		$this->assertSame( $expected, $this->instance->to_array() );
	}

	/**
	 * Provides data testing for the to array.
	 *
	 * @return Generator Test data to use.
	 */
	public static function generate_site_kit_to_array_provider() {
		yield 'Everything setup' => [
			'is_site_kit_installed'   => true,
			'is_site_kit_activated'   => true,
			'is_consent_granted'      => false,
			'is_ga_connected'         => false,
			'is_config_dismissed'     => false,
			'access_role_needed'      => 'admin',
			'access_role_user'        => 'admin',
			'search_console_owner_id' => 1,
			'ga_owner_id'             => 1,
			'expected'                => [],
		];
	}
}
