<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Importing;

use Mockery;
use Yoast\WP\SEO\Actions\Importing\Import_Cursor_Manager_Trait;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
/**
 * Class Import_Cursor_Manager_Trait_Test
 *
 * @group actions
 * @group importing
 *
 * @package Yoast\WP\SEO\Tests\Unit\Actions\Importing
 *
 * @coversDefaultClass Yoast\WP\SEO\Actions\Importing\Import_Cursor_Manager_Trait
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Import_Cursor_Manager_Trait_Test extends TestCase {

	use Import_Cursor_Manager_Trait;

	const CURSOR_ID = 'MY_CURSOR_IS_COOL';

	/**
	 * The options helper mock.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options_helper;

	/**
	 * Sets up the test class.
	 */
	public function set_up() {
		$this->options_helper = Mockery::Mock( Options_Helper::class );
	}

	/**
	 * Test reading the cursor value from the option.
	 *
	 * @covers ::get_cursor
	 */
	public function test_get_cursor() {
		// Arrange.
		$this->options_helper
			->expects( 'get' )
			->withArgs( [ 'import_cursors', [] ] )
			->andReturn( [ self::CURSOR_ID => 1337 ] );

		// Act.
		$result = $this->get_cursor( $this->options_helper, self::CURSOR_ID );

		// Assert.
		self::assertEquals( 1337, $result );
	}

	/**
	 * Test reading the cursor value from the option.
	 *
	 * @covers ::get_cursor
	 */
	public function test_get_cursor_default() {
		// Arrange.
		$this->options_helper
			->expects( 'get' )
			->withArgs( [ 'import_cursors', [] ] )
			->andReturn( [] );

		// Act.
		$result = $this->get_cursor( $this->options_helper, self::CURSOR_ID );

		// Assert.
		self::assertEquals( 0, $result );
	}

	/**
	 * Test reading the cursor value from the option.
	 *
	 * @dataProvider not_set_cursor_values
	 *
	 * @covers ::set_cursor
	 *
	 * @param mixed $cursor_value The invalid cursor value.
	 */
	public function test_set_cursor_invalid( $cursor_value ) {
		// Arrange.
		$this->options_helper
			->expects( 'get' )
			->withArgs( [ 'import_cursors', [] ] )
			->andReturn( [ self::CURSOR_ID => 1337 ] );
		$this->options_helper
			->expects( 'set' )
			->withAnyArgs()
			->never();

		// Act.
		$this->set_cursor( $this->options_helper, self::CURSOR_ID, $cursor_value );

		// Assert.
		// The cursor is never set.
	}

	/**
	 * Dataprovider for test_set_cursor_invalid function.
	 *
	 * @return array Data for test_set_cursor_invalid function.
	 */
	public function not_set_cursor_values() {
		return [
			[ 0 ],
			[ -1 ],
			[ 1336 ],
			[ 1337 ],
			[ -9223372036854775808 ],
			[ 1336.3 ],
			[ null ],
		];
	}

	/**
	 * Test reading the cursor value from the option.
	 *
	 * @dataProvider set_cursor_values
	 *
	 * @covers ::set_cursor
	 *
	 * @param array $testcase The associated array testcase.
	 */
	public function test_set_cursor( $testcase ) {
		// Arrange.
		$this->options_helper
			->expects( 'get' )
			->withArgs( [ 'import_cursors', [] ] )
			->andReturn( [ self::CURSOR_ID => 1337 ] );
		$this->options_helper
			->expects( 'set' )
			->withArgs( [ 'import_cursors', [ self::CURSOR_ID => $testcase ] ] );

		// Act.
		$this->set_cursor( $this->options_helper, self::CURSOR_ID, $testcase );

		// Assert.
		// The cursor is set.
	}

	/**
	 * Dataprovider for test_set_cursor function.
	 *
	 * @return array Data for test_set_cursor function.
	 */
	public function set_cursor_values() {
		return [
			[ 1338 ],
			[ 1337.5 ],
			[ 9223372036854775807 ],
		];
	}
}
