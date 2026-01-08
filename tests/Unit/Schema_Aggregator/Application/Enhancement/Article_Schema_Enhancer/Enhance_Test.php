<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Enhancement\Article_Schema_Enhancer;

use Mockery;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;

/**
 * Tests the Article_Schema_Enhancer class enhance_schema_piece method.
 *
 * @group schema-aggregator
 *
 * @coversDefaultClass \Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Article_Schema_Enhancer
 */
final class Enhance_Test extends Abstract_Article_Schema_Enhancer_Test {

	/**
	 * Test.
	 *
	 * @covers ::enhance
	 *
	 * @dataProvider enhance_data_provider
	 *
	 * @phpcs        :disable SlevomatCodingStandard.TypeHints.ParameterTypeHint.MissingTraversableTypeHintSpecification
	 *
	 * @param array<string, array<string, mixed>> $schema_data The schema piece data.
	 *
	 * @phpcs        :enable
	 *
	 * @return void
	 */
	public function test_enhance( $schema_data ) {
		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id = 123;

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
					'url'         => 'https://example.com',
					'articleBody' => 'Article content',
				],
			],
			'Wrong simple type'      => [
				[
					'url'         => 'https://example.com',
					'articleBody' => 'Article content',
					'@type'       => 'Article',
				],
			],
			'Type not allowed'       => [
				[
					'url'         => 'https://example.com',
					'articleBody' => 'Article content',
					'@type'       => 'Author',
				],
			],
			'Wrong array type'       => [
				[
					'url'         => 'https://example.com',
					'articleBody' => 'Article content',
					'@type'       => [ true, true, false ],
				],
			],
			'Array type not allowed' => [
				[
					'url'         => 'https://example.com',
					'articleBody' => 'Article content',
					'@type'       => [ 'Author', 'Dummy' ],
				],
			],
		];
	}
}
