<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Schema_Pieces\Edd_Schema_Piece_Repository;

/**
 * Test class for the supports method.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Pieces\Edd_Schema_Piece_Repository::supports
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Edd_Schema_Piece_Repository_Supports_Test extends Abstract_Edd_Schema_Piece_Repository_Test {

	/**
	 * Tests that supports returns true for download post type when EDD is active.
	 *
	 * @return void
	 */
	public function test_supports_returns_true_for_download_when_edd_active() {
		$this->edd_conditional
			->expects( 'is_met' )
			->once()
			->andReturn( true );

		$result = $this->instance->supports( 'download' );

		$this->assertTrue( $result );
	}

	/**
	 * Tests that supports returns false for download post type when EDD is not active.
	 *
	 * @return void
	 */
	public function test_supports_returns_false_for_download_when_edd_not_active() {
		$this->edd_conditional
			->expects( 'is_met' )
			->once()
			->andReturn( false );

		$result = $this->instance->supports( 'download' );

		$this->assertFalse( $result );
	}

	/**
	 * Tests that supports returns false for non-download post types when EDD is active.
	 *
	 * @return void
	 */
	public function test_supports_returns_false_for_non_download_post_type_when_edd_active() {
		$this->edd_conditional
			->expects( 'is_met' )
			->once()
			->andReturn( true );

		$result = $this->instance->supports( 'post' );

		$this->assertFalse( $result );
	}

	/**
	 * Tests that supports returns false for non-download post types when EDD is not active.
	 *
	 * @return void
	 */
	public function test_supports_returns_false_for_non_download_post_type_when_edd_not_active() {
		$this->edd_conditional
			->expects( 'is_met' )
			->once()
			->andReturn( false );

		$result = $this->instance->supports( 'post' );

		$this->assertFalse( $result );
	}

	/**
	 * Tests that supports returns false for product post type when EDD is active.
	 *
	 * @return void
	 */
	public function test_supports_returns_false_for_product_post_type_when_edd_active() {
		$this->edd_conditional
			->expects( 'is_met' )
			->once()
			->andReturn( true );

		$result = $this->instance->supports( 'product' );

		$this->assertFalse( $result );
	}

	/**
	 * Tests that supports returns false for product post type when EDD is not active.
	 *
	 * @return void
	 */
	public function test_supports_returns_false_for_product_post_type_when_edd_not_active() {
		$this->edd_conditional
			->expects( 'is_met' )
			->once()
			->andReturn( false );

		$result = $this->instance->supports( 'product' );

		$this->assertFalse( $result );
	}
}
