<?php

namespace Yoast\WP\SEO\Tests\Unit\User_Meta\Infrastructure;

use Mockery;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\User_Meta\Infrastructure\Cleanup_Repository;

/**
 * Tests the cleanup repository.
 *
 * @group user-meta
 *
 * @coversDefaultClass \Yoast\WP\SEO\User_Meta\Infrastructure\Cleanup_Repository
 */
final class Cleanup_Repository_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Cleanup_Repository
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Cleanup_Repository();
	}

	/**
	 * Tests cleanup_selected_empty_usermeta.
	 *
	 * @covers ::cleanup_selected_empty_usermeta
	 * @covers ::get_meta_to_check
	 *
	 * @return void
	 */
	public function test_cleanup_selected_empty_usermeta() {
		$wpdb           = Mockery::mock( wpdb::class );
		$wpdb->usermeta = 'wp_usermeta';

		$meta_keys = [
			'facebook',
			'wpseo_noindex_author',
		];
		$limit     = 1000;

		$wpdb
			->expects( 'prepare' )
			->once()
			->with(
				'DELETE FROM %i
			WHERE meta_key IN ( %s, %s )
			AND meta_value = ""
			ORDER BY user_id
			LIMIT %d',
				[
					'wp_usermeta',
					'facebook',
					'wpseo_noindex_author',
					1000,
				]
			)
			->andReturn(
				'
				DELETE FROM %i
				WHERE meta_key IN( "facebook", "wpseo_noindex_author" )
				AND meta_value = ""
				ORDER BY user_id
				LIMIT 1000'
			);

		$wpdb
			->expects( 'query' )
			->once()
			->with(
				'
				DELETE FROM %i
				WHERE meta_key IN( "facebook", "wpseo_noindex_author" )
				AND meta_value = ""
				ORDER BY user_id
				LIMIT 1000'
			)
			->andReturn( 200 );

		$GLOBALS['wpdb'] = $wpdb;
		$this->assertSame( 200, $this->instance->delete_empty_usermeta_query( $meta_keys, $limit ) );
	}
}
