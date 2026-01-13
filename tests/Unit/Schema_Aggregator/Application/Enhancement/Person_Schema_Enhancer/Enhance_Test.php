<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Enhancement\Person_Schema_Enhancer;

use Mockery;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;

/**
 * Tests the Person_Schema_Enhancer class enhance_schema_piece method.
 *
 * @group schema-aggregator
 */
final class Enhance_Test extends Abstract_Person_Schema_Enhancer_Test {

	/**
	 * Test.
	 *
	 * @covers \Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Person_Schema_Enhancer::enhance
	 *
	 * @dataProvider enhance_data_provider
	 *
	 * @param array<string, array<string, mixed>> $schema_data The schema piece data.
	 *
	 * @return void
	 */
	public function test_enhance( $schema_data ) {
		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->author_id = 123;

		$schema_piece = new Schema_Piece( $schema_data, 'Test' );
		$schema       = $this->instance->enhance( $schema_piece, $indexable );

		$this->assertEquals( $schema_data, $schema->get_data() );
	}

	/**
	 * Data provider for enhance_schema_piece testing.
	 *
	 * @return array<string, array<string, mixed>>
	 */
	public function enhance_data_provider(): array {
		return [
			'Type not set'           => [
				[
					'name'        => 'John Doe',
					'description' => 'Person description',
				],
			],
			'Wrong simple type'      => [
				[
					'name'        => 'John Doe',
					'description' => 'Person description',
					'@type'       => 'Person',
				],
			],
			'Type not allowed'       => [
				[
					'name'        => 'John Doe',
					'description' => 'Person description',
					'@type'       => 'Article',
				],
			],
			'Wrong array type'       => [
				[
					'name'        => 'John Doe',
					'description' => 'Person description',
					'@type'       => [ true, true, false ],
				],
			],
			'Array type not allowed' => [
				[
					'name'        => 'John Doe',
					'description' => 'Person description',
					'@type'       => [ 'Article', 'Dummy' ],
				],
			],
		];
	}
}
