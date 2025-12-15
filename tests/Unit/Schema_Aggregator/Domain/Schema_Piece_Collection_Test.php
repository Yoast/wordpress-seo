<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Domain;

use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece_Collection;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Schema_Piece_Collection domain object.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece_Collection::__construct
 * @covers Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece_Collection::add
 * @covers Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece_Collection::to_array
 */
final class Schema_Piece_Collection_Test extends TestCase {

	/**
	 * Tests if the constructor initializes an empty collection.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$instance = new Schema_Piece_Collection();

		$this->assertSame(
			[],
			$this->getPropertyValue( $instance, 'pieces' )
		);
	}

	/**
	 * Tests that an empty collection returns an empty array.
	 *
	 * @return void
	 */
	public function test_to_array_empty() {
		$instance = new Schema_Piece_Collection();

		$this->assertSame( [], $instance->to_array() );
	}

	/**
	 * Tests adding a single Schema_Piece to the collection.
	 *
	 * @return void
	 */
	public function test_add_single_schema_piece() {
		$instance     = new Schema_Piece_Collection();
		$schema_piece = new Schema_Piece( [ '@type' => 'Article', 'name' => 'Test Article' ], 'Article' );

		$instance->add( $schema_piece );

		$result = $instance->to_array();
		$this->assertCount( 1, $result );
		$this->assertSame( $schema_piece, $result[0] );
	}

	/**
	 * Tests adding multiple Schema_Piece objects to the collection.
	 *
	 * @return void
	 */
	public function test_add_multiple_schema_pieces() {
		$instance = new Schema_Piece_Collection();

		$piece1 = new Schema_Piece( [ '@type' => 'Article', 'name' => 'Article 1' ], 'Article' );
		$piece2 = new Schema_Piece( [ '@type' => 'Person', 'name' => 'John Doe' ], 'Person' );
		$piece3 = new Schema_Piece( [ '@type' => 'Organization', 'name' => 'Yoast' ], 'Organization' );

		$instance->add( $piece1 );
		$instance->add( $piece2 );
		$instance->add( $piece3 );

		$result = $instance->to_array();
		$this->assertCount( 3, $result );
		$this->assertSame( $piece1, $result[0] );
		$this->assertSame( $piece2, $result[1] );
		$this->assertSame( $piece3, $result[2] );
	}

	/**
	 * Tests that to_array returns the correct type.
	 *
	 * @return void
	 */
	public function test_to_array_returns_array() {
		$instance     = new Schema_Piece_Collection();
		$schema_piece = new Schema_Piece( [ '@type' => 'WebPage', 'name' => 'Test Page' ], 'WebPage' );

		$instance->add( $schema_piece );

		$result = $instance->to_array();
		$this->assertIsArray( $result );
		$this->assertContainsOnlyInstancesOf( Schema_Piece::class, $result );
	}

	/**
	 * Tests that added items maintain their order.
	 *
	 * @return void
	 */
	public function test_collection_maintains_order() {
		$instance = new Schema_Piece_Collection();

		$piece1 = new Schema_Piece( [ '@type' => 'Article', 'headline' => 'Article 1' ], 'Article' );
		$piece2 = new Schema_Piece( [ '@type' => 'Person', 'name' => 'Person 1' ], 'Person' );
		$piece3 = new Schema_Piece( [ '@type' => 'Organization', 'name' => 'Org 1' ], 'Organization' );
		$piece4 = new Schema_Piece( [ '@type' => 'WebPage', 'name' => 'Page 1' ], 'WebPage' );

		$instance->add( $piece1 );
		$instance->add( $piece2 );
		$instance->add( $piece3 );
		$instance->add( $piece4 );

		$result = $instance->to_array();

		$this->assertSame( 'Article', $result[0]->get_type() );
		$this->assertSame( 'Person', $result[1]->get_type() );
		$this->assertSame( 'Organization', $result[2]->get_type() );
		$this->assertSame( 'WebPage', $result[3]->get_type() );
	}

	/**
	 * Tests constructor with pre-populated array.
	 *
	 * @return void
	 */
	public function test_constructor_with_pieces() {
		$piece1 = new Schema_Piece( [ '@type' => 'Article', 'headline' => 'Test Article' ], 'Article' );
		$piece2 = new Schema_Piece( [ '@type' => 'Person', 'name' => 'Test Person' ], 'Person' );

		$instance = new Schema_Piece_Collection( [ $piece1, $piece2 ] );

		$result = $instance->to_array();
		$this->assertCount( 2, $result );
		$this->assertSame( $piece1, $result[0] );
		$this->assertSame( $piece2, $result[1] );
	}

	/**
	 * Tests that constructor with empty array works correctly.
	 *
	 * @return void
	 */
	public function test_constructor_with_empty_array() {
		$instance = new Schema_Piece_Collection( [] );

		$this->assertSame( [], $instance->to_array() );
	}
}