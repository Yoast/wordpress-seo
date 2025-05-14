<?php

namespace Yoast\WP\SEO\Tests\Unit\Introductions\Application;

use Mockery;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Introductions\Application\Ai_Fix_Assessments_Upsell;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the AI fix assessments introduction upsell.
 *
 * @group introductions
 *
 * @coversDefaultClass \Yoast\WP\SEO\Introductions\Application\Ai_Fix_Assessments_Upsell
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Ai_Fix_Assessments_Upsell_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Ai_Fix_Assessments_Upsell
	 */
	private $instance;

	/**
	 * Holds the product helper.
	 *
	 * @var Mockery\MockInterface|Product_Helper
	 */
	private $product_helper;

	/**
	 * Holds the user helper.
	 *
	 * @var Mockery\MockInterface|User_Helper
	 */
	private $user_helper;

	/**
	 * Holds the options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options_helper;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->user_helper    = Mockery::mock( User_Helper::class );
		$this->product_helper = Mockery::mock( Product_Helper::class );

		$this->instance = new Ai_Fix_Assessments_Upsell( $this->user_helper, $this->product_helper );
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Product_Helper::class,
			$this->getPropertyValue( $this->instance, 'product_helper' )
		);
		$this->assertInstanceOf(
			User_Helper::class,
			$this->getPropertyValue( $this->instance, 'user_helper' )
		);
	}

	/**
	 * Tests getting the ID.
	 *
	 * @covers ::get_id
	 *
	 * @return void
	 */
	public function test_get_name() {
		$this->assertSame( 'ai-fix-assessments-upsell', $this->instance->get_id() );
	}

	/**
	 * Tests getting the priority.
	 *
	 * @covers ::get_priority
	 *
	 * @return void
	 */
	public function test_get_priority() {
		$this->assertSame( 10, $this->instance->get_priority() );
	}
}
