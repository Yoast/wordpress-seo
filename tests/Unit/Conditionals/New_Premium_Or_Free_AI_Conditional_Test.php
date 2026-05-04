<?php

namespace Yoast\WP\SEO\Tests\Unit\Conditionals;

use Mockery;
use Yoast\WP\SEO\Conditionals\New_Premium_Or_Free_AI_Conditional;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class New_Premium_Or_Free_AI_Conditional_Test.
 *
 * @group conditionals
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\New_Premium_Or_Free_AI_Conditional
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class New_Premium_Or_Free_AI_Conditional_Test extends TestCase {

	/**
	 * Holds the Product_Helper.
	 *
	 * @var Mockery\MockInterface|Product_Helper
	 */
	private $product_helper;

	/**
	 * The instance under test.
	 *
	 * @var New_Premium_Or_Free_AI_Conditional
	 */
	private $instance;

	/**
	 * Sets up the test.
	 *
	 * @return void
	 */
	protected function set_up(): void {
		parent::set_up();
		$this->product_helper = Mockery::mock( Product_Helper::class );
		$this->instance       = new New_Premium_Or_Free_AI_Conditional( $this->product_helper );
	}

	/**
	 * Tests that the conditional is met when Premium is not installed.
	 *
	 * @covers ::__construct
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_is_met_without_premium(): void {
		$this->product_helper->expects( 'is_premium' )->once()->andReturnFalse();

		$this->assertTrue( $this->instance->is_met() );
	}

	/**
	 * Tests that the conditional is met when Premium is active but the version is not exposed.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_is_met_when_premium_version_is_null(): void {
		$this->product_helper->expects( 'is_premium' )->once()->andReturnTrue();
		$this->product_helper->expects( 'get_premium_version' )->once()->andReturnNull();

		$this->assertTrue( $this->instance->is_met() );
	}

	/**
	 * Tests that the conditional is not met for legacy Premium versions.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_is_not_met_for_legacy_premium(): void {
		$this->product_helper->expects( 'is_premium' )->once()->andReturnTrue();
		$this->product_helper->expects( 'get_premium_version' )->once()->andReturn( '27.4' );

		$this->assertFalse( $this->instance->is_met() );
	}

	/**
	 * Tests that the conditional is met starting from the AI restructure version.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_is_met_at_cutoff_version(): void {
		$this->product_helper->expects( 'is_premium' )->once()->andReturnTrue();
		$this->product_helper->expects( 'get_premium_version' )->once()->andReturn( '27.5-RC0' );

		$this->assertTrue( $this->instance->is_met() );
	}

	/**
	 * Tests that the conditional is met for Premium versions newer than the cutoff.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_is_met_for_modern_premium(): void {
		$this->product_helper->expects( 'is_premium' )->once()->andReturnTrue();
		$this->product_helper->expects( 'get_premium_version' )->once()->andReturn( '27.6' );

		$this->assertTrue( $this->instance->is_met() );
	}
}
