<?php
// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\WP\Schema_Aggregator\User_Interface;

use Mockery;
use Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Map\Schema_Map_Xml_Provider;
use Yoast\WP\SEO\Schema_Aggregator\User_Interface\Schemamap_Xml_Rewrite_Integration;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Integration tests for the Schemamap_Xml_Rewrite_Integration.
 *
 * @group  schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\User_Interface\Schemamap_Xml_Rewrite_Integration::register_hooks
 * @covers Yoast\WP\SEO\Schema_Aggregator\User_Interface\Schemamap_Xml_Rewrite_Integration::add_rewrite_rules
 * @covers Yoast\WP\SEO\Schema_Aggregator\User_Interface\Schemamap_Xml_Rewrite_Integration::add_query_vars
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Schemamap_Xml_Rewrite_Integration_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Schemamap_Xml_Rewrite_Integration
	 */
	private $instance;

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		\YoastSEO()->helpers->options->set( 'enable_schema_aggregation_endpoint', true );

		/*
		 * The provider is only ever a constructor dependency, so the DI compiler inlines it and it
		 * cannot be fetched from the container. These tests cover routing rather than the document,
		 * which Site_Schema_Aggregator_Xml_Route_Test already exercises against the real provider.
		 */
		$this->instance = new Schemamap_Xml_Rewrite_Integration(
			Mockery::mock( Schema_Map_Xml_Provider::class ),
			\YoastSEO()->helpers->redirect,
		);

		$this->set_permalink_structure( '/%postname%/' );
		$this->instance->register_hooks();

		/*
		 * go_to() runs the main query, which would reach the render callback and exit the PHPUnit
		 * process. The rewrite rule and the query var are what these tests assert, so the callback
		 * is unhooked; rendering is covered by the unit tests.
		 */
		\remove_action( 'pre_get_posts', [ $this->instance, 'maybe_render_schema_map' ], 1 );
	}

	/**
	 * Restores the default permalink structure.
	 *
	 * @return void
	 */
	public function tear_down() {
		$this->set_permalink_structure( '' );

		parent::tear_down();
	}

	/**
	 * Tests that the rewrite rule is applied to the rewrite rules option.
	 *
	 * @return void
	 */
	public function test_rewrite_rule_is_registered() {
		global $wp_rewrite;

		$this->assertArrayHasKey( 'schemamap\.xml$', $wp_rewrite->wp_rewrite_rules() );
		$this->assertSame(
			'index.php?yoast_schemamap=1',
			$wp_rewrite->wp_rewrite_rules()['schemamap\.xml$'],
		);
	}

	/**
	 * Tests that a request for the schema map resolves to the query variable.
	 *
	 * @return void
	 */
	public function test_request_sets_the_query_var() {
		$this->go_to( \home_url( '/schemamap.xml' ) );

		$this->assertFalse( \is_404() );
		$this->assertSame( '1', \get_query_var( 'yoast_schemamap' ) );
	}

	/**
	 * Tests that a trailing slash still resolves to the query variable.
	 *
	 * @return void
	 */
	public function test_trailing_slash_request_sets_the_query_var() {
		$this->go_to( \home_url( '/schemamap.xml/' ) );

		$this->assertFalse( \is_404() );
		$this->assertSame( '1', \get_query_var( 'yoast_schemamap' ) );
	}

	/**
	 * Tests that the schema map is not routed when pretty permalinks are off.
	 *
	 * This documents the known limitation: rewrite rules do not run under plain permalinks, so
	 * discovery falls back to the REST endpoint there.
	 *
	 * @return void
	 */
	public function test_plain_permalinks_do_not_route() {
		$this->set_permalink_structure( '' );

		$this->go_to( \home_url( '/schemamap.xml' ) );

		$this->assertSame( '', \get_query_var( 'yoast_schemamap' ) );
	}
}
