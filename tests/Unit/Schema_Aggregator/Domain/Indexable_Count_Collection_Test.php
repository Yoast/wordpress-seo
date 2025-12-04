<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Domain;

use Yoast\WP\SEO\Schema_Aggregator\Domain\Indexable_Count;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Indexable_Count_Collection;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Indexable_Count_Collection domain object.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Domain\Indexable_Count_Collection::__construct
 * @covers Yoast\WP\SEO\Schema_Aggregator\Domain\Indexable_Count_Collection::add_indexable_count
 * @covers Yoast\WP\SEO\Schema_Aggregator\Domain\Indexable_Count_Collection::get_indexable_counts
 */
final class Indexable_Count_Collection_Test extends TestCase {

	/**
	 * Tests if the constructor initializes an empty collection.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$instance = new Indexable_Count_Collection();

		$this->assertSame(
			[],
			$this->getPropertyValue( $instance, 'indexable_counts' )
		);
	}

	/**
	 * Tests that an empty collection returns an empty array.
	 *
	 * @return void
	 */
	public function test_get_indexable_counts_empty() {
		$instance = new Indexable_Count_Collection();

		$this->assertSame( [], $instance->get_indexable_counts() );
	}

	/**
	 * Tests adding a single Indexable_Count to the collection.
	 *
	 * @return void
	 */
	public function test_add_single_indexable_count() {
		$instance       = new Indexable_Count_Collection();
		$indexable_count = new Indexable_Count( 'post', 10 );

		$instance->add_indexable_count( $indexable_count );

		$result = $instance->get_indexable_counts();
		$this->assertCount( 1, $result );
		$this->assertSame( $indexable_count, $result[0] );
	}

	/**
	 * Tests adding multiple Indexable_Count objects to the collection.
	 *
	 * @return void
	 */
	public function test_add_multiple_indexable_counts() {
		$instance = new Indexable_Count_Collection();

		$count1 = new Indexable_Count( 'post', 10 );
		$count2 = new Indexable_Count( 'page', 5 );
		$count3 = new Indexable_Count( 'product', 20 );

		$instance->add_indexable_count( $count1 );
		$instance->add_indexable_count( $count2 );
		$instance->add_indexable_count( $count3 );

		$result = $instance->get_indexable_counts();
		$this->assertCount( 3, $result );
		$this->assertSame( $count1, $result[0] );
		$this->assertSame( $count2, $result[1] );
		$this->assertSame( $count3, $result[2] );
	}

	/**
	 * Tests that get_indexable_counts returns the correct type.
	 *
	 * @return void
	 */
	public function test_get_indexable_counts_returns_array() {
		$instance       = new Indexable_Count_Collection();
		$indexable_count = new Indexable_Count( 'post', 42 );

		$instance->add_indexable_count( $indexable_count );

		$result = $instance->get_indexable_counts();
		$this->assertIsArray( $result );
		$this->assertContainsOnlyInstancesOf( Indexable_Count::class, $result );
	}

	/**
	 * Tests that added items maintain their order.
	 *
	 * @return void
	 */
	public function test_collection_maintains_order() {
		$instance = new Indexable_Count_Collection();

		$count1 = new Indexable_Count( 'post', 1 );
		$count2 = new Indexable_Count( 'page', 2 );
		$count3 = new Indexable_Count( 'attachment', 3 );
		$count4 = new Indexable_Count( 'product', 4 );

		$instance->add_indexable_count( $count1 );
		$instance->add_indexable_count( $count2 );
		$instance->add_indexable_count( $count3 );
		$instance->add_indexable_count( $count4 );

		$result = $instance->get_indexable_counts();

		$this->assertSame( 1, $result[0]->get_count() );
		$this->assertSame( 2, $result[1]->get_count() );
		$this->assertSame( 3, $result[2]->get_count() );
		$this->assertSame( 4, $result[3]->get_count() );
	}
}
