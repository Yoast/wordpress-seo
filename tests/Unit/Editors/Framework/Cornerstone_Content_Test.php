<?php

namespace Yoast\WP\SEO\Tests\Unit\Editors\Framework;

use Mockery;
use Yoast\WP\SEO\Editors\Framework\Cornerstone_Content;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Cornerstone_Test
 *
 * @group editors
 *
 * @coversDefaultClass \Yoast\WP\SEO\Editors\Framework\Cornerstone_Content
 */
final class Cornerstone_Content_Test extends TestCase {

	/**
	 * Holds the Options_Helper instance.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options;

	/**
	 * The Cornerstone_Content feature.
	 *
	 * @var Cornerstone_Content
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

		$this->instance = new Cornerstone_Content( $this->options );
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

		$this->assertSame( 'cornerstoneContent', $this->instance->get_name() );
		$this->assertSame( 'cornerstoneActive', $this->instance->get_legacy_key() );
	}

	/**
	 * Tests the is_enabled method.
	 *
	 * @covers ::is_enabled
	 *
	 * @dataProvider data_provider_is_enabled
	 *
	 * @param bool $enable_cornerstone_content If the `enable_cornerstone_content` option is enabled.
	 * @param bool $expected                   The expected outcome.
	 *
	 * @return void
	 */
	public function test_is_enabled( bool $enable_cornerstone_content, bool $expected ) {
		$this->options
			->expects( 'get' )
			->with( 'enable_cornerstone_content', false )
			->andReturn( $enable_cornerstone_content );

		$this->assertSame( $expected, $this->instance->is_enabled() );
	}

	/**
	 * Data provider for test_is_enabled.
	 *
	 * @return array<array<string|bool>>
	 */
	public static function data_provider_is_enabled() {
		return [
			'Enabled' => [
				'enable_cornerstone_content' => true,
				'expected'                   => true,
			],
			'Disabled' => [
				'enable_cornerstone_content' => false,
				'expected'                   => false,
			],
		];
	}
}
