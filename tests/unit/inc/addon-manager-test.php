<?php

namespace Yoast\WP\SEO\Tests\Unit\Inc;

use Brain\Monkey;
use Mockery;
use stdClass;
use WPSEO_Utils;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Tests\Unit\Doubles\Inc\Addon_Manager_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit Test Class.
 *
 * @coversDefaultClass \WPSEO_Addon_Manager
 *
 * @group MyYoast
 */
class Addon_Manager_Test extends TestCase {

	/**
	 * Dummy future date for use by the tests.
	 *
	 * @var string|null Date in the future.
	 */
	private $future_date = null;

	/**
	 * Dummy past date for use by the tests.
	 *
	 * @var string|null Date in the past.
	 */
	private $past_date = null;

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var Mockery\Mock|Addon_Manager_Double
	 */
	protected $instance;

	/**
	 * Setup the tests.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = Mockery::mock( Addon_Manager_Double::class )
			->shouldAllowMockingProtectedMethods()
			->makePartial();
	}

	/**
	 * Tests retrieval of site information that will return the defaults.
	 *
	 * @covers ::get_subscriptions
	 * @covers ::get_site_information
	 */
	public function test_get_subscriptions_with_no_installed_addons() {
		$this->instance
			->expects( 'has_installed_addons' )
			->once()
			->andReturnFalse();

		$this->instance
			->expects( 'get_site_information_default' )
			->once()
			->andReturn(
				(object) [
					'subscriptions' => [],
				]
			);

		$this->assertEquals( [], $this->instance->get_subscriptions() );
	}

	/**
	 * Tests retrieval of site information that will return the defaults.
	 *
	 * @covers WPSEO_Addon_Manager::get_subscriptions
	 * @covers WPSEO_Addon_Manager::get_site_information
	 */
	public function test_get_subscriptions_with_site_transient() {
		$this->instance
			->expects( 'has_installed_addons' )
			->once()
			->andReturnTrue();

		$this->instance
			->expects( 'get_site_information_transient' )
			->once()
			->andReturn(
				(object) [
					'subscriptions' => [],
				]
			);

		$this->assertEquals( [], $this->instance->get_subscriptions() );
	}

	/**
	 * Tests retrieval of site information that will return the defaults.
	 *
	 * @covers ::get_subscriptions
	 * @covers ::get_site_information
	 */
	public function test_get_subscriptions_with_current_sites() {
		$this->instance
			->expects( 'has_installed_addons' )
			->once()
			->andReturnTrue();

		$this->instance
			->expects( 'get_site_information_transient' )
			->once()
			->andReturnNull();

		$subscriptions = (object) [
			'url'           => 'https://example.org',
			'subscriptions' => [
				(object) [
					'expiryDate' => 'date',
					'renewalUrl' => 'url',
					'product'    => (object) [
						'version'     => '1.0',
						'name'        => 'product',
						'slug'        => 'product-slug',
						'lastUpdated' => 'date',
						'storeUrl'    => 'store-url',
						'download'    => 'download-url',
						'changelog'   => 'changelog',
					],
				],
			],
		];

		$this->instance
			->expects( 'request_current_sites' )
			->once()
			->andReturn( $subscriptions );

		$this->instance
			->expects( 'map_site_information' )
			->once()
			->with( $subscriptions )
			->andReturn( $subscriptions );

		$this->instance
			->expects( 'set_site_information_transient' )
			->once()
			->with( $subscriptions );

		$this->assertEquals( $subscriptions->subscriptions, $this->instance->get_subscriptions() );
	}

	/**
	 * Tests retrieval of site information that will return the defaults.
	 *
	 * @covers ::get_subscriptions
	 * @covers ::get_site_information
	 */
	public function test_get_subscriptions_with_no_current_sites_found() {
		$this->instance
			->expects( 'has_installed_addons' )
			->once()
			->andReturnTrue();

		$this->instance
			->expects( 'get_site_information_transient' )
			->once()
			->andReturnNull();

		$this->instance
			->expects( 'request_current_sites' )
			->once()
			->andReturnFalse();

		$this->instance
			->expects( 'get_site_information_default' )
			->once()
			->andReturn(
				(object) [
					'subscriptions' => [],
				]
			);

		$this->assertEquals( [], $this->instance->get_subscriptions() );
	}

