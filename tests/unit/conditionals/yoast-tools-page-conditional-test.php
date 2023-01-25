<?php // phpcs:ignore Yoast.Files.FileName.InvalidClassFileName -- Reason: this explicitly concerns the Yoast tools page.

namespace Yoast\WP\SEO\Tests\Unit\Conditionals;

use Yoast\WP\SEO\Conditionals\Yoast_Tools_Page_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Yoast_Admin_Tools_Page_Conditional_Test.
 *
 * @group indexables
 * @group conditionals
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\Yoast_Tools_Page_Conditional
 */
class Yoast_Admin_Tools_Page_Conditional_Test extends TestCase {

	/**
	 * Holds the Yoast admin tools page conditional.
	 *
	 * @var Yoast_Tools_Page_Conditional
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Yoast_Tools_Page_Conditional();
	}

	/**
	 * Tests that the conditional is met when on the Yoast admin tools page.
	 *
	 * @covers ::is_met
	 */
	public function test_is_met_on_yoast_admin_tools_page() {
		// We are on an admin page.
		global $pagenow;
		$pagenow = 'admin.php';

		// Specifically, we are on the wpseo_tools page.
		$_GET['page'] = 'wpseo_tools';

		$this->assertTrue( $this->instance->is_met() );
	}

	/**
	 * Tests that the conditional is not met when on the Yoast admin dashboard page.
	 *
	 * @covers ::is_met
	 */
	public function test_is_not_met_on_yoast_admin_dashboard_page() {
		// We are on an admin page.
		global $pagenow;
		$pagenow = 'admin.php';

		// Specifically, we are on the wpseo_dashboard page.
		$_GET['page'] = 'wpseo_dashboard';

		$this->assertFalse( $this->instance->is_met() );
	}

	/**
	 * Tests that the conditional is not met when on a frontend page.
	 *
	 * @covers ::is_met
	 */
	public function test_is_not_met_on_frontend_page() {
		// We are on the frontend.
		global $pagenow;
		$pagenow = 'index.php';

		$this->assertFalse( $this->instance->is_met() );
	}
}
