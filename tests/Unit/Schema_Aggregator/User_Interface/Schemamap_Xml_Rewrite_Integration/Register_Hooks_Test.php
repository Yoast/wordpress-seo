<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\User_Interface\Schemamap_Xml_Rewrite_Integration;

use Brain\Monkey;
use Mockery;
use ReflectionProperty;
use Yoast_Dynamic_Rewrites;

/**
 * Tests the Schemamap_Xml_Rewrite_Integration register_hooks method.
 *
 * @group schema-aggregator
 * @group Schemamap_Xml_Rewrite_Integration
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\User_Interface\Schemamap_Xml_Rewrite_Integration::register_hooks
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Register_Hooks_Test extends Abstract_Schemamap_Xml_Rewrite_Integration_Test {

	/**
	 * Sets up the WP_Rewrite global that Yoast_Dynamic_Rewrites::instance() needs.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		/*
		 * Yoast_Dynamic_Rewrites keeps a static instance that survives across tests in the same
		 * process, so it has to be reset before this test builds its own with the mock below.
		 */
		$this->reset_dynamic_rewrites();

		$wp_rewrite        = Mockery::mock( 'WP_Rewrite' );
		$wp_rewrite->index = 'index.php';
		$wp_rewrite->expects( 'add_rule' )->once();

		$GLOBALS['wp_rewrite'] = $wp_rewrite;
	}

	/**
	 * Resets the Yoast_Dynamic_Rewrites singleton so it does not leak its WP_Rewrite mock into other tests.
	 *
	 * @return void
	 */
	protected function tear_down() {
		$this->reset_dynamic_rewrites();

		unset( $GLOBALS['wp_rewrite'] );

		parent::tear_down();
	}

	/**
	 * Clears the Yoast_Dynamic_Rewrites static instance.
	 *
	 * @return void
	 */
	private function reset_dynamic_rewrites() {
		$instance = new ReflectionProperty( Yoast_Dynamic_Rewrites::class, 'instance' );
		$instance->setAccessible( true );
		$instance->setValue( null, null );
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse(
			Monkey\Filters\has( 'query_vars', [ $this->instance, 'add_query_vars' ] ),
		);
		$this->assertNotFalse(
			Monkey\Filters\has( 'redirect_canonical', [ $this->instance, 'redirect_canonical' ] ),
		);
		$this->assertNotFalse(
			Monkey\Actions\has( 'template_redirect', [ $this->instance, 'maybe_render_schema_map' ] ),
		);
	}
}
