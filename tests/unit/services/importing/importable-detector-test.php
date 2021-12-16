<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Importing;

use Mockery;
use Yoast\WP\SEO\Actions\Importing\Aioseo_Posts_Importing_Action;
use Yoast\WP\SEO\Helpers\Meta_Helper;
use Yoast\WP\SEO\Helpers\Indexable_To_Postmeta_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Wpdb_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Services\Importing\Aioseo_Replacevar_Handler;
use Yoast\WP\SEO\Services\Importing\Importable_Detector;
use Yoast\WP\SEO\Tests\Unit\Doubles\Actions\Importing\Aioseo_Posts_Importing_Action_Double;
use Yoast\WP\SEO\Tests\Unit\Doubles\Services\Importing\Importable_Detector_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Importable_Detector_Test.
 *
 * @group importing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Services\Importing\Importable_Detector
 */
class Importable_Detector_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Importable_Detector
	 */
	protected $instance;

	/**
	 * The mocked importing action.
	 *
	 * @var Aioseo_Posts_Importing_Action_Double
	 */
	protected $importing_action;

	/**
	 * Represents the indexable repository.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * The mocked WordPress database object.
	 *
	 * @var Mockery\MockInterface|\wpdb
	 */
	protected $wpdb;

	/**
	 * The mocked meta helper.
	 *
	 * @var Mockery\MockInterface|Meta_Helper
	 */
	protected $meta;

	/**
	 * The mocked indexable_to_postmeta helper.
	 *
	 * @var Mockery\MockInterface|Indexable_To_Postmeta_Helper
	 */
	protected $indexable_to_postmeta;

	/**
	 * The mocked options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options;

	/**
	 * The wpdb helper.
	 *
	 * @var Wpdb_Helper
	 */
	protected $wpdb_helper;

	/**
	 * The replacevar handler.
	 *
	 * @var Aioseo_Replacevar_Handler
	 */
	protected $replacevar_handler;

	/**
	 * Set up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		$this->indexable_repository  = Mockery::mock( Indexable_Repository::class );
		$this->wpdb                  = Mockery::mock( 'wpdb' );
		$this->meta                  = Mockery::mock( Meta_Helper::class );
		$this->indexable_to_postmeta = Mockery::mock( Indexable_To_Postmeta_Helper::class, [ $this->meta ] );
		$this->options               = Mockery::mock( Options_Helper::class );
		$this->wpdb_helper           = Mockery::mock( Wpdb_Helper::class );
		$this->replacevar_handler    = new Aioseo_Replacevar_Handler();

		$this->importing_action = Mockery::mock(
			Aioseo_Posts_Importing_Action_Double::class,
			[
				$this->indexable_repository,
				$this->wpdb,
				$this->indexable_to_postmeta,
				$this->options,
				$this->wpdb_helper,
				$this->replacevar_handler,
			]
		)->makePartial()->shouldAllowMockingProtectedMethods();

		$this->instance      = new Importable_Detector( $this->importing_action );
		$this->mock_instance = Mockery::mock(
			Importable_Detector_Double::class,
			[
				$this->importing_action,
			]
		)->makePartial()->shouldAllowMockingProtectedMethods();
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->assertTrue( \is_array( self::getPropertyValue( $this->instance, 'importers' ) ) );

		$importer = array_values( self::getPropertyValue( $this->instance, 'importers' ) )[0];
		$this->assertInstanceOf(
			Aioseo_Posts_Importing_Action::class,
			$importer
		);
	}

	/**
	 * Tests if the detector detects when there are no importers.
	 *
	 * @covers ::detect
	 */
	public function test_detect_no_importers() {
		$this->mock_instance->expects( 'filter_actions' )
			->once()
			->andReturn( [] );

		$this->importing_action->expects( 'get_limited_unindexed_count' )
			->never();

		$detected = $this->mock_instance->detect();

		$this->assertTrue( \is_array( $detected ) );
		$this->assertTrue( \count( $detected ) === 0 );
	}

	/**
	 * Tests if the detector actually detects when there are unimported data and the action hasn't been finished.
	 *
	 * @covers ::detect
	 */
	public function test_detect_data_to_import_unifinished() {
		$this->mock_instance->expects( 'filter_actions' )
			->once()
			->andReturn( self::getPropertyValue( $this->instance, 'importers' ) );

		$this->importing_action->expects( 'is_enabled' )
				->once()
				->andReturn( true );

		$this->importing_action->expects( 'get_completed' )
			->once()
			->andReturn( false ); // Any number between 1-25.

		$this->importing_action->expects( 'get_limited_unindexed_count' )
			->once()
			->andReturn( 4 ); // Any number between 1-25.

		$detected = $this->mock_instance->detect();

		$this->assertTrue( \is_array( $detected ) );

		// Verify that we got data to import for the ONE importing action we have implemented at this point.
		$this->assertTrue( \count( $detected ) === 1 );
		$this->assertTrue( isset( $detected['aioseo'] ) );
		$this->assertTrue( $detected['aioseo'][0] === 'posts' );
	}

	/**
	 * Tests if the detector actually detects when there are unimported data but the action has been finished.
	 *
	 * @covers ::detect
	 */
	public function test_detect_data_to_import_finished() {
		$this->mock_instance->expects( 'filter_actions' )
			->once()
			->andReturn( self::getPropertyValue( $this->instance, 'importers' ) );

		$this->importing_action->expects( 'is_enabled' )
			->once()
			->andReturn( true );

		$this->importing_action->expects( 'get_completed' )
			->once()
			->andReturn( true );

		$this->importing_action->expects( 'get_limited_unindexed_count' )
			->never();

		$detected = $this->mock_instance->detect();

		$this->assertTrue( \is_array( $detected ) );
		$this->assertTrue( \count( $detected ) === 0 );
	}

	/**
	 * Tests if the detector detects when there are no unimported data but the action has not finished.
	 *
	 * @covers ::detect
	 */
	public function test_detect_no_data_to_import_unfinished() {
		$this->mock_instance->expects( 'filter_actions' )
			->once()
			->andReturn( self::getPropertyValue( $this->instance, 'importers' ) );

		$this->importing_action->expects( 'is_enabled' )
			->once()
			->andReturn( true );

		$this->importing_action->expects( 'get_completed' )
			->once()
			->andReturn( false );

		$this->importing_action->expects( 'get_limited_unindexed_count' )
			->once()
			->andReturn( 0 );

		$detected = $this->mock_instance->detect();

		$this->assertTrue( \is_array( $detected ) );
		$this->assertTrue( \count( $detected ) === 0 );
	}

	/**
	 * Tests if the detector detects when there are no enabled importers.
	 *
	 * @covers ::detect
	 */
	public function test_detect_no_data_when_no_enabled_importers() {
		$this->mock_instance->expects( 'filter_actions' )
			->once()
			->andReturn( self::getPropertyValue( $this->instance, 'importers' ) );

		$this->importing_action->expects( 'is_enabled' )
			->once()
			->andReturn( false );

		$detected = $this->mock_instance->detect();

		$this->assertTrue( \is_array( $detected ) );
		$this->assertTrue( \count( $detected ) === 0 );
	}
}
