<?php

namespace Yoast\WP\SEO\Tests\Unit\Conditionals;

use Yoast\WP\SEO\Conditionals\Deactivating_Yoast_Seo_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Deactivating_Yoast_Seo_Conditional_Test.
 *
 * @group conditionals
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\Deactivating_Yoast_Seo_Conditional
 */
final class Deactivating_Yoast_Seo_Conditional_Test extends TestCase {

	/**
	 * Holds the conditional that checks whether Yoast SEO is being deactivated.
	 *
	 * @var Deactivating_Yoast_Seo_Conditional
	 */
	private $instance;

	/**
	 * Sets up the tests.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();
		$_GET['action'] = 'deactivate';
		$_GET['plugin'] = 'wordpress-seo/wp-seo.php';

		$this->instance = new Deactivating_Yoast_Seo_Conditional();
	}

	/**
	 * Tests that the conditional is not met when the GET var doesn't contain an action.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_is_not_met_when_no_action() {
		unset( $_GET['action'] );

		$this->assertFalse( $this->instance->is_met() );
	}

	/**
	 * Tests that the conditional is not met when the GET var doesn't contain a 'deactivate' action.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_is_not_met_when_no_deactivate_action() {
		$_GET['action'] = 'not deactivate';

		$this->assertFalse( $this->instance->is_met() );
	}

	/**
	 * Tests that the conditional is not met when the GET var doesn't contain a plugin.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_is_not_met_when_no_plugin() {
		unset( $_GET['plugin'] );

		$this->assertFalse( $this->instance->is_met() );
	}

	/**
	 * Tests that the conditional is not met when the GET var doesn't contain a yoast seo plugin.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_is_not_met_when_no_yoast_seo_plugin() {
		$_GET['plugin'] = 'not wordpress-seo/wp-seo.php';

		$this->assertFalse( $this->instance->is_met() );
	}

	/**
	 * Tests that the conditional is met when the Yoast SEO plugin is getting deactivated.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_is_met_when_deactivate_action_and_yoast_seo_plugin() {
		$this->assertTrue( $this->instance->is_met() );
	}
}
