<?php

namespace Yoast\WP\SEO\Tests\Unit\Conditionals;

use Yoast\WP\SEO\Conditionals\Import_Tool_Selected_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Import_Tool_Selected_Conditional_Test.
 *
 * @group indexables
 * @group conditionals
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\Import_Tool_Selected_Conditional
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Import_Tool_Selected_Conditional_Test extends TestCase {

	/**
	 * Holds the conditional that checks whether the import tool is selected.
	 *
	 * @var Import_Tool_Selected_Conditional
	 */
	private $instance;

	/**
	 * Sets up the tests.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Import_Tool_Selected_Conditional();
	}

	/**
	 * Tests that the conditional is not met when on the main Yoast admin tools page.
	 *
	 * @covers ::is_met
	 */
	public function test_is_not_met_on_yoast_admin_tools_page() {
		$_GET['page'] = 'wpseo_tools';

		$this->assertFalse( $this->instance->is_met() );
	}

	/**
	 * Tests that the conditional is met when on the import tool page.
	 *
	 * @covers ::is_met
	 */
	public function test_is_met_on_specific_tools_page() {
		$_GET['tool'] = 'import-export';

		$this->assertTrue( $this->instance->is_met() );
	}
}