	/**
	 * Tests retrieval of a subscription
	 *
	 * @covers ::get_subscription
	 */
	public function test_get_subscription() {
		$subscription = (object) [
			'product' => (object) [
				'slug' => 'wordpress-seo',
			],
		];

		$this->instance
			->expects( 'get_subscriptions' )
			->once()
			->andReturn( (object) [ $subscription ] );

		$this->assertEquals(
			$subscription,
			$this->instance->get_subscription( 'wordpress-seo' )
		);
	}

	/**
	 * Tests retrieval of an non-existing subscription.
	 *
	 * @covers ::get_subscription
	 */
	public function test_get_subscription_not_found() {
		$subscription = (object) [
			'product' => (object) [
				'slug' => 'wordpress-seo',
			],
		];

		$this->instance
			->expects( 'get_subscriptions' )
			->once()
			->andReturn( (object) [ $subscription ] );

		$this->assertFalse( $this->instance->get_subscription( 'non-existing' ) );
	}

	/**
	 * Tests the retrieval of subscriptions for the active addons.
	 *
	 * @covers ::get_subscriptions_for_active_addons
	 */
	public function test_get_subscriptions_for_active_addons() {
		$this->instance
			->expects( 'get_active_addons' )
			->once()
			->andReturn(
				[
					'wp-seo-premium.php' => [
						'Version' => '10.0',
					],
				]
			);

		$this->instance
			->expects( 'get_subscriptions' )
			->once()
			->andReturn( $this->get_subscriptions() );

		$product_helper_mock = Mockery::mock( Product_Helper::class );
		$product_helper_mock->expects( 'is_premium' )->once()->andReturn( false );

		$helpers_mock = (object) [ 'product' => $product_helper_mock ];
		Monkey\Functions\expect( 'YoastSEO' )->once()->andReturn( (object) [ 'helpers' => $helpers_mock ] );

		$this->assertEquals(
			[
				'yoast-seo-wordpress-premium' => (object) [
					'expiry_date' => $this->get_future_date(),
					'product'     => (object) [
						'version'      => '10.0',
						'name'         => 'Extension',
						'slug'         => 'yoast-seo-wordpress-premium',
						'last_updated' => 'yesterday',
						'store_url'    => 'https://example.org/store',
						'download'     => 'https://example.org/extension.zip',
						'changelog'    => 'changelog',
					],
				],
			],
			$this->instance->get_subscriptions_for_active_addons()
		);
	}

	/**
	 * Tests the retrieval of addons and their filenames.
	 *
	 * @covers ::get_addon_filenames
	 */
	public function test_get_addon_filenames() {
		$actual = $this->instance->get_addon_filenames();

		$this->assertSame(
			[
				'wp-seo-premium.php'    => 'yoast-seo-wordpress-premium',
				'wpseo-news.php'        => 'yoast-seo-news',
				'video-seo.php'         => 'yoast-seo-video',
				'wpseo-woocommerce.php' => 'yoast-seo-woocommerce',
				'local-seo.php'         => 'yoast-seo-local',
			],
			$actual
		);
	}

	/**
	 * Tests the lookup of a plugin slug to a plugin file.
	 *
	 * @covers ::get_plugin_file
	 */
	public function test_get_plugin_file() {
		$this->instance
			->expects( 'get_plugins' )
			->once()
			->andReturn(
				[
					'wp-seo-premium.php'         => [ 'Version' => '10.0' ],
					'no-yoast-seo-extension-php' => [ 'Version' => '10.0' ],
					'wpseo-news.php'             => [ 'Version' => '9.5' ],
				]
			);

		$actual = $this->instance->get_plugin_file( 'yoast-seo-news' );

		$this->assertSame( 'wpseo-news.php', $actual );
	}

