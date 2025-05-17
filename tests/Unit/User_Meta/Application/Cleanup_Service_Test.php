<?php

namespace Yoast\WP\SEO\Tests\Unit\User_Meta\Application;

use Mockery;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\User_Meta\Application\Additional_Contactmethods_Collector;
use Yoast\WP\SEO\User_Meta\Application\Cleanup_Service;
use Yoast\WP\SEO\User_Meta\Application\Custom_Meta_Collector;
use Yoast\WP\SEO\User_Meta\Infrastructure\Cleanup_Repository;

/**
 * Tests the cleanup service.
 *
 * @group user-meta
 *
 * @coversDefaultClass \Yoast\WP\SEO\User_Meta\Application\Cleanup_Service
 */
final class Cleanup_Service_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Cleanup_Service
	 */
	private $instance;

	/**
	 * Holds additional contactmethods collector.
	 *
	 * @var Mockery\MockInterface|Additional_Contactmethods_Collector
	 */
	private $additional_contactmethods_collector;

	/**
	 * Holds mocked custom meta collector.
	 *
	 * @var Mockery\MockInterface|Custom_Meta_Collector
	 */
	private $custom_meta_collector;

	/**
	 * Holds mocked cleanup repository.
	 *
	 * @var Mockery\MockInterface|Cleanup_Repository
	 */
	private $cleanup_repository;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->additional_contactmethods_collector = Mockery::mock( Additional_Contactmethods_Collector::class );
		$this->custom_meta_collector               = Mockery::mock( Custom_Meta_Collector::class );
		$this->cleanup_repository                  = Mockery::mock( Cleanup_Repository::class );

		$this->instance = new Cleanup_Service(
			$this->additional_contactmethods_collector,
			$this->custom_meta_collector,
			$this->cleanup_repository
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
			Additional_Contactmethods_Collector::class,
			$this->getPropertyValue( $this->instance, 'additional_contactmethods_collector' )
		);
		$this->assertInstanceOf(
			Custom_Meta_Collector::class,
			$this->getPropertyValue( $this->instance, 'custom_meta_collector' )
		);
		$this->assertInstanceOf(
			Cleanup_Repository::class,
			$this->getPropertyValue( $this->instance, 'cleanup_repository' )
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
		$this->additional_contactmethods_collector
			->expects( 'get_additional_contactmethods_keys' )
			->once()
			->andReturn( [ 'facebook' ] );

		$this->custom_meta_collector
			->expects( 'get_non_empty_custom_meta' )
			->once()
			->andReturn( [ 'wpseo_noindex_author' ] );

		$meta_to_check = [
			'facebook',
			'wpseo_noindex_author',
		];
		$this->cleanup_repository
			->expects( 'delete_empty_usermeta_query' )
			->once()
			->with( $meta_to_check, 1000 )
			->andReturn( 10 );

		$expected_result = 10;
		$this->assertSame( $expected_result, $this->instance->cleanup_selected_empty_usermeta( 1000 ) );
	}
}
