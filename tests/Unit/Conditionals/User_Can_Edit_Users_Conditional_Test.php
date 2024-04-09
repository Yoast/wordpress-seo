<?php

namespace Yoast\WP\SEO\Tests\Unit\Conditionals;

use Brain\Monkey;
use Yoast\WP\SEO\Conditionals\User_Can_Edit_Users_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class User_Can_Edit_Users_Conditional_Test.
 *
 * @group conditionals
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\User_Can_Edit_Users_Conditional
 */
final class User_Can_Edit_Users_Conditional_Test extends TestCase {

	/**
	 * The user edit conditional.
	 *
	 * @var User_Can_Edit_Users_Conditional
	 */
	private $instance;

	/**
	 * Does the setup for testing.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->instance = new User_Can_Edit_Users_Conditional();
	}

	/**
	 * Tests that the conditional is not met when user can't edit users.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_is_not_met() {
		Monkey\Functions\expect( 'current_user_can' )
			->once()
			->with( 'edit_users' )
			->andReturn( false );

		$this->assertSame( false, $this->instance->is_met() );
	}

	/**
	 * Tests that the conditional is met when user can edit users.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_is_met() {
		Monkey\Functions\expect( 'current_user_can' )
			->once()
			->with( 'edit_users' )
			->andReturn( true );

		$this->assertSame( true, $this->instance->is_met() );
	}
}