	/**
	 * Tests the lookup of a plugin slug to a plugin file.
	 *
	 * @covers ::get_plugin_file
	 */
	public function test_get_plugin_file_nonexistent_plugin() {
		$this->instance
			->expects( 'get_plugins' )
			->once()
			->andReturn(
				[
					'wp-seo-premium.php'         => [ 'Version' => '10.0' ],
					'no-yoast-seo-extension-php' => [ 'Version' => '10.0' ],
					'wpseo-news.php'             => [ 'Version' => '9.5' ],
				]
			);

		$actual = $this->instance->get_plugin_file( 'some-other-plugin-slug' );

		$this->assertFalse( $actual );
	}

	/**
	 * Tests the retrieval of installed addon versions.
	 *
	 * @covers ::get_installed_addons_versions
	 */
	public function test_get_installed_addons_versions() {
		$this->instance
			->expects( 'get_installed_addons' )
			->once()
			->andReturn(
				[
					'wp-seo-premium.php' => [
						'Version' => '10.0',
					],
				]
			);

		$product_helper_mock = Mockery::mock( Product_Helper::class );
		$product_helper_mock->expects( 'is_premium' )->once()->andReturn( false );

		$helpers_mock = (object) [ 'product' => $product_helper_mock ];
		Monkey\Functions\expect( 'YoastSEO' )->once()->andReturn( (object) [ 'helpers' => $helpers_mock ] );

		$this->assertEquals(
			[
				'yoast-seo-wordpress-premium' => '10.0',
			],
			$this->instance->get_installed_addons_versions()
		);
	}

	/**
	 * Tests retrieval of the plugin information.
	 *
	 * @dataProvider get_plugin_information_provider
	 *
	 * @covers       ::get_plugin_information
	 *
	 * @param string $action   The action to use.
	 * @param array  $args     The arguments to pass to the method.
	 * @param mixed  $expected Expected value.
	 * @param string $message  The message when test fails.
	 */
	public function test_get_plugin_information( $action, $args, $expected, $message ) {
		$this->stubTranslationFunctions();

		$this->instance
			->shouldReceive( 'get_subscriptions' )
			->atMost()
			->times( 1 )
			->andReturn( $this->get_subscriptions() );

		Monkey\Functions\expect( 'get_plugin_updates' )
			->andReturn(
				[
					'wordpress-seo/wp-seo.php' => [
						'update' => [
							'tested'       => '5.6',
							'requires_php' => '5.6',
							'requires'     => '5.5',
						],
					],
				]
			);

		$this->assertEquals(
			$expected,
			$this->instance->get_plugin_information( false, $action, (object) $args ),
			$message
		);
	}

	/**
	 * Tests the validation of a valid subscription.
	 *
	 * @covers ::has_valid_subscription
	 */
	public function test_has_valid_subscription() {
		$this->instance
			->expects( 'get_subscriptions' )
			->once()
			->andReturn( $this->get_subscriptions() );

		$this->assertEquals(
			true,
			$this->instance->has_valid_subscription( 'yoast-seo-wordpress-premium' )
		);
	}

	/**
	 * Tests the validation of an invalid subscription.
	 *
	 * @covers ::has_valid_subscription
	 */
	public function test_has_valid_subscription_with_an_expired_subscription() {
		$this->instance
			->expects( 'get_subscriptions' )
			->once()
			->andReturn( $this->get_subscriptions() );

		$this->assertEquals(
			false,
			$this->instance->has_valid_subscription( 'yoast-seo-news' )
		);
	}

	/**
	 * Tests the validation of an unknown subscription.
	 *
	 * @covers ::has_valid_subscription
	 */
	public function test_has_valid_subscription_with_an_unknown_subscription() {
		$this->instance
			->expects( 'get_subscriptions' )
			->once()
			->andReturn( $this->get_subscriptions() );

		$this->assertEquals(
			false,
			$this->instance->has_valid_subscription( 'unknown-slug' )
		);
	}

