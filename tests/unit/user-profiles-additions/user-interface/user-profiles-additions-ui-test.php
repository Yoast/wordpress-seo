<?php

namespace Yoast\WP\SEO\Tests\Unit\User_Profiles_additions\User_Interface;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\User_Profile_Conditional;
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
class User_Profiles_Additions_Ui_Test extends TestCase {

	/**
	 * The User_Profiles_Additions_Ui.
	 *
	 * @var User_Profiles_Additions_Ui
	 */
	protected $instance;

	/**
	 * Set up the test.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new User_Profiles_Additions_Ui();
	}

	/**
	 * Tests the retrieval of the conditionals.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		static::assertEquals(
			[ User_Profile_Conditional::class ],
			User_Profiles_Additions_Ui::get_conditionals()
		);
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
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
	 */
	public function test_add_hook_to_user_profile() {

		$user = Mockery::mock( \WP_User::class );

		Monkey\Actions\expectDone( 'wpseo_user_profile_additions' )
			->once()
			->with( $user );

		$this->instance->add_hook_to_user_profile( $user );

		$this->expectOutputContains( '<div class="yoast yoast-settings">' );
		$this->expectOutputContains( '</div>' );
	}
}
