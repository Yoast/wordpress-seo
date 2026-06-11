<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Domain\Updates;

use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Post_Update;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Post_Update_Collection;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Test class for the Post_Update_Collection.
 *
 * @group Bulk_Editor
 *
 * @coversDefaultClass \Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Post_Update_Collection
 */
final class Post_Update_Collection_Test extends TestCase {

	/**
	 * Tests added updates are returned in order.
	 *
	 * @covers ::add
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_add_and_get() {
		$instance = new Post_Update_Collection();

		$this->assertSame( [], $instance->get() );

		$first  = new Post_Update( 1, 'First', null );
		$second = new Post_Update( 2, null, 'Second' );

		$instance->add( $first );
		$instance->add( $second );

		$this->assertSame( [ $first, $second ], $instance->get() );
	}
}
