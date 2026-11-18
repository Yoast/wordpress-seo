<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Meta_Tags_Context_Memoizer_Adapter;

use Mockery;
use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Meta_Tags_Context_Memoizer_Adapter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Meta_Tags_Context_Memoizer_Adapter::meta_tags_context_to_array() method.
 *
 * @group schema-aggregator
 *
 * @covers \Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Meta_Tags_Context_Memoizer_Adapter::meta_tags_context_to_array
 */
final class Meta_Tags_Context_To_Array_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Meta_Tags_Context_Memoizer_Adapter
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Meta_Tags_Context_Memoizer_Adapter();
	}

	/**
	 * Tests that meta_tags_context_to_array returns the schema array from the presentation.
	 *
	 * @return void
	 */
	public function test_meta_tags_context_to_array_returns_schema_array() {
		$expected_schema = [
			'@context' => 'https://schema.org',
			'@type'    => 'WebPage',
			'name'     => 'Test Page',
		];

		$presentation         = Mockery::mock( Indexable_Presentation::class );
		$presentation->schema = $expected_schema;

		$context               = Mockery::mock( Meta_Tags_Context::class );
		$context->presentation = $presentation;

		$result = $this->instance->meta_tags_context_to_array( $context );

		$this->assertSame( $expected_schema, $result );
	}

	/**
	 * Tests that meta_tags_context_to_array works with an empty schema array.
	 *
	 * @return void
	 */
	public function test_meta_tags_context_to_array_with_empty_schema() {
		$expected_schema = [];

		$presentation         = Mockery::mock( Indexable_Presentation::class );
		$presentation->schema = $expected_schema;

		$context               = Mockery::mock( Meta_Tags_Context::class );
		$context->presentation = $presentation;

		$result = $this->instance->meta_tags_context_to_array( $context );

		$this->assertSame( $expected_schema, $result );
	}

	/**
	 * Tests that meta_tags_context_to_array works with a complex nested schema array.
	 *
	 * @return void
	 */
	public function test_meta_tags_context_to_array_with_nested_schema() {
		$expected_schema = [
			'@context' => 'https://schema.org',
			'@graph'   => [
				[
					'@type' => 'Organization',
					'name'  => 'Test Org',
				],
				[
					'@type' => 'WebSite',
					'url'   => 'https://example.com',
				],
			],
		];

		$presentation         = Mockery::mock( Indexable_Presentation::class );
		$presentation->schema = $expected_schema;

		$context               = Mockery::mock( Meta_Tags_Context::class );
		$context->presentation = $presentation;

		$result = $this->instance->meta_tags_context_to_array( $context );

		$this->assertSame( $expected_schema, $result );
	}
}
