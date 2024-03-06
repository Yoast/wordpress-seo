<?php

namespace Yoast\WP\SEO\Tests\WP\Generators\Schema;

use WP_Query;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Builders\Indexable_System_Page_Builder;
use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Generators\Schema\WebPage;
use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;
use Yoast\WP\SEO\Memoizers\Presentation_Memoizer;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\WP\TestCase;
use Yoast\WP\SEO\Values\Indexables\Indexable_Builder_Versions;

/**
 * Integration Test Class.
 *
 * @coversDefaultClass Yoast\WP\SEO\Generators\Schema\WebPage
 */
final class WebPage_Test extends TestCase {

	/**
	 * The Meta tags context memoizer.
	 *
	 * @var Meta_Tags_Context_Memoizer
	 */
	protected $meta_tags_context_memoizer;

	/**
	 * The generator to test.
	 *
	 * @var WebPage
	 */
	private $instance;

	/**
	 * The meta tags context.
	 *
	 * @var Meta_Tags_Context_Memoizer
	 */
	private $context;

	/**
	 * The indexable system page builder.
	 *
	 * @var Indexable_System_Page_Builder
	 */
	private $indexable_system_page_builder;

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->indexable_system_page_builder = new Indexable_System_Page_Builder(
			\YoastSEO()->helpers->options,
			\YoastSEO()->classes->get( Indexable_Builder_Versions::class )
		);
		$this->meta_tags_context_memoizer    = new Meta_Tags_Context_Memoizer(
			\YoastSEO()->helpers->blocks,
			\YoastSEO()->helpers->current_page,
			\YoastSEO()->classes->get( Indexable_Repository::class ),
			\YoastSEO()->classes->get( Meta_Tags_Context::class ),
			\YoastSEO()->classes->get( Presentation_Memoizer::class )
		);
	}

	/**
	 * Tests that @id and url properties of the WebPage schema piece are correctly encoded.
	 *
	 * @covers ::generate
	 *
	 * @return void
	 */
	public function test_search_url_with_multiple_keywords() {
		global $wp_query, $wp_the_query;

		$wp_query     = new WP_Query( [ 's' => 'test search' ] );
		$wp_the_query = $wp_query;

		$indexable       = new Indexable();
		$indexable->orm  = ORM::for_table( 'wp_yoast_indexable' );
		$built_indexable = $this->indexable_system_page_builder->build( 'search-result', $indexable );

		$this->context = $this->meta_tags_context_memoizer->get( $built_indexable, 'system-page' );

		$this->instance          = \YoastSEO()->classes->get( WebPage::class );
		$this->instance->context = $this->context;
		$this->instance->helpers = \YoastSEO()->helpers;
		$webpage_schema_piece    = $this->instance->generate();

		$expected = \trailingslashit( \home_url() ) . '?s=test%20search';

		$this->assertEquals( $expected, $webpage_schema_piece['@id'] );
		$this->assertEquals( $expected, $webpage_schema_piece['url'] );
	}

	/**
	 * Tests that @id and url properties of the WebPage schema piece are correctly encoded when no canonical is set.
	 *
	 * @covers ::generate
	 *
	 * @return void
	 */
	public function test_search_url_with_multiple_keywords_no_canonical_set() {
		global $wp_query, $wp_the_query;

		$wp_query     = new WP_Query( [ 's' => 'test search' ] );
		$wp_the_query = $wp_query;

		$indexable       = new Indexable();
		$indexable->orm  = ORM::for_table( 'wp_yoast_indexable' );
		$built_indexable = $this->indexable_system_page_builder->build( 'search-result', $indexable );

		$this->context            = $this->meta_tags_context_memoizer->get( $built_indexable, 'system-page' );
		$this->context->canonical = '';

		$this->instance          = \YoastSEO()->classes->get( WebPage::class );
		$this->instance->context = $this->context;
		$this->instance->helpers = \YoastSEO()->helpers;
		$webpage_schema_piece    = $this->instance->generate();

		$expected = \trailingslashit( \home_url() ) . '?s=test%20search';

		$this->assertEquals( $expected, $webpage_schema_piece['@id'] );
		$this->assertEquals( $expected, $webpage_schema_piece['url'] );
	}
}
