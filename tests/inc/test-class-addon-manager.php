<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Inc
 */

/**
 * Unit Test Class.
 *
 * @group MyYoast
 */
class WPSEO_Addon_Manager_Test extends WPSEO_UnitTestCase {

	/**
	 * @var string|null Date in the future.
	 */
	private $future_date = null;

	/**
	 * @var string|null Date in the past.
	 */
	private $past_date = null;

	/**
	 * Tests retrieval of site information that will return the defaults.
	 *
	 * @covers WPSEO_Addon_Manager::get_site_information
	 */
	public function test_get_site_information_return_defaults() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Addon_Manager' )
			->setMethods( array( 'request_current_sites' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'request_current_sites' )
			->will( $this->returnValue( false ) );

		$this->assertEquals(
			(object) array(
				'url'           => WPSEO_Utils::get_home_url(),
				'subscriptions' => array(),
			),
			$instance->get_site_information()
		);
	}

	/**
	 * Tests retrieval of the site information that will return the api request value.
	 *
	 * @covers WPSEO_Addon_Manager::get_site_information
	 */
	public function test_get_site_information_return_api_request_value() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Addon_Manager' )
			->setMethods( array( 'request_current_sites', 'set_site_information_transient' ) )
			->getMock();

		$expected_return = $this->returnValue(
			(object) array(
				'url'           => 'https://example.org',
				'subscriptions' => array(
					(object) array(
						'expiryDate' => 'date',
						'renewalUrl' => 'url',
						'product'     => (object) array(
							'version'     => '1.0',
							'name'        => 'product',
							'slug'        => 'product-slug',
							'lastUpdated' => 'date',
							'storeUrl'    => 'store-url',
							'download'    => 'download-url',
							'changelog'   => 'changelog',
						),
					)
				),
			)
		);

		$instance
			->expects( $this->once() )
			->method( 'request_current_sites' )
			->will( $expected_return );

		$instance
			->expects( $this->once() )
			->method( 'set_site_information_transient' );

