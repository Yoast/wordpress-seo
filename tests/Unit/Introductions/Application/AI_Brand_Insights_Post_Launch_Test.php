<?php

namespace Yoast\WP\SEO\Tests\Unit\Introductions\Application;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Introductions\Application\AI_Brand_Insights_Post_Launch;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the AI Brand Insights post-launch.
 *
 * @group introductions
 *
 * @coversDefaultClass \Yoast\WP\SEO\Introductions\Application\AI_Brand_Insights_Post_Launch
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class AI_Brand_Insights_Post_Launch_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var AI_Brand_Insights_Post_Launch
	 */
	private $instance;

	/**
	 * Holds the current page helper.
	 *
	 * @var Mockery\MockInterface|Current_Page_Helper
	 */
	private $current_page_helper;

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
		$this->product_helper      = Mockery::mock( Product_Helper::class );

		$this->instance = new AI_Brand_Insights_Post_Launch(
			$this->current_page_helper,
			$this->product_helper,
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
			$this->getPropertyValue( $this->instance, 'current_page_helper' ),
		);
		$this->assertInstanceOf(
			Product_Helper::class,
			$this->getPropertyValue( $this->instance, 'product_helper' ),
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
		$this->assertSame( 'ai-brand-insights-post-launch', $this->instance->get_id() );
	}

	/**
	 * Tests getting the priority.
	 *
	 * @covers ::get_priority
	 *
	 * @return void
	 */
	public function test_get_priority() {
		$this->assertSame( 20, $this->instance->get_priority() );
	}

	/**
	 * Tests the conditional `should_show`.
	 *
	 * @covers ::should_show
	 *
	 * @dataProvider should_show_data
	 *
	 * @param bool $is_yoast_seo_page  Whether on a Yoast SEO page.
	 * @param bool $is_premium         Whether Premium is installed.
	 * @param int  $is_premium_times   How many times the `is_premium` method is expected to be called.
	 * @param bool $can_manage_options Whether the user has the `wpseo_manage_options` capability.
	 * @param int  $can_manage_times   How many times the capability check is expected to run.
	 * @param bool $expected           The expected result.
	 *
	 * @return void
	 */
	public function test_should_show(
		$is_yoast_seo_page,
		$is_premium,
		$is_premium_times,
		$can_manage_options,
		$can_manage_times,
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
		Monkey\Functions\expect( 'current_user_can' )
			->times( $can_manage_times )
			->with( 'wpseo_manage_options' )
			->andReturn( $can_manage_options );

		$this->assertSame( $expected, $this->instance->should_show() );
	}

	/**
	 * Provides the data for `test_should_show`.
	 *
	 * @return array<string, array<string, bool|int>>
	 */
	public static function should_show_data() {
		return [
			'on a Yoast admin page, with Premium disabled and the required capability' => [
				'is_yoast_seo_page'  => true,
				'is_premium'         => false,
				'is_premium_times'   => 1,
				'can_manage_options' => true,
				'can_manage_times'   => 1,
				'expected'           => true,
			],
			'on a Yoast admin page, with Premium disabled but without the required capability' => [
				'is_yoast_seo_page'  => true,
				'is_premium'         => false,
				'is_premium_times'   => 1,
				'can_manage_options' => false,
				'can_manage_times'   => 1,
				'expected'           => false,
			],
			'on a Yoast admin page, with Premium enabled' => [
				'is_yoast_seo_page'  => true,
				'is_premium'         => true,
				'is_premium_times'   => 1,
				'can_manage_options' => true,
				'can_manage_times'   => 0,
				'expected'           => false,
			],
			'not on a Yoast admin page, with Premium disabled' => [
				'is_yoast_seo_page'  => false,
				'is_premium'         => false,
				'is_premium_times'   => 0,
				'can_manage_options' => true,
				'can_manage_times'   => 0,
				'expected'           => false,
			],
			'not on a Yoast admin page, with Premium enabled' => [
				'is_yoast_seo_page'  => false,
				'is_premium'         => true,
				'is_premium_times'   => 0,
				'can_manage_options' => true,
				'can_manage_times'   => 0,
				'expected'           => false,
			],
		];
	}
}
