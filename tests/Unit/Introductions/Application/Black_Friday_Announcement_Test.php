<?php

namespace Yoast\WP\SEO\Tests\Unit\Introductions\Application;

use Mockery;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Introductions\Application\Black_Friday_Announcement;
use Yoast\WP\SEO\Promotions\Application\Promotion_Manager;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Black Friday announcement.
 *
 * @group introductions
 *
 * @coversDefaultClass \Yoast\WP\SEO\Introductions\Application\Black_Friday_Announcement
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Black_Friday_Announcement_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Black_Friday_Announcement
	 */
	private $instance;

	/**
	 * Holds the current page helper.
	 *
	 * @var Mockery\MockInterface|Current_Page_Helper
	 */
	private $current_page_helper;

	/**
	 * Holds the promotion manager.
	 *
	 * @var Mockery\MockInterface|Promotion_Manager
	 */
	private $promotion_manager;

	/**
	 * Holds the product helper.
	 *
	 * @var Mockery\MockInterface|Product_Helper
	 */
	private $product_helper;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->current_page_helper = Mockery::mock( Current_Page_Helper::class );
		$this->promotion_manager   = Mockery::mock( Promotion_Manager::class );
		$this->product_helper      = Mockery::mock( Product_Helper::class );

		$this->instance = new Black_Friday_Announcement(
			$this->current_page_helper,
			$this->promotion_manager,
			$this->product_helper
		);
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
			Current_Page_Helper::class,
			$this->getPropertyValue( $this->instance, 'current_page_helper' )
		);
		$this->assertInstanceOf(
			Promotion_Manager::class,
			$this->getPropertyValue( $this->instance, 'promotion_manager' )
		);
		$this->assertInstanceOf(
			Product_Helper::class,
			$this->getPropertyValue( $this->instance, 'product_helper' )
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
		$this->assertSame( 'black-friday-announcement', $this->instance->get_id() );
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
	 * Tests the conditional `should_show`.
	 *
	 * @covers ::should_show
	 *
	 * @dataProvider should_show_data
	 *
	 * @param bool $is_yoast_seo_page               Whether on a Yoast SEO page.
	 * @param bool $is_premium                      Whether Premium is installed.
	 * @param int  $is_premium_times                How many times the `is_premium` method is expected to be called.
	 * @param bool $is_black_friday_promotion       Whether the black Friday promotion is active.
	 * @param int  $is_black_friday_promotion_times How many times the `is_black_friday_promotion` method is expected to be called.
	 * @param bool $expected                        The expected result.
	 *
	 * @return void
	 */
	public function test_should_show(
		$is_yoast_seo_page,
		$is_premium,
		$is_premium_times,
		$is_black_friday_promotion,
		$is_black_friday_promotion_times,
		$expected
	) {
		$this->current_page_helper->expects( 'is_yoast_seo_page' )
			->once()
			->withNoArgs()
			->andReturn( $is_yoast_seo_page );
		$this->product_helper->expects( 'is_premium' )
			->times( $is_premium_times )
			->withNoArgs()
			->andReturn( $is_premium );
		$this->promotion_manager->expects( 'is' )
			->times( $is_black_friday_promotion_times )
			->with( 'black-friday-promotion' )
			->andReturn( $is_black_friday_promotion );

		$this->assertSame( $expected, $this->instance->should_show() );
	}

	/**
	 * Provides the data for `test_should_show`.
	 *
	 * @return array<string, array<string, bool>>
	 */
	public static function should_show_data() {
		return [
			'on a Yoast admin page, with Premium disabled and black friday promotion active' => [
				'is_yoast_seo_page'               => true,
				'is_premium'                      => false,
				'is_premium_times'                => 1,
				'is_black_friday_promotion'       => true,
				'is_black_friday_promotion_times' => 1,
				'expected'                        => true,
			],
			'on a Yoast admin page, with Premium enabled and black friday promotion active' => [
				'is_yoast_seo_page'               => true,
				'is_premium'                      => true,
				'is_premium_times'                => 1,
				'is_black_friday_promotion'       => true,
				'is_black_friday_promotion_times' => 0,
				'expected'                        => false,
			],
			'on a Yoast admin page, with Premium disabled and black friday promotion not active' => [
				'is_yoast_seo_page'               => true,
				'is_premium'                      => false,
				'is_premium_times'                => 1,
				'is_black_friday_promotion'       => false,
				'is_black_friday_promotion_times' => 1,
				'expected'                        => false,
			],
			'not on a Yoast admin page, with Premium disabled and black friday promotion active' => [
				'is_yoast_seo_page'               => false,
				'is_premium'                      => false,
				'is_premium_times'                => 0,
				'is_black_friday_promotion'       => true,
				'is_black_friday_promotion_times' => 0,
				'expected'                        => false,
			],
		];
	}
}
