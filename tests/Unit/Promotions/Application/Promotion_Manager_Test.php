<?php

namespace Yoast\WP\SEO\Tests\Unit\Promotions\Application;

use Yoast\WP\SEO\Promotions\Application\Promotion_Manager;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Promotion_Manager_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Promotions\Application\Promotion_Manager
 */
final class Promotion_Manager_Test extends TestCase {

	/**
	 * Represents the class to test.
	 *
	 * @var Promotion_Manager
	 */
	protected $instance;

	/**
	 * Setup the tests.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();
		$this->instance = new Promotion_Manager( new Fake_Promotion(), new Fake_Expired_Promotion() );
	}

	/**
	 * Tests the is function which tests if a promotion is currently active.
	 *
	 * @covers ::is
	 *
	 * @return void
	 */
	public function test_is() {
		$this->assertTrue( $this->instance->is( 'fake_promotion' ) );
		$this->assertFalse( $this->instance->is( 'non_existent_promotion' ) );
		$this->assertFalse( $this->instance->is( 'fake_expired_promotion' ) );
	}

	/**
	 * Tests the get_promotions_list function which returns the list of promotions.
	 *
	 * @covers ::get_promotions_list
	 *
	 * @return void
	 */
	public function test_get_promotions_list() {
		$this->assertCount( 2, $this->instance->get_promotions_list() );
		$this->assertEquals( $this->instance->get_promotions_list()[0]->get_promotion_name(), 'fake_promotion' );
	}

	/**
	 * Tests the get_current_promotions function which returns the list of active promotions.
	 *
	 * @covers ::get_current_promotions
	 *
	 * @return void
	 */
	public function test_get_current_promotions() {
		$this->assertCount( 1, $this->instance->get_current_promotions() );
		$this->assertEquals( $this->instance->get_current_promotions()[0], 'fake_promotion' );
	}
}
