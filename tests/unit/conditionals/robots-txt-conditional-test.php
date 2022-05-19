<?php

namespace Yoast\WP\SEO\Tests\Unit\Conditionals;

use Mockery;
use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Conditionals\Robots_Txt_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Robots_Txt_Conditional class.
 *
 * @group conditionals
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\Robots_Txt_Conditional
 */
class Robots_Txt_Conditional_Test extends TestCase {

	/**
	 * Holds the Front_End_Conditional instance.
	 *
	 * @var Mockery\MockInterface|Front_End_Conditional
	 */
	protected $front_end_conditional;

	/**
	 * Holds the instance to test.
	 *
	 * @var Robots_Txt_Conditional
	 */
	protected $instance;

	/**
	 * Does the setup for testing.
	 */
	public function set_up() {
		parent::set_up();

		$this->front_end_conditional = Mockery::mock( Front_End_Conditional::class );

		$this->instance = new Robots_Txt_Conditional( $this->front_end_conditional );
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->assertInstanceOf( Robots_Txt_Conditional::class, $this->instance );
		$this->assertInstanceOf(
			Front_End_Conditional::class,
			$this->getPropertyValue( $this->instance, 'front_end_conditional' )
		);
	}

	/**
	 * Tests that the conditional is met when the front end conditional is met.
	 *
	 * @covers ::is_met
	 */
	public function test_is_met_front_end() {
		$this->front_end_conditional
			->expects( 'is_met' )
			->once()
			->andReturnTrue();

		$this->assertTrue( $this->instance->is_met() );
	}

	/**
	 * Tests that the conditional is met when not on the file editor page.
	 *
	 * @covers ::is_met
	 */
	public function test_is_met() {
		global $pagenow;

		$this->front_end_conditional
			->expects( 'is_met' )
			->once()
			->andReturnFalse();

		$pagenow      = 'admin.php';
		$_GET['page'] = 'wpseo_tools';
		$_GET['tool'] = 'file-editor';

		$this->assertTrue( $this->instance->is_met() );
	}

	/**
	 * Tests that the conditional is not met when on another tool page.
	 *
	 * @covers ::is_met
	 */
	public function test_is_not_met_other_tool_page() {
		global $pagenow;

		$this->front_end_conditional
			->expects( 'is_met' )
			->once()
			->andReturnFalse();

		$pagenow      = 'admin.php';
		$_GET['page'] = 'wpseo_tools';
		$_GET['tool'] = 'import-export';

		$this->assertFalse( $this->instance->is_met() );
	}

	/**
	 * Tests that the conditional is not met when on another Yoast page.
	 *
	 * @covers ::is_met
	 */
	public function test_is_not_met_other_yoast_page() {
		global $pagenow;

		$this->front_end_conditional
			->expects( 'is_met' )
			->once()
			->andReturnFalse();

		$pagenow      = 'admin.php';
		$_GET['page'] = 'wpseo_dashboard';

		$this->assertFalse( $this->instance->is_met() );
	}

	/**
	 * Tests that the conditional is not met when on another page.
	 *
	 * @covers ::is_met
	 */
	public function test_is_not_met_other_page() {
		global $pagenow;

		$this->front_end_conditional
			->expects( 'is_met' )
			->once()
			->andReturnFalse();

		$pagenow = 'plugins.php';

		$this->assertFalse( $this->instance->is_met() );
	}
}
