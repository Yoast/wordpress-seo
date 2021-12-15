<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Importing;

use Mockery;
use Yoast\WP\SEO\Actions\Importing\Deactivate_Conflicting_Plugins_Action;
use Yoast\WP\SEO\Helpers\Indexable_To_Postmeta_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Wpdb_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Services\Importing\Conflicting_Plugins_Service;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Aioseo_Posts_Importing_Action_Test class
 *
 * @group actions
 * @group importing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Importing\Deactivate_Conflicting_Plugins_Action
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Deactivate_Conflicting_Plugins_Action_Test extends TestCase {

	/**
	 * The class under test.
	 *
	 * @var Deactivate_Conflicting_Plugins_Action
	 */
	protected $deactivate_conflicting_plugins_action;

	/**
	 * The service responsible for detecting conflicting plugins
	 *
	 * @var Mockery::mockInterface|Conflicting_Plugins_Service
	 */
	protected $conflicting_plugins_service;

	/**
	 * {@inheritDoc}
	 */
	public function set_up() {
		$this->conflicting_plugins_service = Mockery::mock( Conflicting_Plugins_Service::class );

		$this->deactivate_conflicting_plugins_action = new Deactivate_Conflicting_Plugins_Action(
			Mockery::mock( Options_Helper::class ),
			$this->conflicting_plugins_service
		);
	}

	/**
	 * Tests wether the tested class can import all data it should be able to handle
	 *
	 * @param string $plugin The plugin that's being imported.
	 * @param string $type   The type of data being imported.
	 *
	 * @dataProvider is_compatible_with_testdata
	 *
	 * @covers ::is_compatible_with
	 * @covers ::__construct
	 */
	public function test_is_compatible_with( $plugin, $type ) {
		// Arrange.

		// Act.
		$result = $this->deactivate_conflicting_plugins_action->is_compatible_with( $plugin, $type );

		// Assert.
		$this->assertTrue( $result );
	}

	/**
	 * Testdata for test_is_compatible_with
	 *
	 * @return array
	 */
	public function is_compatible_with_testdata() {
		return [
			[
				null,
				null,
			],

			[
				null,
				'deactivation',
			],

			[
				'conflicting-plugins',
				null,
			],

			[
				'conflicting-plugins',
				'deactivation',
			],
		];
	}

	/**
	 * Tests wether the tested class can import all data it should be able to handle
	 *
	 * @param string $plugin The plugin that's being imported.
	 * @param string $type   The type of data being imported.
	 *
	 * @dataProvider is_compatible_with_wrong_testdata
	 *
	 * @covers ::is_compatible_with
	 * @covers ::__construct
	 */
	public function test_is_not_compatible_with( $plugin, $type ) {
		// Arrange.

		// Act.
		$result = $this->deactivate_conflicting_plugins_action->is_compatible_with( $plugin, $type );

		// Assert.
		$this->assertFalse( $result );
	}

	/**
	 * Testdata for test_is_compatible_with
	 *
	 * @return array
	 */
	public function is_compatible_with_wrong_testdata() {
		return [
			[
				null,
				'random_type',
			],

			[
				'random_plugin',
				null,
			],

			[
				'random_plugin',
				'random_type',
			],

			[
				1,
				-1,
			],
		];
	}

	/**
	 * Test the get_total_unindexed method
	 *
	 * @covers ::get_total_unindexed
	 */
	public function test_get_total_unindexed() {
		// Arrange.
		$data = [ 'a', 'b', 'c', 'd' ];
		$this->conflicting_plugins_service
			->expects( 'detect_conflicting_plugins' )
			->once()
			->andReturn( $data );

		// Act.
		$result = $this->deactivate_conflicting_plugins_action->get_total_unindexed();

		// Assert.
		$this->assertEquals( 4, $result );
	}

	/**
	 * Test the index method
	 *
	 * @covers ::index
	 */
	public function test_index() {
		// Arrange.
		$data = [ 'a', 'b', 'c', 'd' ];
		$this->conflicting_plugins_service
			->expects( 'detect_conflicting_plugins' )
			->once()
			->andReturn( $data );
		$this->conflicting_plugins_service
			->expects( 'deactivate_conflicting_plugins' )
			->with( $data )
			->once()
			->andReturn( [] );

		// Act.
		$result = $this->deactivate_conflicting_plugins_action->index();

		// Assert.
		$this->assertEquals( [], $result );
	}

	/**
	 * Tests the get_limit method.
	 *
	 * @covers ::get_limit
	 */
	public function test_get_limit() {
		// Act.
		$result = $this->deactivate_conflicting_plugins_action->get_limit();

		// Assert.
		$this->assertEquals( 52, $result );
	}

	/**
	 * Tests the get_limit method.
	 *
	 * @dataProvider get_limited_data
	 *
	 * @param int $limit    The requested maximum.
	 * @param int $expected The expected result.
	 *
	 * @covers ::get_limited_unindexed_count
	 */
	public function test_get_limited_unindexed_count( $limit, $expected ) {
		// Arrange.
		$data = [ 'a', 'b', 'c', 'd' ];
		$this->conflicting_plugins_service
			->expects( 'detect_conflicting_plugins' )
			->once()
			->andReturn( $data );

		// Act.
		$result = $this->deactivate_conflicting_plugins_action->get_limited_unindexed_count( $limit );

		// Assert.
		$this->assertEquals( $expected, $result );
	}

	/**
	 * Provides the testcases for test_get_limited_unindexed_count
	 *
	 * @return array
	 */
	public function get_limited_data() {
		return [
			[ 5, 4 ],
			[ 4, 4 ],
			[ 3, 3 ],
			[ -1, -1 ],
		];
	}
}
