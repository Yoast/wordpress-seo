<?php // phpcs:ignore Yoast.Files.FileName.InvalidClassFileName -- Reason: this explicitly concerns the Yoast admin and dashboard.

namespace Yoast\WP\SEO\Tests\Unit\Conditionals;

use Brain\Monkey;
use Yoast\WP\SEO\Conditionals\Yoast_Admin_And_Dashboard_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;

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
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

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

		Monkey\Functions\expect( 'wp_installing' )
			->andReturn( false );

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

		Monkey\Functions\expect( 'wp_installing' )
			->andReturn( false );

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

		Monkey\Functions\expect( 'wp_installing' )
			->andReturn( false );

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

		Monkey\Functions\expect( 'wp_installing' )
			->andReturn( false );

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

		Monkey\Functions\expect( 'wp_installing' )
			->andReturn( false );

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

		Monkey\Functions\expect( 'wp_installing' )
			->andReturn( false );

		// But not on a Yoast admin page.
		$_GET['page'] = 'other-page';

		$is_met = $this->instance->is_met();

		$this->assertEquals( false, $is_met );
	}

	/**
	 * Tests that the conditional is not met when WordPress is currently installing.
	 *
	 * @covers ::is_met
	 */
	public function test_is_not_met_when_wordpress_is_installing() {
		// We are on an admin page.
		global $pagenow;
		$pagenow = 'admin.php';

		// But WordPress is currently installing.
		Monkey\Functions\expect( 'wp_installing' )
			->andReturn( true );

		$is_met = $this->instance->is_met();

		$this->assertEquals( false, $is_met );
	}

	/**
	 * Tests that the conditional is not met when on the plugin upgrade page.
	 *
	 * @covers ::is_met
	 * @covers ::on_upgrade_page
	 */
	public function test_is_not_met_on_plugin_upgrade_page() {
		// We are on an admin page.
		global $pagenow;
		$pagenow = 'admin.php';

		// But WordPress is currently installing.
		Monkey\Functions\expect( 'wp_installing' )
			->andReturn( false );

		$_GET['action'] = 'do-plugin-upgrade';

		$is_met = $this->instance->is_met();

		$this->assertEquals( false, $is_met );
	}

	/**
	 * Tests that the conditional is not met when on the theme upgrade page.
	 *
	 * @covers ::is_met
	 * @covers ::on_upgrade_page
	 */
	public function test_is_not_met_on_theme_upgrade_page() {
		// We are on an admin page.
		global $pagenow;
		$pagenow = 'admin.php';

		// But WordPress is currently installing.
		Monkey\Functions\expect( 'wp_installing' )
			->andReturn( false );

		$_GET['action'] = 'do-theme-upgrade';

		$is_met = $this->instance->is_met();

		$this->assertEquals( false, $is_met );
	}

	/**
	 * Tests that the conditional is not met when on the WordPress upgrade page.
	 *
	 * @covers ::is_met
	 * @covers ::on_upgrade_page
	 */
	public function test_is_not_met_on_wordpress_upgrade_page() {
		// We are on an admin page.
		global $pagenow;
		$pagenow = 'admin.php';

		// But WordPress is currently installing.
		Monkey\Functions\expect( 'wp_installing' )
			->andReturn( false );

		$_GET['action'] = 'do-core-upgrade';

		$is_met = $this->instance->is_met();

		$this->assertEquals( false, $is_met );
	}

	/**
	 * Tests that the conditional is not met when on the WordPress reinstall page.
	 *
	 * @covers ::is_met
	 * @covers ::on_upgrade_page
	 */
	public function test_is_not_met_on_wordpress_reinstall_page() {
		// We are on an admin page.
		global $pagenow;
		$pagenow = 'admin.php';

		// But WordPress is currently installing.
		Monkey\Functions\expect( 'wp_installing' )
			->andReturn( false );

		$_GET['action'] = 'do-core-reinstall';

		$is_met = $this->instance->is_met();

		$this->assertEquals( false, $is_met );
	}
}
