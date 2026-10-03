<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\User_Interface\Schemamap_Xml_Rewrite_Integration;

/**
 * Tests the Schemamap_Xml_Rewrite_Integration add_query_vars method.
 *
 * @group schema-aggregator
 * @group Schemamap_Xml_Rewrite_Integration
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\User_Interface\Schemamap_Xml_Rewrite_Integration::add_query_vars
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Add_Query_Vars_Test extends Abstract_Schemamap_Xml_Rewrite_Integration_Test {

	/**
	 * Tests that the query variable is appended to an empty list.
	 *
	 * @return void
	 */
	public function test_add_query_vars_to_an_empty_list() {
		$this->assertSame( [ 'yoast_schemamap' ], $this->instance->add_query_vars( [] ) );
	}

	/**
	 * Tests that the existing query variables are preserved.
	 *
	 * @return void
	 */
	public function test_add_query_vars_preserves_existing_query_vars() {
		$this->assertSame(
			[ 'sitemap', 'sitemap_n', 'yoast_schemamap' ],
			$this->instance->add_query_vars( [ 'sitemap', 'sitemap_n' ] ),
		);
	}
}