	/**
	 * Tests the check for updates when no data has been given.
	 *
	 * @dataProvider check_for_updates_provider
	 *
	 * @covers ::check_for_updates
	 *
	 * @param array  $addons   The 'installed' addons.
	 * @param array  $data     Data being send to the method.
	 * @param mixed  $expected The expected value.
	 * @param string $message  Message to show when test fails.
	 */
	public function test_check_for_updates( $addons, $data, $expected, $message ) {
		$this->stubTranslationFunctions();

		$this->instance
			->shouldReceive( 'get_installed_addons' )
			->atMost()
			->times( 2 )
			->andReturn( $addons );

		$this->instance
			->shouldReceive( 'get_subscriptions' )
			->andReturn( $this->get_subscriptions() );

		$this->instance
			->shouldReceive( 'extract_yoast_data' )
			->with( $data )
			->andReturn(
				(object) [
					'requires' => \YOAST_SEO_WP_REQUIRED,
				]
			);

		if ( ! empty( $addons ) ) {
			$product_helper_mock = Mockery::mock( Product_Helper::class );
			$product_helper_mock->shouldReceive( 'is_premium' )->atMost()->times( 2 )->andReturn( false );
			$helpers_mock = (object) [ 'product' => $product_helper_mock ];
			Monkey\Functions\expect( 'YoastSEO' )->atMost()->times( 2 )->andReturn( (object) [ 'helpers' => $helpers_mock ] );
		}

		Monkey\Functions\expect( 'get_plugin_updates' )
			->andReturn(
				[
					'wordpress-seo/wp-seo.php' => [
						'update' => [
							'tested'       => '5.6',
							'requires_php' => '5.6',
						],
					],
				]
			);

		global $wp_version;
		$wp_version = '5.6';
		$this->assertEquals( $expected, $this->instance->check_for_updates( $data ), $message );

		// Now check that the Premium plugin won't show updates, if the requirement for the WP version coming from Yoast free, is not met.
		if ( isset( $addons['wp-seo-premium.php'] ) ) {
			$wp_version = '5.5';
			$updates    = $this->instance->check_for_updates( $data );

			$this->assertTrue( isset( $updates->no_update['wp-seo-premium.php'] ) );
		}
	}

	/**
	 * Tests checking if given value is a Yoast addon.
	 *
	 * @covers ::is_yoast_addon
	 */
	public function test_is_yoast_addon() {
		$product_helper_mock = Mockery::mock( Product_Helper::class );
		$product_helper_mock->expects( 'is_premium' )->twice()->andReturn( false );
		$helpers_mock = (object) [ 'product' => $product_helper_mock ];
		Monkey\Functions\expect( 'YoastSEO' )->twice()->andReturn( (object) [ 'helpers' => $helpers_mock ] );

		$this->assertTrue( $this->instance->is_yoast_addon( 'wp-seo-premium.php' ) );
		$this->assertFalse( $this->instance->is_yoast_addon( 'non-wp-seo-addon.php' ) );
	}

	/**
	 * Tests retrieval of slug for given plugin file.
	 *
	 * @covers ::get_slug_by_plugin_file
	 */
	public function test_get_slug_by_plugin_file() {
		$product_helper_mock = Mockery::mock( Product_Helper::class );
		$product_helper_mock->expects( 'is_premium' )->twice()->andReturn( false );
		$helpers_mock = (object) [ 'product' => $product_helper_mock ];
		Monkey\Functions\expect( 'YoastSEO' )->twice()->andReturn( (object) [ 'helpers' => $helpers_mock ] );

		$this->assertEquals( 'yoast-seo-wordpress-premium', $this->instance->get_slug_by_plugin_file( 'wp-seo-premium.php' ) );
		$this->assertEquals( '', $this->instance->get_slug_by_plugin_file( 'non-wp-seo-addon.php' ) );
	}

