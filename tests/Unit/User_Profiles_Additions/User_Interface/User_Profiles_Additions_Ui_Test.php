<?php

namespace Yoast\WP\SEO\Tests\Unit\User_Profiles_Additions\User_Interface;

use Brain\Monkey;
use Mockery;
use WP_User;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\User_Profile_Conditional;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\User_Profiles_Additions\User_Interface\User_Profiles_Additions_Ui;

/**
 * Tests the User_Profiles_Additions_Ui class.
 *
 * @group user-profiles-additions
 * @coversDefaultClass \Yoast\WP\SEO\User_Profiles_Additions\User_Interface\User_Profiles_Additions_Ui
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class User_Profiles_Additions_Ui_Test extends TestCase {

	/**
	 * The mocked asset manager.
	 *
	 * @var Mockery\MockInterface|WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * The mocked asset product helper.
	 *
	 * @var Mockery\MockInterface|Product_Helper
	 */
	protected $product_helper;

	/**
	 * The User_Profiles_Additions_Ui.
	 *
	 * @var User_Profiles_Additions_Ui
	 */
	protected $instance;

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();
		$this->asset_manager  = Mockery::mock( 'WPSEO_Admin_Asset_Manager' );
		$this->product_helper = Mockery::mock( 'Yoast\WP\SEO\Helpers\Product_Helper' );

		$this->instance = new User_Profiles_Additions_Ui( $this->asset_manager, $this->product_helper );
	}

	/**
	 * Test construct method.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_construct() {
		$this->assertInstanceOf(
			WPSEO_Admin_Asset_Manager::class,
			$this->getPropertyValue( $this->instance, 'asset_manager' )
		);
		$this->assertInstanceOf(
			Product_Helper::class,
			$this->getPropertyValue( $this->instance, 'product_helper' )
		);
	}

	/**
	 * Tests the retrieval of the conditionals.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ User_Profile_Conditional::class ],
			User_Profiles_Additions_Ui::get_conditionals()
		);
	}

	/**
	 * Test enqueue_assets method.
	 *
	 * @covers ::enqueue_assets
	 *
	 * @return void
	 */
	public function test_enqueue_assets() {

		$this->product_helper
			->expects( 'is_premium' )
			->once()
			->andReturn( true );

		$this->asset_manager
			->expects( 'enqueue_style' )
			->with( 'introductions' )
			->once();

		$this->instance->enqueue_assets();
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( \has_action( 'show_user_profile', [ $this->instance, 'add_hook_to_user_profile' ] ), 'Does not have expected show_user_profile action' );
		$this->assertNotFalse( \has_action( 'edit_user_profile', [ $this->instance, 'add_hook_to_user_profile' ] ), 'Does not have expected edit_user_profile action' );
	}

	/**
	 * Tests the `add_hook_to_user_profile` method.
	 *
	 * @covers ::add_hook_to_user_profile
	 *
	 * @return void
	 */
	public function test_add_hook_to_user_profile() {

		$user = Mockery::mock( WP_User::class );

		$this->product_helper
			->expects( 'is_premium' )
			->once()
			->andReturn( false );

		Monkey\Actions\expectDone( 'wpseo_user_profile_additions' )
			->once()
			->with( $user );

		$this->instance->add_hook_to_user_profile( $user );

		$this->expectOutputContains( '<div class="yoast yoast-settings">' );
		$this->expectOutputContains( '</div>' );
	}
}
