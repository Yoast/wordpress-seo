<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Admin;

use Brain\Monkey;
use Mockery;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\Jetpack_Conditional;
use Yoast\WP\SEO\Conditionals\Third_Party\Elementor_Activated_Conditional;
use Yoast\WP\SEO\Dashboard\Infrastructure\Endpoints\Site_Kit_Consent_Management_Endpoint;
use Yoast\WP\SEO\Dashboard\Infrastructure\Integrations\Site_Kit;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Woocommerce_Helper;
use Yoast\WP\SEO\Integrations\Admin\Integrations_Page;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Integrations_Page_Integration_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Admin\Integrations_Page
 * @covers \Yoast\WP\SEO\Integrations\Admin\Integrations_Page
 *
 * @group  integrations
 */
final class Integrations_Page_Integration_Test extends TestCase {

	/**
	 * The woocommerce helper.
	 *
	 * @var Mockery\MockInterface|Woocommerce_Helper
	 */
	private $woocommerce_helper;

	/**
	 * The options' helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options_helper;

	/**
	 * The admin asset manager.
	 *
	 * @var Mockery\MockInterface|WPSEO_Admin_Asset_Manager
	 */
	private $admin_asset_manager;

	/**
	 * The elementor conditional.
	 *
	 * @var Mockery\MockInterface|Elementor_Activated_Conditional
	 */
	private $elementor_conditional;

	/**
	 * The jetpack conditional.
	 *
	 * @var Mockery\MockInterface|Jetpack_Conditional
	 */
	private $jetpack_conditional;

	/**
	 * The Site Kit configuration object.
	 *
	 * @var Mockery\MockInterface|Site_Kit
	 */
	private $site_kit_configuration;

	/**
	 * The Site Kit consent management endpoint object.
	 *
	 * @var Mockery\MockInterface|Site_Kit_Consent_Management_Endpoint
	 */
	private $site_kit_consent_management_endpoint;

	/**
	 * The instance under test.
	 *
	 * @var Integrations_Page
	 */
	protected $instance;

	/**
	 * Sets up the tests.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();
		if ( ! \defined( 'WP_PLUGIN_DIR' ) ) {
			\define( 'WP_PLUGIN_DIR', '/' );
		}
		$this->options_helper                       = Mockery::mock( Options_Helper::class );
		$this->admin_asset_manager                  = Mockery::mock( WPSEO_Admin_Asset_Manager::class );
		$this->woocommerce_helper                   = Mockery::mock( Woocommerce_Helper::class );
		$this->elementor_conditional                = Mockery::mock( Elementor_Activated_Conditional::class );
		$this->jetpack_conditional                  = Mockery::mock( Jetpack_Conditional::class );
		$this->site_kit_configuration               = Mockery::mock( Site_Kit::class );
		$this->site_kit_consent_management_endpoint = Mockery::mock( Site_Kit_Consent_Management_Endpoint::class );

		$this->instance = new Integrations_Page(
			$this->admin_asset_manager,
			$this->options_helper,
			$this->woocommerce_helper,
			$this->elementor_conditional,
			$this->jetpack_conditional,
			$this->site_kit_configuration,
			$this->site_kit_consent_management_endpoint
		);
	}

	/**
	 * Tests get_conditionals.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Admin_Conditional::class ],
			$this->instance->get_conditionals()
		);
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {

		Monkey\Filters\expectAdded( 'wpseo_submenu_pages' );
		Monkey\Actions\expectAdded( 'admin_enqueue_scripts' );

		$this->instance->register_hooks();

		$this->assertNotFalse( Monkey\Filters\has( 'wpseo_submenu_pages', [ $this->instance, 'add_submenu_page' ] ) );
		$this->assertNotFalse( Monkey\Actions\has( 'admin_enqueue_scripts', [ $this->instance, 'enqueue_assets' ] ) );
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::enqueue_assets
	 *
	 * @return void
	 */
	public function test_enqueue_assets() {
		$_GET['page'] = 'wpseo_integrations';
		$this->admin_asset_manager->expects()->enqueue_style( 'admin-css' );
		$this->admin_asset_manager->expects()->enqueue_style( 'tailwind' );
		$this->admin_asset_manager->expects()->enqueue_style( 'monorepo' );
		$this->admin_asset_manager->expects()->enqueue_script( 'integrations-page' );
		$this->woocommerce_helper->expects()->is_active()->andReturnFalse();
		Monkey\Functions\expect( 'get_site_url' )
			->andReturn( 'https://www.example.com' );

		Monkey\Functions\expect( 'current_user_can' )
			->with( 'install_plugins' )
			->andReturnTrue();

		Monkey\Functions\expect( 'current_user_can' )
			->with( 'googlesitekit_setup' )
			->andReturnTrue();

		Monkey\Functions\expect( 'is_plugin_active' )->times( 5 )->andReturnTrue();
		Monkey\Functions\expect( 'wp_nonce_url' )->times( 3 )->andReturn( 'nonce' );
		Monkey\Functions\expect( 'self_admin_url' )->times( 3 )->andReturn( 'https://www.example.com' );
		Monkey\Functions\expect( 'plugins_url' )->andReturn( 'https://www.example.com' );
		Monkey\Functions\expect( 'admin_url' )->andReturn( 'https://www.example.com' );

		$this->options_helper->expects( 'get' )->times( 5 )->andReturnTrue();

		$this->elementor_conditional->expects( 'is_met' )->andReturnFalse();
		$this->jetpack_conditional->expects( 'is_met' )->andReturnFalse();
		$site_kit_config = [
			'isInstalled'              => false,
			'isActive'                 => false,
			'isSetupCompleted'         => false,
			'isConnected'              => false,
			'isFeatureEnabled'         => false,
			'installUrl'               => 'example.com',
			'activateUrl'              => 'example.com',
			'setupUrl'                 => 'example.com',
			'isConfigurationDismissed' => false,
		];
		$this->site_kit_configuration->expects( 'to_array' )->andReturn( $site_kit_config );
		$this->site_kit_consent_management_endpoint->expects( 'get_url' )
			->andReturn( 'https://www.example.com/manage-consent' );

		$this->admin_asset_manager->expects( 'localize_script' )->with(
			'integrations-page',
			'wpseoIntegrationsData',
			[
				'semrush_integration_active'         => true,
				'allow_semrush_integration'          => true,
				'algolia_integration_active'         => true,
				'allow_algolia_integration'          => true,
				'wincher_integration_active'         => true,
				'allow_wincher_integration'          => null,
				'elementor_integration_active'       => false,
				'jetpack_integration_active'         => false,
				'woocommerce_seo_installed'          => false,
				'woocommerce_seo_active'             => true,
				'woocommerce_active'                 => false,
				'woocommerce_seo_activate_url'       => 'nonce',
				'acf_seo_installed'                  => false,
				'acf_seo_active'                     => true,
				'acf_active'                         => false,
				'acf_seo_activate_url'               => 'nonce',
				'acf_seo_install_url'                => 'nonce',
				'algolia_active'                     => true,
				'edd_integration_active'             => false,
				'ssp_integration_active'             => false,
				'tec_integration_active'             => false,
				'wp-recipe-maker_integration_active' => false,
				'mastodon_active'                    => false,
				'is_multisite'                       => false,
				'plugin_url'                         => 'https://www.example.com',
				'site_kit_configuration'             => $site_kit_config,
				'site_kit_consent_management_url'    => 'https://www.example.com/manage-consent',
				'capabilities'                       => [
					'installPlugins' => true,
					'setupSiteKit'   => true,
				],
			]
		);

		$this->instance->enqueue_assets();
	}
}