	/**
	 * Tests the conversion from a subscription to a plugin array.
	 *
	 * @covers ::convert_subscription_to_plugin
	 */
	public function test_convert_subscription_to_plugin() {
		$this->stubTranslationFunctions();

		$this->assertEquals(
			(object) [
				'new_version'      => '10.0',
				'name'             => 'Extension',
				'slug'             => 'yoast-seo-wordpress-premium',
				'plugin'           => '',
				'url'              => 'https://example.org/store',
				'last_update'      => 'yesterday',
				'homepage'         => 'https://example.org/store',
				'download_link'    => 'https://example.org/extension.zip',
				'package'          => 'https://example.org/extension.zip',
				'sections'         => [
					'changelog' => 'changelog',
					'support'   => '<h4>Need support?</h4><p>You can probably find an answer to your question in our <a href="https://yoast.com/help/">help center</a>. If you still need support and have an active subscription for this product, please email <a href="mailto:support@yoast.com">support@yoast.com</a>.</p>',
				],
				'icons'            => [
					'2x' => 'https://yoa.st/yoast-seo-icon',
				],
				'update_supported' => true,
				'banners'          => [
					'high' => 'https://yoa.st/yoast-seo-banner-premium',
					'low'  => 'https://yoa.st/yoast-seo-banner-low-premium',
				],
				'tested'           => \YOAST_SEO_WP_TESTED,
				'requires_php'     => \YOAST_SEO_PHP_REQUIRED,
				'requires'         => null,
			],
			$this->instance->convert_subscription_to_plugin(
				(object) [
					'product' => (object) [
						'version'      => '10.0',
						'name'         => 'Extension',
						'slug'         => 'yoast-seo-wordpress-premium',
						'last_updated' => 'yesterday',
						'store_url'    => 'https://example.org/store',
						'download'     => 'https://example.org/extension.zip',
						'changelog'    => 'changelog',
					],
				]
			)
		);
	}

	/**
	 * Tests get_installed_plugins with no Yoast addons installed.
	 *
	 * @covers ::get_installed_addons
	 */
	public function test_get_installed_addons_with_no_yoast_addons_installed() {
		$this->instance
			->expects( 'get_plugins' )
			->once()
			->andReturn(
				[
					'no-yoast-seo-extension-php' => [
						'Version' => '10.0',
					],
				]
			);

		$product_helper_mock = Mockery::mock( Product_Helper::class );
		$product_helper_mock->expects( 'is_premium' )->once()->andReturn( false );
		$helpers_mock = (object) [ 'product' => $product_helper_mock ];
		Monkey\Functions\expect( 'YoastSEO' )->once()->andReturn( (object) [ 'helpers' => $helpers_mock ] );

		$this->assertEquals(
			[],
			$this->instance->get_installed_addons()
		);
	}

	/**
	 * Tests get_installed_plugins with no Yoast addons installed.
	 *
	 * @covers ::has_installed_addons
	 */
	public function test_has_installed_addons() {
		$this->instance
			->expects( 'get_installed_addons' )
			->once()
			->andReturn(
				[
					'wp-seo-premium.php' => [
						'Version' => '10.0',
					],
				]
			);

		$this->assertTrue( $this->instance->has_installed_addons() );
	}

	/**
	 * Tests get_installed_plugins with one Yoast addon installed.
	 *
	 * @covers WPSEO_Addon_Manager::get_installed_addons
	 */
	public function test_get_installed_addons_with_yoast_addon_installed() {
		$this->instance
			->expects( 'get_plugins' )
			->once()
			->andReturn(
				[
					'wp-seo-premium.php' => [
						'Version' => '10.0',
					],
				]
			);

		$product_helper_mock = Mockery::mock( Product_Helper::class );
		$product_helper_mock->expects( 'is_premium' )->once()->andReturn( false );
		$helpers_mock = (object) [ 'product' => $product_helper_mock ];
		Monkey\Functions\expect( 'YoastSEO' )->once()->andReturn( (object) [ 'helpers' => $helpers_mock ] );

		$this->assertEquals(
			[
				'wp-seo-premium.php' => [
					'Version' => '10.0',
				],
			],
			$this->instance->get_installed_addons()
		);
	}

