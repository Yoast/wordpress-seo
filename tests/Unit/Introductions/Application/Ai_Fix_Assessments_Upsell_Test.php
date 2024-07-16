<?php

namespace Yoast\WP\SEO\Tests\Unit\Introductions\Application;

use Brain\Monkey\Functions;
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

	/**
	 * Tests should show.
	 *
	 * @covers ::should_show
	 *
	 * @dataProvider should_show_data
	 *
	 * @param bool $is_premium            Whether Premium is active.
	 * @param int  $current_user_id       The current user id.
	 * @param int  $current_user_id_times The amount of times for expectations. Instead of adding logic to the tests.
	 * @param bool $user_can_edit_posts   Whether the user can edit posts.
	 * @param int  $user_can_edit_times   The amount of times for expectations. Instead of adding logic to the tests.
	 * @param bool $expected              The expected result (whether the introduction should show).
	 *
	 * @return void
	 */
	public function test_should_show(
		$is_premium,
		$current_user_id,
		$current_user_id_times,
		$user_can_edit_posts,
		$user_can_edit_times,
		$expected
	) {
		// Don't show when Premium is active.
		$this->product_helper->expects( 'is_premium' )->once()->withNoArgs()->andReturn( $is_premium );

		$this->user_helper->expects( 'get_current_user_id' )->times( $current_user_id_times )->withNoArgs()->andReturn( $current_user_id );

		// Don't show when user is not allowed to edit posts.
		Functions\expect( 'current_user_can' )
			->times( $user_can_edit_times )
			->with( 'edit_posts' )
			->andReturn( $user_can_edit_posts );

		$this->assertSame( $expected, $this->instance->should_show() );
	}

	/**
	 * Provides data for the `test_should_show()` test.
	 * phpcs:disable SlevomatCodingStandard.TypeHints.ReturnTypeHint.MissingTraversableTypeHintSpecification
	 *
	 * @return array
	 */
	public static function should_show_data() {
		return [
			'showing'                                 => [
				'is_premium'            => false,
				'current_user_id'       => 1,
				'current_user_id_times' => 1,
				'user_can_edit_posts'   => true,
				'user_can_edit_times'   => 1,
				'expected'              => true,
			],
			'do not show when premium is active'      => [
				'is_premium'            => true,
				'current_user_id'       => 1,
				'current_user_id_times' => 0,
				'user_can_edit_posts'   => true,
				'user_can_edit_times'   => 0,
				'expected'              => false,
			],
			'do not show when user cannot edit posts' => [
				'is_premium'            => false,
				'current_user_id'       => 1,
				'current_user_id_times' => 1,
				'user_can_edit_posts'   => false,
				'user_can_edit_times'   => 1,
				'expected'              => false,
			],
		];
	}
}
