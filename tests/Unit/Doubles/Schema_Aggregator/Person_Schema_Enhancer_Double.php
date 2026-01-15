<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Schema_Aggregator;

use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Person_Schema_Enhancer;

/**
 * Test double used to expose Person_Schema_Enhancer::enhance_schema_piece method
 */
final class Person_Schema_Enhancer_Double extends Person_Schema_Enhancer {

	/**
	 * Enhance a single schema piece
	 *
	 * @param array<string> $schema_data The schema data to enhance.
	 * @param Indexable     $indexable   The indexable object that is the source of the schema piece.
	 *
	 * @return array<string> The enhanced schema data.
	 */
	public function enhance_schema_piece( array $schema_data, Indexable $indexable ): array {
		return parent::enhance_schema_piece( $schema_data, $indexable );
	}
}
