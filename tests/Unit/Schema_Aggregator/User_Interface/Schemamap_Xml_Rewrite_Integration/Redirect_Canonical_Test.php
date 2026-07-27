<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\User_Interface\Schemamap_Xml_Rewrite_Integration;

use Brain\Monkey;

/**
 * Tests the Schemamap_Xml_Rewrite_Integration redirect_canonical method.
 *
 * @group schema-aggregator
 * @group Schemamap_Xml_Rewrite_Integration
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\User_Interface\Schemamap_Xml_Rewrite_Integration::redirect_canonical
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Redirect_Canonical_Test extends Abstract_Schemamap_Xml_Rewrite_Integration_Test {

	/**
	 * Tests that the canonical redirect is cancelled on a schema map request.
	 *
	 * @return void
	 */
	public function test_redirect_canonical_is_cancelled_for_the_schema_map() {
		Monkey\Functions\expect( 'get_query_var' )
			->once()
			->with( 'yoast_schemamap' )
			->andReturn( '1' );

		$this->assertFalse( $this->instance->redirect_canonical( 'https://example.com/schemamap.xml/' ) );
	}

	/**
	 * Tests that the canonical redirect is left alone on any other request.
	 *
	 * @return void
	 */
	public function test_redirect_canonical_is_untouched_for_other_requests() {
		Monkey\Functions\expect( 'get_query_var' )
			->once()
			->with( 'yoast_schemamap' )
			->andReturn( '' );

		$this->assertSame(
			'https://example.com/some-post/',
			$this->instance->redirect_canonical( 'https://example.com/some-post/' ),
		);
	}
}