		$this->assertEquals(
			(object) array(
				'url'           => 'https://example.org',
				'subscriptions' => array(
					(object) array(
						'expiry_date' => 'date',
						'renewal_url' => 'url',
						'product'     => (object) array(
							'version'      => '1.0',
							'name'         => 'product',
							'slug'         => 'product-slug',
							'last_updated' => 'date',
							'store_url'    => 'store-url',
							'download'     => 'download-url',
							'changelog'    => 'changelog',
						),
					)
				),
			),
			$instance->get_site_information()
		);
	}

	/**
	 * Tests retrieval of site information that will return the transient value.
	 *
	 * @covers WPSEO_Addon_Manager::get_site_information
	 */
	public function test_get_site_information_return_transient_value() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Addon_Manager' )
			->setMethods( array( 'get_site_information_transient' ) )
			->getMock();

		$expected_return = $this->returnValue(
			(object) array(
				'url'           => 'https://example.org',
				'subscriptions' => array( 'subscription' ),
			)
		);

		$instance
			->expects( $this->once() )
			->method( 'get_site_information_transient' )
			->will( $expected_return );

		$this->assertEquals(
			(object) array(
				'url'           => 'https://example.org',
				'subscriptions' => array( 'subscription' ),
			),
			$instance->get_site_information()
		);
	}

	/**
	 * Tests retrieval of the subscriptions.
	 *
	 * @covers WPSEO_Addon_Manager::get_subscriptions
	 */
	public function test_get_subscriptions() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Addon_Manager' )
			->setMethods( array( 'get_site_information' ) )
			->getMock();

		$expected_return = $this->returnValue(
			(object) array(
				'url'           => 'https://example.org',
				'subscriptions' => array( 'subscription' ),
			)
		);

		$instance
			->expects( $this->once() )
			->method( 'get_site_information' )
			->will( $expected_return );

		$this->assertEquals(
			array( 'subscription' ),
			$instance->get_subscriptions()
		);
	}

	/**
	 * Tests retrieval of a specific subscription.
	 *
	 * @covers WPSEO_Addon_Manager::get_subscription
	 */
	public function test_get_subscription() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Addon_Manager' )
			->setMethods( array( 'get_subscriptions' ) )
			->getMock();

		$subscription = (object) array(
			'product' => (object) array(
				'slug' => 'wordpress-seo',
			),
		);

		$expected_return = $this->returnValue(
			(object) array(
				'wordpress-seo' => $subscription,
			)
		);

		$instance
			->expects( $this->once() )
			->method( 'get_subscriptions' )
			->will( $expected_return );

		$this->assertEquals(
			$subscription,
			$instance->get_subscription( 'wordpress-seo' )
		);
	}

	/**
	 * Tests retrieval of an unexisting subscription.
	 *
	 * @covers WPSEO_Addon_Manager::get_subscription
	 */
	public function test_get_subscription_not_found() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Addon_Manager' )
			->setMethods( array( 'get_subscriptions' ) )
			->getMock();

		$subscription = (object) array(
			'product' => (object) array(
				'slug' => 'wordpress-seo',
			),
		);

		$expected_return = $this->returnValue(
			(object) array(
				'wordpress-seo' => $subscription,
			)
		);

		$instance
			->expects( $this->once() )
			->method( 'get_subscriptions' )
			->will( $expected_return );

		$this->assertFalse( $instance->get_subscription( 'wordpress-seo-extra' ) );
	}

	/**
	 * Tests the retrieval of subscriptions for the active addons.
	 *
	 * @covers WPSEO_Addon_Manager::get_subscriptions_for_active_addons
	 */
	public function test_get_subscriptions_for_active_addons() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Addon_Manager' )
			->setMethods( array( 'get_active_addons', 'get_subscriptions' ) )
			->getMock();

		$instance
			->expects( $this->any() )
			->method( 'get_active_addons' )
			->will(
				$this->returnValue(
					array(
						'wp-seo-premium.php' => array(
							'Version' => '10.0',
						),
					)
				)
			);

		$instance
			->expects( $this->once() )
			->method( 'get_subscriptions' )
			->will(
				$this->returnValue( $this->get_subscriptions() )
			);

		$this->assertEquals(
			array(
				'yoast-seo-wordpress-premium' => (object) array(
					'expiry_date' => $this->get_future_date(),
					'product' => (object) array(
						'version'     => '10.0',
						'name'        => 'Extension',
						'slug'        => 'yoast-seo-wordpress-premium',
						'lastUpdated' => 'yesterday',
						'storeUrl'    => 'https://example.org/store',
						'download'    => 'https://example.org/extension.zip',
						'changelog'   => 'changelog',
					),
				),
			),
			$instance->get_subscriptions_for_active_addons()
		);
	}

	/**
	 * Tests the retrieval of installed addon versions.
	 *
	 * @covers WPSEO_Addon_Manager::get_installed_addons_versions
	 */
	public function test_get_installed_addons_versions() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Addon_Manager' )
			->setMethods( array( 'get_installed_addons' ) )
			->getMock();

		$instance
			->expects( $this->any() )
			->method( 'get_installed_addons' )
			->will(
				$this->returnValue(
					array(
						'wp-seo-premium.php' => array(
							'Version' => '10.0',
						),
					)
				)
			);

		$this->assertEquals(
			array(
				'yoast-seo-wordpress-premium' => '10.0',
			),
			$instance->get_installed_addons_versions()
		);
	}

	/**
	 * Tests retrieval of the plugin information.
	 *
	 * @dataProvider get_plugin_information_provider
	 *
	 * @covers       WPSEO_Addon_Manager::get_plugin_information
	 *
	 * @param string $action   The action to use.
	 * @param array  $args     The arguments to pass to the method.
	 * @param mixed  $expected Expected value.
	 * @param string $message  The message when test fails.
	 */
	public function test_get_plugin_information( $action, $args, $expected, $message ) {
		$instance = $this
			->getMockBuilder( 'WPSEO_Addon_Manager' )
			->setMethods( array( 'get_subscriptions' ) )
			->getMock();

		$instance
			->expects( $this->any() )
			->method( 'get_subscriptions' )
			->will( $this->returnValue( $this->get_subscriptions() ) );

		$this->assertEquals(
			$expected,
			$instance->get_plugin_information( false, $action, (object) $args ),
			$message
		);
	}

	/**
	 * Tests the validation of a valid subscription.
	 *
	 * @covers WPSEO_Addon_Manager::has_valid_subscription
	 */
	public function test_has_valid_subscription() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Addon_Manager' )
			->setMethods( array( 'get_subscriptions' ) )
			->getMock();

		$instance
			->expects( $this->any() )
			->method( 'get_subscriptions' )
			->will( $this->returnValue( $this->get_subscriptions() ) );

		$this->assertEquals(
			true,
			$instance->has_valid_subscription( 'yoast-seo-wordpress-premium' )
		);
	}

	/**
	 * Tests the validation of an invalid subscription.
	 *
	 * @covers WPSEO_Addon_Manager::has_valid_subscription
	 */
	public function test_has_valid_subscription_with_an_expired_subscription() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Addon_Manager' )
			->setMethods( array( 'get_subscriptions' ) )
			->getMock();

		$instance
			->expects( $this->any() )
			->method( 'get_subscriptions' )
			->will( $this->returnValue( $this->get_subscriptions() ) );

		$this->assertEquals(
			false,
			$instance->has_valid_subscription( 'yoast-seo-news' )
		);
	}

	/**
	 * Tests the validation of an unknown subscription.
	 *
	 * @covers WPSEO_Addon_Manager::has_valid_subscription
	 */
	public function test_has_valid_subscription_with_an_unknown_subscription() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Addon_Manager' )
			->setMethods( array( 'get_subscriptions' ) )
			->getMock();

		$instance
			->expects( $this->any() )
			->method( 'get_subscriptions' )
			->will( $this->returnValue( $this->get_subscriptions() ) );

		$this->assertEquals(
			false,
			$instance->has_valid_subscription( 'unknown-slug' )
		);
	}

	/**
	 * Tests the check for updates when no data has been given.
	 *
	 * @dataProvider check_for_updates_provider
	 *
	 * @covers       WPSEO_Addon_Manager::check_for_updates
	 *
	 * @param array  $addons   The 'installed' addons.
	 * @param array  $data     Data being send to the method.
	 * @param mixed  $expected The expecte value.
	 * @param string $message  Message to show when test fails.
	 */
	public function test_check_for_updates( $addons, $data, $expected, $message ) {
		$instance = $this
			->getMockBuilder( 'WPSEO_Addon_Manager' )
			->setMethods( array( 'get_installed_addons', 'get_subscriptions' ) )
			->getMock();

		$instance
			->expects( $this->any() )
			->method( 'get_installed_addons' )
			->will( $this->returnValue( $addons ) );

		$instance
			->expects( $this->any() )
			->method( 'get_subscriptions' )
			->will( $this->returnValue( $this->get_subscriptions() ) );

		$this->assertEquals( $expected, $instance->check_for_updates( $data ), $message );
	}

	/**
	 * Tests checking if given value is a Yoast addon.
	 *
	 * @covers WPSEO_Addon_Manager::is_yoast_addon
	 */
	public function test_is_yoast_addon() {
		$instance = new WPSEO_Addon_Manager_Double();

		$this->assertTrue( $instance->is_yoast_addon( 'wp-seo-premium.php' ) );
		$this->assertFalse( $instance->is_yoast_addon( 'non-wp-seo-addon.php' ) );
	}

	/**
	 * Tests retrieval of slug for given plugin file.
	 *
	 * @covers WPSEO_Addon_Manager::get_slug_by_plugin_file
	 */
	public function test_get_slug_by_plugin_file() {
		$instance = new WPSEO_Addon_Manager_Double();

		$this->assertEquals( 'yoast-seo-wordpress-premium', $instance->get_slug_by_plugin_file( 'wp-seo-premium.php' ) );
		$this->assertEquals( '', $instance->get_slug_by_plugin_file( 'non-wp-seo-addon.php' ) );
	}

	/**
	 * Tests the conversion from a subscription to a plugin array.
	 *
	 * @covers WPSEO_Addon_Manager::convert_subscription_to_plugin
	 */
	public function test_convert_subscription_to_plugin() {
		$instance = new WPSEO_Addon_Manager_Double();

		$this->assertEquals(
			(object) array(
				'new_version'   => '10.0',
				'name'          => 'Extension',
				'slug'          => 'yoast-seo-wordpress-premium',
				'url'           => 'https://example.org/store',
				'last_update'   => 'yesterday',
				'homepage'      => 'https://example.org/store',
				'download_link' => 'https://example.org/extension.zip',
				'package'       => 'https://example.org/extension.zip',
				'sections'      => array(
					'changelog' => 'changelog',
				),
			),
			$instance->convert_subscription_to_plugin(
				(object) array(
					'product' => (object) array(
						'version'     => '10.0',
						'name'        => 'Extension',
						'slug'        => 'yoast-seo-wordpress-premium',
						'lastUpdated' => 'yesterday',
						'storeUrl'    => 'https://example.org/store',
						'download'    => 'https://example.org/extension.zip',
						'changelog'   => 'changelog',
					),
				)
			)
		);
	}

	/**
	 * Tests get_installed_plugins with no yoast addons installed.
	 *
	 * @covers WPSEO_Addon_Manager::get_installed_addons
	 */
	public function test_get_installed_addons_with_no_yoast_addons_installed() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Addon_Manager_Double' )
			->setMethods( array( 'get_plugins' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_plugins' )
			->will(
				$this->returnValue(
					array(
						'no-yoast-seo-extension-php' => array(
							'Version' => '10.0',
						),
					)
				)
			);

		$this->assertEquals(
			array(),
			$instance->get_installed_addons()
		);
	}

	/**
	 * Tests get_installed_plugins with one yoast addon installed.
	 *
	 * @covers WPSEO_Addon_Manager::get_installed_addons
	 */
	public function test_get_installed_addons_with_yoast_addon_installed() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Addon_Manager_Double' )
			->setMethods( array( 'get_plugins' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_plugins' )
			->will(
				$this->returnValue(
					array(
						'wp-seo-premium.php' => array(
							'Version' => '10.0',
						),
					)
				)
			);

		$this->assertEquals(
			array(
				'wp-seo-premium.php' => array(
					'Version' => '10.0',
				),
			),
			$instance->get_installed_addons()
		);
	}

	/**
	 * Tests get_installed_plugins with no yoast addons installed.
	 *
	 * @covers WPSEO_Addon_Manager::get_active_addons
	 */
	public function test_get_active_addons() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Addon_Manager_Double' )
			->setMethods( array( 'get_plugins', 'is_plugin_active' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_plugins' )
			->will(
				$this->returnValue(
					array(
						'wp-seo-premium.php'         => array(
							'Version' => '10.0',
						),
						'no-yoast-seo-extension-php' => array(
							'Version' => '10.0',
						),
						'wpseo-news.php'             => array(
							'Version' => '9.5',
						),
					)
				)
			);

		$instance
			->expects( $this->exactly( 2 ) )
			->method( 'is_plugin_active' )
			->will(
				$this->onConsecutiveCalls(
					true,
					false
				)
			);

		$this->assertEquals(
			array(
				'wp-seo-premium.php' => array(
					'Version' => '10.0',
				),
			),
			$instance->get_active_addons()
		);
	}

	/**
	 * Provides data to the check_for_updates test.
	 *
	 * @return array Values for the test.
	 */
	public function check_for_updates_provider() {
		return array(
			array(
				'addons'   => array(),
				'data'     => false,
				'expected' => false,
				'message'  => 'Tests with false given as data',
			),
			array(
				'addons'   => array(),
				'data'     => array(),
				'expected' => array(),
				'message'  => 'Tests with empty array given as data',
			),
			array(
				'addons'   => array(),
				'data'     => null,
				'expected' => null,
				'message'  => 'Tests with null given as data',
			),
			array(
				'addons'   => array(),
				'data'     => (object) array( 'response' => array() ),
				'expected' => (object) array( 'response' => array() ),
				'message'  => 'Tests with no installed addons',
			),
			array(
				'addons'   => array(
					array(
						'wpseo-news.php' => array(
							'Version' => '9.5',
						),
					),

				),
				'data'     => (object) array( 'response' => array() ),
				'expected' => (object) array( 'response' => array() ),
				'message'  => 'Tests an addon without a subscription',
			),
			array(
				'addons'   => array(
					array(
						'wps-seo-premium.php' => array(
							'Version' => '10.0',
						),
					),
				),
				'data'     => (object) array( 'response' => array() ),
				'expected' => (object) array( 'response' => array() ),
				'message'  => 'Tests an addon with a subscription and no updates available',
			),
			array(
				'addons'   => array(
					'wp-seo-premium.php' => array(
						'Version' => '9.0',
					),
				),
				'data'     => (object) array( 'response' => array() ),
				'expected' => (object) array(
					'response' => array(
						'wp-seo-premium.php' => (object) array(
							'new_version'   => '10.0',
							'name'          => 'Extension',
							'slug'          => 'yoast-seo-wordpress-premium',
							'url'           => 'https://example.org/store',
							'last_update'   => 'yesterday',
							'homepage'      => 'https://example.org/store',
							'download_link' => 'https://example.org/extension.zip',
							'package'       => 'https://example.org/extension.zip',
							'sections'      => array(
								'changelog' => 'changelog',
							),
						),
					),
				),
				'message'  => 'Tests an addon with a subscription and an update available',
			),
		);
	}

	/**
	 * Provides data to the get_plugin_information test.
	 *
	 * @return array Values for the test.
	 */
	public function get_plugin_information_provider() {
		return array(
			array(
				'action'   => 'wrong_action',
				'args'     => array(),
				'expected' => false,
				'message'  => 'Tests with an unexpected action.',
			),
			array(
				'action'   => 'plugin_information',
				'args'     => array(),
				'expected' => false,
				'message'  => 'Tests with slug missing in the arguments.',
			),
			array(
				'action'   => 'plugin_information',
				'args'     => array( 'slug' => 'unkown_slug' ),
				'expected' => false,
				'message'  => 'Tests with a non yoast addon slug given as argument.',
			),
			array(
				'action'   => 'plugin_information',
				'args'     => array( 'slug' => 'yoast-seo-wordpress-premium' ),
				'expected' => (object) array(
					'new_version'   => '10.0',
					'name'          => 'Extension',
					'slug'          => 'yoast-seo-wordpress-premium',
					'url'           => 'https://example.org/store',
					'last_update'   => 'yesterday',
					'homepage'      => 'https://example.org/store',
					'download_link' => 'https://example.org/extension.zip',
					'package'       => 'https://example.org/extension.zip',
					'sections'      => array(
						'changelog' => 'changelog',
					),
				),
				'message'  => 'Tests with a yoast addon slug given as argument.',
			),
		);
	}

	/**
	 * Returns a list of 'subscription'.
	 *
	 * Created this method to keep a good readability.
	 *
	 * @return stdClass Subscriptions.
	 */
	protected function get_subscriptions() {
		return json_decode(
			json_encode(
				array(
					'wp-seo-premium.php' => array(
						'expiry_date' => $this->get_future_date(),
						'product' => array(
							'version'     => '10.0',
							'name'        => 'Extension',
							'slug'        => 'yoast-seo-wordpress-premium',
							'lastUpdated' => 'yesterday',
							'storeUrl'    => 'https://example.org/store',
							'download'    => 'https://example.org/extension.zip',
							'changelog'   => 'changelog',
						),
					),
					'wpseo-news.php' => array(
						'expiry_date' => $this->get_past_date(),
						'product' => array(
							'version'     => '10.0',
							'name'        => 'Extension',
							'slug'        => 'yoast-seo-news',
							'lastUpdated' => 'yesterday',
							'storeUrl'    => 'https://example.org/store',
							'download'    => 'https://example.org/extension.zip',
							'changelog'   => 'changelog',
						),
					),
				)
			)
		);
	}

	/**
	 * Gets a date string that lies in the future.
	 *
	 * @return string Future date.
	 */
	protected function get_future_date() {
		if ( $this->future_date === null ) {
			$this->future_date = gmdate( 'Y-m-d\TH:i:s\Z', time() + DAY_IN_SECONDS );
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
			$this->past_date = gmdate( 'Y-m-d\TH:i:s\Z', time() - DAY_IN_SECONDS );
		}
		return $this->past_date;
	}
}
