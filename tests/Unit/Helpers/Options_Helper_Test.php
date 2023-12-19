<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Post_Helper_Test
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Options_Helper
 */
final class Options_Helper_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Options_Helper|Mockery\MockInterface
	 */
	private $instance;

	/**
	 * Prepares the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = Mockery::mock( Options_Helper::class )
			->shouldAllowMockingProtectedMethods()
			->makePartial();
	}

	/**
	 * Tests the retrieval of a title default.
	 *
	 * @covers ::get_title_default
	 *
	 * @return void
	 */
	public function test_get_title_default() {
		$this->instance
			->expects( 'get_title_defaults' )
			->once()
			->andReturn(
				[
					'my-title' => 'This is a title',
				]
			);

		$this->assertEquals( 'This is a title', $this->instance->get_title_default( 'my-title' ) );
	}

	/**
	 * Tests the retrieval of an unknown title default.
	 *
	 * @covers ::get_title_default
	 *
	 * @return void
	 */
	public function test_get_title_default_with_no_default_available() {
		$this->instance
			->expects( 'get_title_defaults' )
			->once()
			->andReturn( [] );

		$this->assertEquals( '', $this->instance->get_title_default( 'unknown-title' ) );
	}
}