	/**
	 * Tests get_installed_plugins with no Yoast addons installed.
	 *
	 * @covers ::get_active_addons
	 */
	public function test_get_active_addons() {
		$this->instance
			->expects( 'get_plugins' )
			->once()
			->andReturn(
				[
					'wp-seo-premium.php'         => [ 'Version' => '10.0' ],
					'no-yoast-seo-extension-php' => [ 'Version' => '10.0' ],
					'wpseo-news.php'             => [ 'Version' => '9.5' ],
				]
			);

		$this->instance
			->expects( 'is_plugin_active' )
			->times( 2 )
			->andReturn( true, false );

		$product_helper_mock = Mockery::mock( Product_Helper::class );
		$product_helper_mock->expects( 'is_premium' )->times( 3 )->andReturn( false );
		$helpers_mock = (object) [ 'product' => $product_helper_mock ];
		Monkey\Functions\expect( 'YoastSEO' )->times( 3 )->andReturn( (object) [ 'helpers' => $helpers_mock ] );

		$this->assertEquals(
			[
				'wp-seo-premium.php' => [
					'Version' => '10.0',
				],
			],
			$this->instance->get_active_addons()
		);
	}

	/**
	 * Provides data to the check_for_updates test.
	 *
	 * @return array Values for the test.
	 */
	public function check_for_updates_provider() {
		return [
			[
				'addons'   => [],
				'data'     => false,
				'expected' => false,
				'message'  => 'Tests with false given as data',
			],
			[
				'addons'   => [],
				'data'     => [],
				'expected' => [],
				'message'  => 'Tests with empty array given as data',
			],
			[
				'addons'   => [],
				'data'     => null,
				'expected' => null,
				'message'  => 'Tests with null given as data',
			],
			[
				'addons'   => [],
				'data'     => (object) [ 'response' => [] ],
				'expected' => (object) [ 'response' => [] ],
				'message'  => 'Tests with no installed addons',
			],
			[
				'addons'   => [
					[
						'wpseo-news.php' => [
							'Version' => '9.5',
						],
					],

				],
				'data'     => (object) [ 'response' => [] ],
				'expected' => (object) [ 'response' => [] ],
				'message'  => 'Tests an addon without a subscription',
			],
			[
				'addons'   => [
					[
						'wps-seo-premium.php' => [
							'Version' => '10.0',
						],
					],
				],
				'data'     => (object) [ 'response' => [] ],
				'expected' => (object) [ 'response' => [] ],
				'message'  => 'Tests an addon with a subscription and no updates available',
			],
			[
				'addons'   => [
					'wp-seo-premium.php' => [
						'Version' => '9.0',
					],
				],
				'data'     => (object) [ 'response' => [] ],
				'expected' => (object) [
					'response' => [
						'wp-seo-premium.php' => (object) [
							'new_version'      => '10.0',
							'name'             => 'Extension',
							'slug'             => 'yoast-seo-wordpress-premium',
							'plugin'           => '',
							'url'              => 'https://example.org/store',
							'last_update'      => 'yesterday',
							'homepage'         => 'https://example.org/store',
							'download_link'    => 'https://example.org/extension.zip',
							'package'          => 'https://example.org/extension.zip',
							'sections'         => [
								'changelog' => 'changelog',
								'support'   => '<h4>Need support?</h4><p>You can probably find an answer to your question in our <a href="https://yoast.com/help/">help center</a>. If you still need support and have an active subscription for this product, please email <a href="mailto:support@yoast.com">support@yoast.com</a>.</p>',
							],
							'icons'            => [
								'2x' => 'https://yoa.st/yoast-seo-icon',
							],
							'update_supported' => true,
							'banners'          => [
								'high' => 'https://yoa.st/yoast-seo-banner-premium',
								'low'  => 'https://yoa.st/yoast-seo-banner-low-premium',
							],
							'tested'           => \YOAST_SEO_WP_TESTED,
							'requires_php'     => \YOAST_SEO_PHP_REQUIRED,
							'requires'         => \YOAST_SEO_WP_REQUIRED,
						],
					],
				],
				'message'  => 'Tests an addon with a subscription and an update available',
			],
		];
	}

