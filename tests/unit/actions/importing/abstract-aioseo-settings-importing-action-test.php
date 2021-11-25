<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Importing;

use Exception;
use Mockery;
use Brain\Monkey;
use Yoast\WP\SEO\Actions\Importing\Abstract_Aioseo_Settings_Importing_Action;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\Doubles\Actions\Importing\Abstract_Aioseo_Settings_Importing_Action_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract_Aioseo_Settings_Importing_Action_Test class
 *
 * @group actions
 * @group importing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Importing\Abstract_Aioseo_Settings_Importing_Action
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded, PHPCompatibility.FunctionUse.NewFunctions.array_key_lastFound
 */
class Abstract_Aioseo_Settings_Importing_Action_Test extends TestCase {

	/**
	 * Represents the mock instance to test.
	 *
	 * @var Abstract_Aioseo_Settings_Importing_Action_Double
	 */
	protected $mock_instance;

	/**
	 * The mocked options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options;

	/**
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

		$this->options       = Mockery::mock( Options_Helper::class );
		$this->mock_instance = Mockery::mock(
			Abstract_Aioseo_Settings_Importing_Action_Double::class,
			[ $this->options ]
		)->makePartial()->shouldAllowMockingProtectedMethods();
	}

	/**
	 * Tests the getting of the yoast_name placeholder.
	 *
	 * @covers ::get_placeholder
	 */
	public function test_get_placeholder() {
		$this->expectException( Exception::class );

		$this->mock_instance->get_placeholder();
	}

	/**
	 * Tests the getting of the source option_name.
	 *
	 * @covers ::get_source_option_name
	 */
	public function test_get_source_option_name() {
		$this->expectException( Exception::class );

		$this->mock_instance->get_source_option_name();
	}

	/**
	 * Tests the getting of the source option_name.
	 *
	 * @covers ::transform_setting_type
	 */
	public function test_transform_setting_type() {
		$type             = 'post';
		$transformed_type = $this->mock_instance->transform_setting_type( $type );
		$this->assertEquals( $transformed_type, $type );
	}

	/**
	 * Tests the getting of the total number of unimported objects.
	 *
	 * @param array $query_results            The results from the query.
	 * @param bool  $expected_finished        Whether the importing action is finished or not.
	 * @param int   $expected_unindexed_count The count of the total unindexed data.
	 *
	 * @dataProvider provider_get_total_unindexed
	 * @covers ::get_total_unindexed
	 */
	public function test_get_total_unindexed( $query_results, $expected_finished, $expected_unindexed_count ) {
		$this->mock_instance->expects( 'query' )
			->once()
			->andReturn( $query_results );

		$this->mock_instance->expects( 'set_completed' )
			->once()
			->with( $expected_finished );

		$unindexed_count = $this->mock_instance->get_total_unindexed();
		$this->assertEquals( $unindexed_count, $expected_unindexed_count );
	}

	/**
	 * Tests the getting of the limited number of unimported objects.
	 *
	 * @param array $query_results            The results from the query.
	 * @param bool  $expected_finished        Whether the importing action is finished or not.
	 * @param int   $expected_unindexed_count The limited count of the unindexed data.
	 *
	 * @dataProvider provider_get_limited_unindexed
	 * @covers ::get_limited_unindexed_count
	 */
	public function test_get_limited_unindexed_count( $query_results, $expected_finished, $expected_unindexed_count ) {
		$this->mock_instance->expects( 'query' )
			->once()
			->with( 1 )
			->andReturn( $query_results );

		$this->mock_instance->expects( 'set_completed' )
			->once()
			->with( $expected_finished );

		$unindexed_count = $this->mock_instance->get_limited_unindexed_count( 1 );
		$this->assertEquals( $unindexed_count, $expected_unindexed_count );
	}

	/**
	 * Tests importing AIOSEO settings.
	 *
	 * @param array $query_results     The results from the query.
	 * @param bool  $expected_finished Whether the importing action is finished or not.
	 *
	 * @dataProvider provider_index
	 * @covers ::index
	 */
	public function test_index( $query_results, $expected_finished ) {
		$this->mock_instance->expects( 'get_limit' )
			->once()
			->andReturn( 25 );

		$this->mock_instance->expects( 'query' )
				->once()
				->with( 25 )
				->andReturn( $query_results );

		$this->mock_instance->expects( 'set_completed' )
			->once()
			->with( $expected_finished );

		if ( ! $expected_finished ) {
			$this->mock_instance->expects( 'map' )
				->times( \count( $query_results ) );
		}

		$this->mock_instance->expects( 'get_cursor_id' )
			->once()
			->andReturn( 'cursor_id' );

		$this->mock_instance->expects( 'set_cursor' )
			->once()
			->with( $this->options, 'cursor_id', \array_key_last( $query_results ) );

		$created_settings = $this->mock_instance->index();
		$this->assertEquals( $created_settings, \array_keys( $query_results ) );
	}

	/**
	 * Data provider for test_get_total_unindexed().
	 *
	 * @return array
	 */
	public function provider_get_total_unindexed() {
		return [
			[ [], true, 0 ],
			[ [ 0 ], false, 1 ],
			[ [ 0, 1, 2, 3, 4 ], false, 5 ],
		];
	}

	/**
	 * Data provider for test_get_limited_unindexed_count().
	 *
	 * @return array
	 */
	public function provider_get_limited_unindexed() {
		return [
			[ [], true, 0 ],
			[ [ 0 ], false, 1 ],
			[ [ 54321 ], false, 1 ],
		];
	}

	/**
	 * Data provider for test_index().
	 *
	 * @return array
	 */
	public function provider_index() {
		return [
			[ [], true ],
			[
				[
					'setting1' => 'value1',
				],
				false,
			],
			[
				[
					'setting1' => 'value1',
					'setting2' => [ 'value2-a', 'value2-c', 'value2-c' ],
				],
				false,
			],
		];
	}
}
