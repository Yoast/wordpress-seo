<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Domain\Updates;

use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Batch_Limit;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Test class for the Batch_Limit rule.
 *
 * @group Bulk_Editor
 *
 * @coversDefaultClass \Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Batch_Limit
 */
final class Batch_Limit_Test extends TestCase {

	/**
	 * Tests the boundaries of the batch limit.
	 *
	 * @covers ::is_within_limit
	 *
	 * @return void
	 */
	public function test_is_within_limit() {
		$this->assertTrue( Batch_Limit::is_within_limit( 1 ) );
		$this->assertTrue( Batch_Limit::is_within_limit( Batch_Limit::MAX_ITEMS ) );
		$this->assertFalse( Batch_Limit::is_within_limit( Batch_Limit::MAX_ITEMS + 1 ) );
	}
}
