<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\User_Interface\Schemamap_Xml_Rewrite_Integration;

use Mockery;
use Yoast_Dynamic_Rewrites;

/**
 * Tests the Schemamap_Xml_Rewrite_Integration add_rewrite_rules method.
 *
 * @group schema-aggregator
 * @group Schemamap_Xml_Rewrite_Integration
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\User_Interface\Schemamap_Xml_Rewrite_Integration::add_rewrite_rules
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Add_Rewrite_Rules_Test extends Abstract_Schemamap_Xml_Rewrite_Integration_Test {

	/**
	 * Tests that the schema map rewrite rule is added at the top.
	 *
	 * @return void
	 */
	public function test_add_rewrite_rules() {
		$dynamic_rewrites = Mockery::mock( Yoast_Dynamic_Rewrites::class );

		$dynamic_rewrites->expects( 'add_rule' )
			->once()
			->with( 'schemamap\.xml$', 'index.php?yoast_schemamap=1', 'top' );

		$this->instance->add_rewrite_rules( $dynamic_rewrites );
	}
}
