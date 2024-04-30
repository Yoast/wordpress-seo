<?php

namespace Yoast\WP\SEO\Tests\Unit\Conditionals;

use Yoast\WP\SEO\Conditionals\User_Edit_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class User_Edit_Conditional_Test.
 *
 * @group conditionals
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\User_Edit_Conditional
 */
final class User_Edit_Conditional_Test extends TestCase {

	/**
	 * The user edit conditional.
	 *
	 * @var User_Edit_Conditional
	 */
	private $instance;

	/**
	 * Does the setup for testing.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->instance = new User_Edit_Conditional();
	}

	/**
	 * Tests that the conditional is not met when we are on admin pages.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_is_not_met_for_admin_pages() {
		// We are on an admin page.
		global $pagenow;
		$pagenow = 'admin.php';

		$this->assertSame( false, $this->instance->is_met() );
	}

	/**
	 * Tests that the conditional is met when the $pagenow global exists, and is the Edit User page.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_is_met_for_edit_user() {
		// We are on the Edit User page.
		global $pagenow;
		$pagenow = 'user-edit.php';

		$this->assertSame( true, $this->instance->is_met() );
	}

	/**
	 * Tests that the conditional is met when the $pagenow global exists, and is the User's profile page.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_is_met_for_user_profile() {
		// We are on the User's profile page.
		global $pagenow;
		$pagenow = 'profile.php';

		$this->assertSame( true, $this->instance->is_met() );
	}
}
