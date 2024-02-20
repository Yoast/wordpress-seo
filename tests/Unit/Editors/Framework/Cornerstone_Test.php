<?php

namespace Yoast\WP\SEO\Tests\Unit\Editors\Framework;


use Mockery;
use Brain\Monkey;
use Yoast\WP\SEO\Editors\Framework\Content_Analysis;
use Yoast\WP\SEO\Editors\Framework\Cornerstone;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Editors\Domain\Analysis_Features\Analysis_Feature;

/**
 * Class Cornerstone_Test
 *
 * @group editors
 *
 * @coversDefaultClass \Yoast\WP\SEO\Editors\Framework\Cornerstone
 */
final class Cornerstone_Test extends TestCase {

	/**
	 * Holds the Options_Helper instance.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options;

	/**
	 * The Content_Analysis.
	 *
	 * @var Cornerstone
	 */
	private $instance;

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();
		$this->options = Mockery::mock( Options_Helper::class );

		$this->instance = new Cornerstone( $this->options );
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

		$this->assertSame( 'cornerstone', $this->instance->get_name() );
		$this->assertSame( 'cornerstoneActive', $this->instance->get_legacy_key() );
	}

	/**
	 * Tests the is_enabled method.
	 *
	 * @covers ::is_enabled
	 *
	 * @dataProvider data_provider_is_enabled
	 *
	 * @param $enable_cornerstone_content bool If the `enable_cornerstone_content` option is enabled.
	 * @param $expected bool The expected outcome.
	 *
	 * @return void
	 */
	public function test_is_enabled( $enable_cornerstone_content,  $expected ) {
		$this->options
			->expects( 'get' )
			->with( 'enable_cornerstone_content', false )
			->andReturn( $enable_cornerstone_content );

		$this->assertSame( $expected, $this->instance->is_enabled() );
	}

	/**
	 * Data provider for test_is_enabled.
	 *
	 * @return array
	 */
	public static function data_provider_is_enabled() {
		return [
			'Enabled' => [
				'enable_cornerstone_content' => true,
				'expected'                => true,
			],
			'Disabled' => [
				'enable_cornerstone_content' => false,
				'expected'                => false,
			],
		];
	}
}