	/**
	 * Provides data to the get_plugin_information test.
	 *
	 * @return array Values for the test.
	 */
	public function get_plugin_information_provider() {
		return [
			[
				'action'   => 'wrong_action',
				'args'     => [],
				'expected' => false,
				'message'  => 'Tests with an unexpected action.',
			],
			[
				'action'   => 'plugin_information',
				'args'     => [],
				'expected' => false,
				'message'  => 'Tests with slug missing in the arguments.',
			],
			[
				'action'   => 'plugin_information',
				'args'     => [ 'slug' => 'unkown_slug' ],
				'expected' => false,
				'message'  => 'Tests with a non Yoast addon slug given as argument.',
			],
			[
				'action'   => 'plugin_information',
				'args'     => [ 'slug' => 'yoast-seo-wordpress-premium' ],
				'expected' => (object) [
					'new_version'      => '10.0',
					'name'             => 'Extension',
					'slug'             => 'yoast-seo-wordpress-premium',
					'plugin'           => '',
					'url'              => 'https://example.org/store',
					'last_update'      => 'yesterday',
					'homepage'         => 'https://example.org/store',
					'download_link'    => 'https://example.org/extension.zip',
					'package'          => 'https://example.org/extension.zip',
					'sections'         => [
						'changelog' => 'changelog',
						'support'   => '<h4>Need support?</h4><p>You can probably find an answer to your question in our <a href="https://yoast.com/help/">help center</a>. If you still need support and have an active subscription for this product, please email <a href="mailto:support@yoast.com">support@yoast.com</a>.</p>',
					],
					'icons'            => [
						'2x' => 'https://yoa.st/yoast-seo-icon',
					],
					'update_supported' => true,
					'banners'          => [
						'high' => 'https://yoa.st/yoast-seo-banner-premium',
						'low'  => 'https://yoa.st/yoast-seo-banner-low-premium',
					],
					'tested'           => \YOAST_SEO_WP_TESTED,
					'requires_php'     => \YOAST_SEO_PHP_REQUIRED,
					'requires'         => \YOAST_SEO_WP_REQUIRED,
				],
				'message'  => 'Tests with a Yoast addon slug given as argument.',
			],
		];
	}

	/**
	 * Returns a list of 'subscription'.
	 *
	 * Created this method to keep a good readability.
	 *
	 * This method converts an array to an object by json encoding.
	 *
	 * @return stdClass Subscriptions.
	 */
	protected function get_subscriptions() {
		return \json_decode(
			WPSEO_Utils::format_json_encode(
				[
					'wp-seo-premium.php' => [
						'expiry_date' => $this->get_future_date(),
						'product'     => [
							'version'      => '10.0',
							'name'         => 'Extension',
							'slug'         => 'yoast-seo-wordpress-premium',
							'last_updated' => 'yesterday',
							'store_url'    => 'https://example.org/store',
							'download'     => 'https://example.org/extension.zip',
							'changelog'    => 'changelog',
						],
					],
					'wpseo-news.php'     => [
						'expiry_date' => $this->get_past_date(),
						'product'     => [
							'version'      => '10.0',
							'name'         => 'Extension',
							'slug'         => 'yoast-seo-news',
							'last_updated' => 'yesterday',
							'store_url'    => 'https://example.org/store',
							'download'     => 'https://example.org/extension.zip',
							'changelog'    => 'changelog',
						],
					],
				]
			),
			false
		);
	}

	/**
	 * Gets a date string that lies in the future.
	 *
	 * @return string Future date.
	 */
	protected function get_future_date() {
		if ( $this->future_date === null ) {
			$this->future_date = \gmdate( 'Y-m-d\TH:i:s\Z', ( \time() + \DAY_IN_SECONDS ) );
		}

		return $this->future_date;
	}

	/**
	 * Gets a date string that lies in the past.
	 *
	 * @return string Past date.
	 */
	protected function get_past_date() {
		if ( $this->past_date === null ) {
			$this->past_date = \gmdate( 'Y-m-d\TH:i:s\Z', ( \time() - \DAY_IN_SECONDS ) );
		}

		return $this->past_date;
	}
}
