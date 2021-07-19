<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Integrations\Cleanup_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\Lib\Model;

/**
 * Class Cleanup_Integration_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Cleanup_Integration
 *
 * @group integrations
 */
class Cleanup_Integration_Test extends TestCase {

	/**
	 * Represents the instance we are testing.
	 *
	 * @var Mockery\MockInterface|Cleanup_Integration
	 */
	private $instance;

	/**
	 * Sets an instance for test purposes.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Cleanup_Integration();
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( Monkey\Actions\has( 'wpseo_cleanup_indexables', [ $this->instance, 'cleanup_obsolete_indexables' ] ), 'Does not have expected wpseo_cleanup_indexables filter' );
		$this->assertNotFalse( Monkey\Actions\has( 'wpseo_deactivate', [ $this->instance, 'unschedule_cron' ] ), 'Does not have expected wpseo_deactivate filter' );
	}

	/**
	 * Tests calling cleanup_obsolete_indexables.
	 *
	 * @covers ::cleanup_obsolete_indexables
	 */
	public function test_cleanup_obsolete_indexables() {
		global $wpdb;
		$indexable_table = 'wp_yoast_indexable';
		$limit           = 1000;
		$object_type     = 'post';
		$object_sub_type = 'shop_order';

		$wpdb         = Mockery::mock( 'wpdb' );
		$wpdb->prefix = 'wp_';
		$wpdb
			->shouldReceive( 'prepare' )
			->once()
			->with(
				"DELETE FROM $indexable_table WHERE object_type = %s AND object_sub_type = %s ORDER BY id LIMIT %d",
				$object_type,
				$object_sub_type,
				$limit
			)
			->andReturn( "DELETE FROM wp_yoast_indexable WHERE object_type = '" . $object_type . "' AND object_sub_type = '" . $object_sub_type . "' ORDER BY id LIMIT $limit" );

		$wpdb
			->shouldReceive( 'query' )
			->once()
			->with(
				"DELETE FROM wp_yoast_indexable WHERE object_type = 'post' AND object_sub_type = 'shop_order' ORDER BY id LIMIT 1000"
			)
			->andReturn( 1 );

		$this->instance->cleanup_obsolete_indexables( 'post', 'shop_order' );
	}
}
