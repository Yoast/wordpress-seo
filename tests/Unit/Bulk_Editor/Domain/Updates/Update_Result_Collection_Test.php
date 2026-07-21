<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Domain\Updates;

use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Update_Error;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Update_Result;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Update_Result_Collection;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Test class for the Update_Result_Collection.
 *
 * @group Bulk_Editor
 *
 * @coversDefaultClass \Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Update_Result_Collection
 */
final class Update_Result_Collection_Test extends TestCase {

	/**
	 * Tests added results are returned in order.
	 *
	 * @covers ::add
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_add_and_get() {
		$instance = new Update_Result_Collection();

		$this->assertSame( [], $instance->get() );

		$first  = Update_Result::for_success( 1 );
		$second = Update_Result::for_failure( 2, Update_Error::NOT_FOUND );

		$instance->add( $first );
		$instance->add( $second );

		$this->assertSame( [ $first, $second ], $instance->get() );
	}

	/**
	 * Tests the array representation wraps the results under a results key.
	 *
	 * @covers ::to_array
	 *
	 * @return void
	 */
	public function test_to_array() {
		$instance = new Update_Result_Collection();
		$instance->add( Update_Result::for_success( 1 ) );
		$instance->add( Update_Result::for_failure( 2, Update_Error::FORBIDDEN ) );

		$this->assertSame(
			[
				'results' => [
					[
						'id'      => 1,
						'success' => true,
					],
					[
						'id'      => 2,
						'success' => false,
						'error'   => Update_Error::FORBIDDEN,
					],
				],
			],
			$instance->to_array(),
		);
	}
}
