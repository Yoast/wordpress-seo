<?php

namespace Yoast\WP\SEO\Tests\Unit\Introductions\Application;

use Mockery;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Introductions\Application\AI_Brand_Insights_Pre_Launch;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the AI Brand Insights pre-launch.
 *
 * @group introductions
 *
 * @coversDefaultClass \Yoast\WP\SEO\Introductions\Application\AI_Brand_Insights_Pre_Launch
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class AI_Brand_Insights_Pre_Launch_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var AI_Brand_Insights_Pre_Launch
	 */
	private $instance;

	/**
	 * Holds the current page helper.
	 *
	 * @var Mockery\MockInterface|Current_Page_Helper
	 */
	private $current_page_helper;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->current_page_helper = Mockery::mock( Current_Page_Helper::class );

		$this->instance = new AI_Brand_Insights_Pre_Launch( $this->current_page_helper );
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
	}

	/**
	 * Tests getting the ID.
	 *
	 * @covers ::get_id
	 *
	 * @return void
	 */
	public function test_get_name() {
		$this->assertSame( 'ai-brand-insights-pre-launch', $this->instance->get_id() );
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
	 * @param bool $is_yoast_seo_page Whether on a Yoast SEO page.
	 * @param bool $expected          The expected result.
	 *
	 * @return void
	 */
	public function test_should_show( $is_yoast_seo_page, $expected ) {
		$this->current_page_helper->expects( 'is_yoast_seo_page' )
			->withNoArgs()
			->andReturn( $is_yoast_seo_page );

		$this->assertSame( $expected, $this->instance->should_show() );
	}

	/**
	 * Provides the data for `test_should_show`.
	 *
	 * @return array<string, array<string, bool>>
	 */
	public static function should_show_data() {
		return [
			'on a Yoast admin page'     => [
				'is_yoast_seo_page' => true,
				'expected'          => true,
			],
			'not on a Yoast admin page' => [
				'is_yoast_seo_page' => false,
				'expected'          => false,
			],
		];
	}
}
