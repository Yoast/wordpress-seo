<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Importing;

use Mockery;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Helpers\Meta_Helper;
use Yoast\WP\SEO\Helpers\Indexable_To_Postmeta_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Wpdb_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\Doubles\Actions\Importing\Abstract_Importing_Action_Double;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract_Importing_Action_Test class
 *
 * @group actions
 * @group indexing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Importing\Abstract_Importing_Action
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Abstract_Importing_Action_Test extends TestCase {

	/**
	 * Represents the mock instance to test.
	 *
	 * @var Abstract_Importing_Action_Double
	 */
	protected $mock_instance;

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
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

		$this->indexable_repository  = Mockery::mock( Indexable_Repository::class );
		$this->wpdb                  = Mockery::mock( 'wpdb' );
		$this->meta                  = Mockery::mock( Meta_Helper::class );
		$this->indexable_to_postmeta = Mockery::mock( Indexable_To_Postmeta_Helper::class, [ $this->meta ] );
		$this->options               = Mockery::mock( Options_Helper::class );
		$this->wpdb_helper           = Mockery::mock( Wpdb_Helper::class );
		$this->mock_instance         = Mockery::mock(
			Abstract_Importing_Action_Double::class,
			[
				$this->indexable_repository,
				$this->wpdb,
				$this->indexable_to_postmeta,
				$this->options,
				$this->wpdb_helper,
			]
		)->makePartial()->shouldAllowMockingProtectedMethods();

		$this->wpdb->prefix = 'wp_';
	}

	/**
	 * Tests the getting of the stored state of completedness.
	 *
	 * @covers ::get_completed
	 */
	public function test_get_completed() {
		$this->mock_instance->expects( 'get_cursor_id' )
			->once()
			->andReturn( 'aioseo_posts' );

		$expected_option = [
			'aioseo_posts' => true,
		];

		$this->options->expects( 'get' )
			->once()
			->with( 'importing_completed', [] )
			->andReturn( $expected_option );

		$completed = $this->mock_instance->get_completed();
		$this->assertEquals( true, $completed );
	}

	/**
	 * Tests the getting of the stored state of completedness when not completed.
	 *
	 * @covers ::get_completed
	 */
	public function test_get_not_completed() {
		$this->mock_instance->expects( 'get_cursor_id' )
			->once()
			->andReturn( 'aioseo_posts' );

		$expected_option = [
			'aioseo_posts' => false,
		];

		$this->options->expects( 'get' )
			->once()
			->with( 'importing_completed', [] )
			->andReturn( $expected_option );

		$completed = $this->mock_instance->get_completed();
		$this->assertEquals( false, $completed );
	}

	/**
	 * Tests the setting of the stored state of completedness.
	 *
	 * @covers ::get_completed
	 */
	public function test_set_completed() {
		$this->mock_instance->expects( 'get_cursor_id' )
			->once()
			->andReturn( 'aioseo_posts' );

		$this->options->expects( 'get' )
			->once()
			->with( 'importing_completed', [] )
			->andReturn( [] );

		$expected_arg = [
			'aioseo_posts' => false,
		];
		$this->options->expects( 'set' )
			->once()
			->with( 'importing_completed', $expected_arg );

		$completed = $this->mock_instance->set_completed( false );
	}

	/**
	 * Tests the setting of the stored state of completedness when not completed.
	 *
	 * @covers ::get_completed
	 */
	public function test_set_not_completed() {
		$this->mock_instance->expects( 'get_cursor_id' )
			->once()
			->andReturn( 'aioseo_posts' );

		$this->options->expects( 'get' )
			->once()
			->with( 'importing_completed', [] )
			->andReturn( [] );

		$expected_arg = [
			'aioseo_posts' => true,
		];
		$this->options->expects( 'set' )
			->once()
			->with( 'importing_completed', $expected_arg );

		$completed = $this->mock_instance->set_completed( true );
	}
}
