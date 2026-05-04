<?php

namespace Yoast\WP\SEO\Tests\Unit\Introductions\Application;

use Mockery;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Introductions\Application\AI_Brand_Insights_Free_Trial;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the AI Brand Insights free trial.
 *
 * @group introductions
 *
 * @coversDefaultClass \Yoast\WP\SEO\Introductions\Application\AI_Brand_Insights_Free_Trial
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class AI_Brand_Insights_Free_Trial_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var AI_Brand_Insights_Free_Trial
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

		$this->instance = new AI_Brand_Insights_Free_Trial(
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
		$this->assertSame( 'ai-brand-insights-free-trial', $this->instance->get_id() );
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
	 * @param bool $is_yoast_seo_page Whether on a Yoast SEO page.
	 * @param bool $is_premium        Whether Premium is installed.
	 * @param int  $is_premium_times  How many times the `is_premium` method is expected to be called.
	 * @param bool $expected          The expected result.
	 *
	 * @return void
	 */
	public function test_should_show(
		$is_yoast_seo_page,
		$is_premium,
		$is_premium_times,
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

		$this->assertSame( $expected, $this->instance->should_show() );
	}

	/**
	 * Provides the data for `test_should_show`.
	 *
	 * @return array<string, array<string, bool|int>>
	 */
	public static function should_show_data() {
		return [
			'on a Yoast admin page, with Premium enabled' => [
				'is_yoast_seo_page' => true,
				'is_premium'        => true,
				'is_premium_times'  => 1,
				'expected'          => true,
			],
			'on a Yoast admin page, with Premium disabled' => [
				'is_yoast_seo_page' => true,
				'is_premium'        => false,
				'is_premium_times'  => 1,
				'expected'          => false,
			],
			'not on a Yoast admin page, with Premium enabled' => [
				'is_yoast_seo_page' => false,
				'is_premium'        => true,
				'is_premium_times'  => 0,
				'expected'          => false,
			],
			'not on a Yoast admin page, with Premium disabled' => [
				'is_yoast_seo_page' => false,
				'is_premium'        => false,
				'is_premium_times'  => 0,
				'expected'          => false,
			],
		];
	}
}
