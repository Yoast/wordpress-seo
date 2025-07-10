<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Admin;

use Brain\Monkey;
use Mockery;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\AI_Consent\User_Interface\Ai_Consent_Integration;
use Yoast\WP\SEO\Conditionals\User_Profile_Conditional;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the AI generator integration.
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI_Consent\User_Interface\Ai_Consent_Integration
 *
 * @group integrations
 */
final class Ai_Consent_Integration_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Ai_Consent_Integration
	 */
	private $instance;

	/**
	 * Represents the asset manager.
	 *
	 * @var Mockery\MockInterface|WPSEO_Admin_Asset_Manager
	 */
	private $asset_manager;

	/**
	 * Represents the user helper.
	 *
	 * @var Mockery\MockInterface|User_Helper
	 */
	private $user_helper;

	/**
	 * The short link helper.
	 *
	 * @var Mockery\MockInterface|Short_Link_Helper
	 */
	protected $short_link_helper;

	/**
	 * Sets an instance for test purposes.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->asset_manager     = Mockery::mock( WPSEO_Admin_Asset_Manager::class );
		$this->user_helper       = Mockery::mock( User_Helper::class );
		$this->short_link_helper = Mockery::mock( Short_Link_Helper::class );

		$this->instance = new Ai_Consent_Integration( $this->asset_manager, $this->user_helper, $this->short_link_helper );
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ User_Profile_Conditional::class ],
			Ai_Consent_Integration::get_conditionals()
		);
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			WPSEO_Admin_Asset_Manager::class,
			$this->getPropertyValue( $this->instance, 'asset_manager' )
		);
		$this->assertInstanceOf(
			User_Helper::class,
			$this->getPropertyValue( $this->instance, 'user_helper' )
		);
		$this->assertInstanceOf(
			Short_Link_Helper::class,
			$this->getPropertyValue( $this->instance, 'short_link_helper' )
		);
	}

	/**
	 * Data provider for the register_hooks test.
	 *
	 * @return array<string, array<string, bool>>
	 */
	public static function data_provider_register_hooks() {
		return [
			'When user can edit posts' => [
				'edit_posts'          => true,
			],
			'When user can not edit posts' => [
				'edit_posts'          => false,
			],
		];
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 *
	 * @dataProvider data_provider_register_hooks
	 *
	 * @param bool $edit_posts Whether the user can edit posts.
	 *
	 * @return void
	 */
	public function test_register_hooks( $edit_posts ) {
		Monkey\Functions\expect( 'current_user_can' )
			->once()
			->with( 'edit_posts' )
			->andReturn( $edit_posts );

		Monkey\Actions\expectAdded( 'wpseo_user_profile_additions' )
			->times( (int) $edit_posts )
			->with( [ $this->instance, 'render_user_profile' ], 12 );

		Monkey\Actions\expectAdded( 'admin_enqueue_scripts' )
			->once()
			->with( [ $this->instance, 'enqueue_assets' ], 11 );

		$this->instance->register_hooks();
	}

	/**
	 * Tests enqueuing the assets.
	 *
	 * @covers ::enqueue_assets
	 *
	 * @return void
	 */
	public function test_enqueue_assets() {
		// Current user ID is used for the consent and embed permission.
		$user_id = 1;
		$this->user_helper->expects( 'get_current_user_id' )->once()->withNoArgs()->andReturn( $user_id );
		// Has consent.
		$this->user_helper->expects( 'get_meta' )
			->once()
			->with( $user_id, '_yoast_wpseo_ai_consent', true )
			->andReturn( true );
		// Plugin URL.
		Monkey\Functions\expect( 'plugins_url' )
			->once()
			->andReturn( 'https://example.com/wp-content/plugins/wordpress-seo' );

		// Enqueueing.

		/*
		Monkey\Functions\expect( 'wp_enqueue_script' )->once()->with( 'ai-consent' );
		Monkey\Functions\expect( 'wp_localize_script' )->once()->with(
			'ai-consent',
			'wpseoAiConsent',
			[
				'hasConsent' => true,
				'pluginUrl'  => 'https://example.com/wp-content/plugins/wordpress-seo',
				'linkParams' => '',
			]
		);
		*/
		$this->asset_manager->expects( 'enqueue_style' )->once()->with( 'ai-generator' );
		$this->asset_manager->expects( 'enqueue_script' )->once();
		$this->asset_manager->expects( 'localize_script' )->once();

		/*
		Monkey\Functions\expect( 'get_user_locale' )->once()->withNoArgs()->andReturn( 'en_US' );
		Monkey\Functions\expect( 'plugin_dir_path' )
			->once()
			->andReturn( '/invalid/path/to/plugin/' );
		Monkey\Functions\expect( 'wp_localize_script' )->once()->with(
			'ai-consent',
			'wpseoAiConsent',
			[
				// Null because the file does not exist.
				'wordpress-seo-premium' => null,
			]
		);
		*/

		$this->short_link_helper->expects( 'get_query_params' )->andReturn( [] );

		$this->instance->enqueue_assets();
	}

	/**
	 * Tests rendering the user profile.
	 *
	 * @covers ::render_user_profile
	 *
	 * @return void
	 */
	public function test_render_user_profile() {
		$this->stubTranslationFunctions();

		$this->expectOutputString( '<label for="ai-generator-consent-button">AI features</label><div id="ai-generator-consent" style="display:inline-block; margin-top: 28px; padding-left:5px;"></div>' );

		$this->instance->render_user_profile();
	}
}
