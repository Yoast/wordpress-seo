<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Indexable_Repository\Indexable_Repository_Factory;

/**
 * Tests for the Indexable_Repository_Factory::get_repository method.
 *
 * @covers \Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Indexable_Repository\Indexable_Repository_Factory::get_repository
 *
 * @group schema-aggregator
 */
final class Get_Repository_Test extends Abstract_Indexable_Repository_Factory_Test {

	/**
	 * Tests if get_repository returns the correct repository based on availability.
	 *
	 * @return void
	 */
	public function test_get_repository(): void {
		$repository = $this->instance->get_repository( true );
		$this->assertSame( $this->indexable_repository, $repository );

		$repository = $this->instance->get_repository( false );
		$this->assertSame( $this->wordpress_query_repository, $repository );
	}
}
