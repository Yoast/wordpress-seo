<?php

namespace Yoast\WP\SEO\Tests\Unit\Conditionals;

use Brain\Monkey\Functions;
use Yoast\WP\SEO\Conditionals\Posts_Overview_Or_Ajax_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Posts_Overview_Or_Ajax_Conditional_Test.
 *
 * @group conditionals
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\Posts_Overview_Or_Ajax_Conditional
 */
class Posts_Overview_Or_Ajax_Conditional_Test extends TestCase {

	/**
	 * The breadcrumbs enabled conditional.
	 *
	 * @var Posts_Overview_Or_Ajax_Conditional
	 */
	private $instance;

	/**
	 * Does the setup for testing.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new Posts_Overview_Or_Ajax_Conditional();
	}

	/**
	 * Tests that the conditional is not met when pagenow is not edit.php
	 * and wp_doing_ajax returns false.
	 *
	 * @covers ::is_met
	 */
	public function test_is_not_met() {
		global $pagenow;
		$pagenow = 'not-edit.php';

		Functions\expect( 'wp_doing_ajax' )->once()->andReturn( false );

		$this->assertEquals( false, $this->instance->is_met() );
	}

	/**
	 * Tests that the conditional is met when pagenow is edit.php.
	 *
	 * @covers ::is_met
	 */
	public function test_is_met() {
		global $pagenow;
		$pagenow = 'edit.php';

		$this->assertEquals( true, $this->instance->is_met() );
	}

	/**
	 * Tests that the conditional is met when wp_doing_ajax returns true.
	 *
	 * @covers ::is_met
	 */
	public function test_is_met_ajax() {
		global $pagenow;
		$pagenow = 'not-edit.php';

		Functions\expect( 'wp_doing_ajax' )->once()->andReturn( true );

		$this->assertEquals( true, $this->instance->is_met() );
	}
}
