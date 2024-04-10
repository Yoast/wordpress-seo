<?php

namespace Yoast\WP\SEO\Tests\Unit\User_Meta\Application;

use Mockery;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\User_Meta\Application\Additional_Contactmethods_Repository;
use Yoast\WP\SEO\User_Meta\Application\Cleanup_Repository;
use Yoast\WP\SEO\User_Meta\Application\Custom_Meta_Repository;

/**
 * Tests the cleanup repository.
 *
 * @group user-meta
 *
 * @coversDefaultClass \Yoast\WP\SEO\User_Meta\Application\Cleanup_Repository
 */
final class Cleanup_Repository_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Cleanup_Repository
	 */
	private $instance;

	/**
	 * Holds additional contactmethods repository.
	 *
	 * @var Mockery\MockInterface|Additional_Contactmethods_Repository
	 */
	private $additional_contactmethods_repository;

	/**
	 * Holds mocked custom meta repository.
	 *
	 * @var Mockery\MockInterface|Custom_Meta_Repository
	 */
	private $custom_meta_repository;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->additional_contactmethods_repository = Mockery::mock( Additional_Contactmethods_Repository::class );
		$this->custom_meta_repository               = Mockery::mock( Custom_Meta_Repository::class );

		$this->instance = new Cleanup_Repository(
			$this->additional_contactmethods_repository,
			$this->custom_meta_repository
		);
	}

	/**
	 * Tests constructor.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Additional_Contactmethods_Repository::class,
			$this->getPropertyValue( $this->instance, 'additional_contactmethods_repository' )
		);
		$this->assertInstanceOf(
			Custom_Meta_Repository::class,
			$this->getPropertyValue( $this->instance, 'custom_meta_repository' )
		);
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
		$this->additional_contactmethods_repository
			->expects( 'get_additional_contactmethods_keys' )
			->once()
			->andReturn( [ 'facebook' ] );

		$this->custom_meta_repository
			->expects( 'get_non_empty_custom_meta' )
			->once()
			->andReturn( [ 'wpseo_noindex_author' ] );

		$wpdb           = Mockery::mock( wpdb::class );
		$wpdb->usermeta = 'wp_usermeta';

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
		$this->assertSame( 200, $this->instance->cleanup_selected_empty_usermeta( 1000 ) );
	}
}
