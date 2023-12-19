<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Integrations\Duplicate_Post_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Duplicate_Post_Integration_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Duplicate_Post_Integration
 *
 * @group integrations
 */
final class Duplicate_Post_Integration_Test extends TestCase {

	/**
	 * Represents the instance we are testing.
	 *
	 * @var Mockery\MockInterface|Duplicate_Post_Integration
	 */
	private $instance;

	/**
	 * Sets an instance for test purposes.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Duplicate_Post_Integration();
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( Monkey\Filters\has( 'duplicate_post_excludelist_filter', [ $this->instance, 'exclude_zapier_meta' ] ), 'Does not have expected duplicate_post_excludelist_filter filter' );
	}

	/**
	 * Tests calling exclude_zapier_meta.
	 *
	 * @covers ::exclude_zapier_meta
	 *
	 * @return void
	 */
	public function test_exclude_zapier_meta() {
		$meta_excludelist = [
			'_edit_lock',
			'_edit_last',
		];
		$this->assertSame(
			[
				'_edit_lock',
				'_edit_last',
				'zapier_trigger_sent',
			],
			$this->instance->exclude_zapier_meta( $meta_excludelist )
		);
	}
}
