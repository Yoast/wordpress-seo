<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Domain\Updates;

use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Update_Type;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Test class for the Update_Type.
 *
 * @group Bulk_Editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Update_Type
 */
final class Update_Type_Test extends TestCase {

	/**
	 * Tests the search type reports as the search appearance.
	 *
	 * @return void
	 */
	public function test_search() {
		$type = Update_Type::search();

		$this->assertTrue( $type->is_search() );
		$this->assertFalse( $type->is_social() );
	}

	/**
	 * Tests the social type reports as the social appearance.
	 *
	 * @return void
	 */
	public function test_social() {
		$type = Update_Type::social();

		$this->assertTrue( $type->is_social() );
		$this->assertFalse( $type->is_search() );
	}
}
