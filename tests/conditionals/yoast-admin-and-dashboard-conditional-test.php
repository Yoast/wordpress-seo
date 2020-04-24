<?php

namespace Yoast\WP\SEO\Tests\Conditionals;

use Yoast\WP\SEO\Conditionals\Yoast_Admin_And_Dashboard_Conditional;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Yoast_Admin_And_Dashboard_Conditional_Test
 *
 * @group indexables
 * @group conditionals
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\Yoast_Admin_And_Dashboard_Conditional
 */
class Yoast_Admin_And_Dashboard_Conditional_Test extends TestCase {

	/**
	 * Holds the Yoast admin and dashboard conditional under test.
	 *
	 * @var Yoast_Admin_And_Dashboard_Conditional
	 */
	private $instance;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		$this->instance = new Yoast_Admin_And_Dashboard_Conditional();
	}

	/**
	 * Tests that the conditional is met when on a Yoast admin page.
	 *
	 * @covers ::is_met
	 */
	public function test_is_met_on_yoast_admin_page() {
		// We are on an admin page.
		global $pagenow;
		$pagenow = 'admin.php';

		// Specifically, we are on the wpseo_dashboard page.
		$_GET['page'] = 'wpseo_dashboard';

		$is_met = $this->instance->is_met();

		$this->assertEquals( true, $is_met );
	}

	/**
	 * Tests that the conditional is met when on the update core admin page.
	 *
	 * @covers ::is_met
	 */
	public function test_is_met_on_update_core_page() {
		// We are on the update core page.
		global $pagenow;
		$pagenow = 'update-core.php';

		$is_met = $this->instance->is_met();

		$this->assertEquals( true, $is_met );
	}

	/**
	 * Tests that the conditional is met when on the plugins admin page.
	 *
	 * @covers ::is_met
	 */
	public function test_is_met_on_plugins_page() {
		// We are on the plugins page.
		global $pagenow;
		$pagenow = 'plugins.php';

		$is_met = $this->instance->is_met();

		$this->assertEquals( true, $is_met );
	}

	/**
	 * Tests that the conditional is met when on the WordPress dashboard.
	 *
	 * @covers ::is_met
	 */
	public function test_is_met_on_index_page() {
		// We are on the WordPress dashboard.
		global $pagenow;
		$pagenow = 'index.php';

		$is_met = $this->instance->is_met();

		$this->assertEquals( true, $is_met );
	}

	/**
	 * Tests that the conditional is met when on the update core admin page.
	 *
	 * @covers ::is_met
	 */
	public function test_is_not_met_on_non_admin_page() {
		// We are on the update core page.
		global $pagenow;
		$pagenow = 'some-other-page.php';

		$is_met = $this->instance->is_met();

		$this->assertEquals( false, $is_met );
	}

	/**
	 * Tests that the conditional is met when on the update core admin page.
	 *
	 * @covers ::is_met
	 */
	public function test_is_not_met_on_yoast_admin_page() {
		// We are on an admin page.
		global $pagenow;
		$pagenow = 'admin.php';

		// But not on a Yoast admin page.
		$_GET['page'] = 'other-page';

		$is_met = $this->instance->is_met();

		$this->assertEquals( false, $is_met );
	}
}
