<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\Infrastructure\Browser_Cache;

use Brain\Monkey\Functions;
use Generator;
use WP_User;

/**
 * Test class getting the configuration.
 *
 * @group Browser_Cache_Configuration
 *
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Browser_Cache\Browser_Cache_Configuration::get_storage_prefix
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Browser_Cache\Browser_Cache_Configuration::get_widgets_cache_ttl
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Browser_Cache\Browser_Cache_Configuration::get_configuration
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Browser_Cache_Configuration_Get_Configuration_Test extends Abstract_Browser_Cache_Configuration_Test {

	/**
	 * Tests getting the configuration.
	 *
	 * @dataProvider get_configuration_data
	 *
	 * @param bool                                                    $met_conditional The conditional met.
	 * @param string                                                  $user_login      The user login.
	 * @param array<string>                                           $auth_cookie     The auth cookie.
	 * @param int                                                     $blog_id         The blog ID.
	 * @param string                                                  $to_hash         The string to hash.
	 * @param string                                                  $hash            The hash.
	 * @param array<string, string|array<string, array<string, int>>> $expected        The expected configuration.
	 *
	 * @return void
	 */
	public function test_get_configuration(
		$met_conditional,
		$user_login,
		$auth_cookie,
		$blog_id,
		$to_hash,
		$hash,
		$expected
	) {
		$this->google_site_kit_feature_conditional
			->expects( 'is_met' )
			->once()
			->andReturn( $met_conditional );

		$user1             = new WP_User();
		$user1->user_login = $user_login;

		Functions\expect( 'wp_get_current_user' )
			->andReturn( $user1 );

		Functions\expect( 'wp_parse_auth_cookie' )
			->once()
			->andReturn( $auth_cookie );

		Functions\expect( 'get_current_blog_id' )
			->once()
			->andReturn( $blog_id );

		Functions\expect( 'wp_hash' )
			->once()
			->with( $to_hash, )
			->andReturn( $hash );

		$this->assertEquals( $expected, $this->instance->get_configuration() );
	}

	/**
	 * Data provider for the get_configuration test.
	 *
	 * @return Generator Test data to use.
	 */
	public static function get_configuration_data() {
		$ttls = [
			'topPages' => [
				'ttl'  => 60,
			],
			'topQueries' => [
				'ttl'  => 3600,
			],
			'searchRankingCompare' => [
				'ttl'  => 3600,
			],
			'organicSessions' => [
				'ttl'  => 3600,
			],
		];

		yield 'Logged in user' => [
			'met_conditional' => true,
			'user_login'      => 'admin',
			'auth_cookie'     => [
				'username' => 'test',
				'token'    => 'randoM_TokeN_123',
			],
			'blog_id'         => 1,
			'to_hash'         => 'admin|randoM_TokeN_123|1',
			'hash'            => 'raNdoM_HasH_12345',
			'expected'        => [
				'storagePrefix'   => 'raNdoM_HasH_12345',
				'yoastVersion'    => \WPSEO_VERSION,
				'widgetsCacheTtl' => $ttls,
			],
		];
		yield 'Logged in user with no token' => [
			'met_conditional' => true,
			'user_login'      => 'admin',
			'auth_cookie'     => [
				'username' => 'test',
			],
			'blog_id'         => 1,
			'to_hash'         => 'admin||1',
			'hash'            => 'Other_raNdoM_HasH_12345',
			'expected'        => [
				'storagePrefix'   => 'Other_raNdoM_HasH_12345',
				'yoastVersion'    => \WPSEO_VERSION,
				'widgetsCacheTtl' => $ttls,
			],
		];
		yield 'Logged in user in subsite' => [
			'met_conditional' => true,
			'user_login'      => 'admin',
			'auth_cookie'     => [
				'username' => 'test',
				'token'    => 'randoM_TokeN_1234',
			],
			'blog_id'         => 2,
			'to_hash'         => 'admin|randoM_TokeN_1234|2',
			'hash'            => 'Other_raNdoM_HasH_12345',
			'expected'        => [
				'storagePrefix'   => 'Other_raNdoM_HasH_12345',
				'yoastVersion'    => \WPSEO_VERSION,
				'widgetsCacheTtl' => $ttls,
			],
		];
	}
}
