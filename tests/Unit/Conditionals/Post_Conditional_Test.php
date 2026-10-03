<?php

namespace Yoast\WP\SEO\Tests\Unit\Conditionals;

use Yoast\WP\SEO\Conditionals\Admin\Post_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Post_Conditional_Test.
 *
 * @group conditionals
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\Admin\Post_Conditional
 */
final class Post_Conditional_Test extends TestCase {

	/**
	 * The breadcrumbs enabled conditional.
	 *
	 * @var Web_Stories_Conditional
	 */
	private $instance;

	/**
	 * Does the setup for testing.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->instance = new Post_Conditional();
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

		$this->assertEquals( false, $this->instance->is_met() );
	}

	/**
	 * Tests that the conditional is not met when the $pagenow global does not exist.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_is_met_for_new_post() {
		// We are on an admin page.
		global $pagenow;
		$pagenow = 'post-new.php';

		$this->assertEquals( true, $this->instance->is_met() );
	}

	/**
	 * Tests that the conditional is met when the $pagenow global exists, and is a new post.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_is_met_for_edit_post() {
		// We are on an admin page.
		global $pagenow;
		$pagenow = 'post.php';

		$this->assertEquals( true, $this->instance->is_met() );
	}
}
