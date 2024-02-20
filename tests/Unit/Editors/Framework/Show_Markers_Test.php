<?php

namespace Yoast\WP\SEO\Tests\Unit\Editors\Framework;


use Mockery;
use Brain\Monkey;
use Brain\Monkey\Functions;
use Yoast\WP\SEO\Editors\Framework\Content_Analysis;
use Yoast\WP\SEO\Editors\Framework\Cornerstone;
use Yoast\WP\SEO\Editors\Framework\Previously_Used_Keyword;
use Yoast\WP\SEO\Editors\Framework\Show_Markers;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Editors\Domain\Analysis_Features\Analysis_Feature;

/**
 * Class Show_Markers_Test
 *
 * @group editors
 *
 * @coversDefaultClass \Yoast\WP\SEO\Editors\Framework\Show_Markers
 */
final class Show_Markers_Test extends TestCase {

	/**
	 * The Content_Analysis.
	 *
	 * @var Show_Markers
	 */
	private $instance;

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Show_Markers();
	}

	/**
	 * Tests the getters.
	 *
	 * @covers ::__construct
	 * @covers ::get_name
	 * @covers ::get_legacy_key
	 *
	 * @return void
	 */
	public function test_getters() {

		$this->assertSame( 'markers', $this->instance->get_name() );
		$this->assertSame( 'show_markers', $this->instance->get_legacy_key() );
	}

	/**
	 * Tests the is_enabled method.
	 *
	 * @covers ::is_enabled
	 *
	 * @dataProvider data_provider_is_enabled
	 *
	 * @param $enable_assessment_markers bool Return value of the `wpseo_enable_assessment_markers` filter.
	 * @param $expected                   bool The expected outcome.
	 *
	 * @return void
	 */
	public function test_is_enabled( $enable_assessment_markers, $expected ) {


		Functions\expect( 'apply_filters' )
			->once()
			->with( 'wpseo_enable_assessment_markers', true )
			->andReturn( $enable_assessment_markers );
		$this->assertSame( $expected, $this->instance->is_enabled() );
	}

	/**
	 * Data provider for test_is_enabled.
	 *
	 * @return array
	 */
	public static function data_provider_is_enabled() {
		return [
			'Enabled'  => [
				'enable_assessment_markers' => true,
				'expected'                       => true,
			],
			'Disabled' => [
				'enable_assessment_markers' => false,
				'expected'                       => false,
			],
		];
	}
}
