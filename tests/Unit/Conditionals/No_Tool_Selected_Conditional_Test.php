<?php

namespace Yoast\WP\SEO\Tests\Unit\Conditionals;

use Yoast\WP\SEO\Conditionals\No_Tool_Selected_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class No_Tool_Selected_Conditional_Test.
 *
 * @group indexables
 * @group conditionals
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\No_Tool_Selected_Conditional
 */
final class No_Tool_Selected_Conditional_Test extends TestCase {

	/**
	 * Holds the conditional that checks whether no specific tool is selected.
	 *
	 * @var No_Tool_Selected_Conditional
	 */
	private $instance;

	/**
	 * Sets up the tests.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new No_Tool_Selected_Conditional();
	}

	/**
	 * Tests that the conditional is met when on the main Yoast admin tools page.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_is_met_on_yoast_admin_tools_page() {
		$_GET['page'] = 'wpseo_tools';

		$this->assertTrue( $this->instance->is_met() );
	}

	/**
	 * Tests that the conditional is not met when on a specific tool page.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_is_not_met_on_specific_tools_page() {
		$_GET['tool'] = 'import-export';

		$this->assertFalse( $this->instance->is_met() );
	}
}
