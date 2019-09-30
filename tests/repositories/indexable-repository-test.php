<?php

namespace Yoast\WP\Free\Tests\Repositories;

use Yoast\WP\Free\Builders\Indexable_Author_Builder;
use Yoast\WP\Free\Builders\Indexable_Post_Builder;
use Yoast\WP\Free\Builders\Indexable_Term_Builder;
use Yoast\WP\Free\Loggers\Logger;
use Yoast\WP\Free\Repositories\Indexable_Repository;
use Yoast\WP\Free\Tests\TestCase;
use YoastSEO_Vendor\ORM;

/**
 * @group indexables
 */
class Indexable_Post_Builder_Test extends TestCase {

	/**
	 * @var Indexable_Repository
	 */
	protected $repository;

	/**
	 * @var \PDO
	 */
	protected $db;

	public function wpdbsetup() {

		global $wpdb;
		$wpdb->prefix = 'prefix';
	}

	public function setUp() {
		$this->wpdbsetup();

		$wpdb = \Mockery::mock( \wpdb::class );
		$wpdb->prefix = 'custom_prefix_';

		$this->repository = Indexable_Repository::get_instance(
			\Mockery::mock(Indexable_Author_Builder::class ),
			\Mockery::mock( Indexable_Post_Builder::class ),
			\Mockery::mock( Indexable_Term_Builder::class ),
			new Logger(),
			$wpdb
		);

		$this->db = \Mockery::mock( \PDO::class );

		$this->db
			->shouldReceive( 'getAttribute' )
			->andReturnUsing( function( $key ) {
				$map = [
					\PDO::ATTR_DRIVER_NAME => 'mysql',
				];

				return $map[ $key ];
			} );

		ORM::set_db( $this->db );

		return parent::setUp();
	}

	public function get_pdo_type($param ) {
		if (\is_null($param)) {
			$type = \PDO::PARAM_NULL;
		} else {
			if (\is_bool($param)) {
				$type = \PDO::PARAM_BOOL;
			} else {
				if (\is_int($param)) {
					$type = \PDO::PARAM_INT;
				} else {
					$type = \PDO::PARAM_STR;
				}
			}
		}

		return $type;
	}

	public function expect_pdo_query( $expected_query, $expected_parameters, $return_rows ) {
		$statement = \Mockery::mock( \PDOStatement::class );

		foreach ( $expected_parameters as $index => $expected_parameter ) {
			$statement->shouldReceive( 'bindParam' )
			          ->once()
				// PDO indexes start at 1
				      ->with( $index + 1, $expected_parameter, $this->get_pdo_type( $expected_parameter ) );
		}

		$statement->shouldReceive( 'execute' );

		// Make sure the fetching ends at some point.
		$return_rows[] = false;

		$statement->shouldReceive( 'fetch' )
		          ->andReturnValues( $return_rows );

		$this->db
			->shouldReceive( 'prepare' )
			->withArgs( function( $received_query ) use ( $expected_query ) {
				// Strip all whitespace so the expected query in the tests can be more lenient with it's whitespace.
				$received_query = preg_replace( '/\s+/', '', $received_query );
				$expected_query = preg_replace( '/\s+/', '', $expected_query );

				if ( $received_query !== $expected_query ) {
					$this->fail(
						"Didn't receive expected query" . PHP_EOL . PHP_EOL .
						"Expected query: " . $expected_query . PHP_EOL .
						"Received query: " . $received_query . PHP_EOL
					);
				}


				return $received_query === $expected_query;
			} )
			->andReturn( $statement );
	}

	public function test_count_posts_with_outdated_prominent_words() {
		// Putting the query here makes this test verify that we are doing the optimal query we intend.
		// If the ORM has a change that changes this query, we want to verify we are still doing something we intend.
		$expected_query = '
			SELECT COUNT(*) AS `count` FROM `custom_prefix_posts` WHERE `ID` NOT IN (
				SELECT `object_id` FROM prefixyoast_indexable
				WHERE `prominent_words_version` = ?
				AND `object_type` = \'post\'
				AND `object_sub_type` IN ( ?,? )
			) AND `post_status` IN (?, ?, ?, ?, ?) AND `post_type` IN (?, ?) LIMIT 1';

		$expected_parameters = [
			100,
			'post_type1',
			'post_type2',
			'future',
			'draft',
			'pending',
			'private',
			'publish',
			'post_type1',
			'post_type2'
		];

		$return_rows = [
			[ 'count' => 5 ]
		];

		$this->expect_pdo_query(
			$expected_query,
			$expected_parameters,
			$return_rows
		);

		$count = $this->repository->count_posts_with_outdated_prominent_words( 100, [ 'post_type1', 'post_type2' ] );

		$this->assertEquals( 5, $count );
	}

	public function test_count_posts_with_outdated_prominent_words_no_post_types() {
		$count = $this->repository->count_posts_with_outdated_prominent_words( 1, [] );

		$this->assertEquals( 0, $count );
	}

	public function test_find_posts_with_outdated_prominent_words_no_post_types() {
		$outdated_prominent_words = $this->repository->find_posts_with_outdated_prominent_words( 1, [] );

		$this->assertEquals( [], $outdated_prominent_words );
	}

	public function test_find_posts_with_outdated_prominent_words_2_rows() {
		// Putting the query here makes this test verify that we are doing the optimal query we intend.
		// If the ORM has a change that changes this query, we want to verify we are still doing something we intend.
		$expected_query = '
			SELECT `ID` FROM `custom_prefix_posts` WHERE `ID` NOT IN (
				SELECT `object_id` FROM prefixyoast_indexable
				WHERE `prominent_words_version` = ?
				AND `object_type` = \'post\'
				AND `object_sub_type` IN ( ?,? )
			) AND `post_status` IN (?, ?, ?, ?, ?) AND `post_type` IN (?, ?) LIMIT 25';

		$expected_parameters = [
			101,
			'post_type1',
			'post_type2',
			'future',
			'draft',
			'pending',
			'private',
			'publish',
			'post_type1',
			'post_type2'
		];

		$return_rows = [
			[ 'ID' => 1 ],
			[ 'ID' => 2 ]
		];

		$this->expect_pdo_query(
			$expected_query,
			$expected_parameters,
			$return_rows
		);

		$ids = $this->repository->find_posts_with_outdated_prominent_words( 101, [ 'post_type1', 'post_type2' ], 25 );

		$this->assertEquals( [ 1, 2 ], $ids );
	}
}
