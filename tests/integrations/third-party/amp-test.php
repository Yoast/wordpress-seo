<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Integrations\Third_Party
 */

namespace Yoast\WP\SEO\Tests\Integrations\Third_Party;

use Mockery;
use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Integrations\Front_End_Integration;
use Yoast\WP\SEO\Integrations\Third_Party\AMP;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * AMP integration test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Third_Party\AMP
 * @covers ::<!public>
 *
 * @group integrations
 * @group third-party
 */
class AMP_Test extends TestCase {

	/**
	 * The AMP integration.
	 *
	 * @var AMP
	 */
	protected $instance;

	/**
	 * The front end integration.
	 *
	 * @var Front_End_Integration
	 */
	protected $front_end;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		$this->front_end = Mockery::mock( Front_End_Integration::class );
		$this->instance  = new AMP( $this->front_end );
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Front_End_Conditional::class ],
			AMP::get_conditionals()
		);
	}

	/**
	 * Tests register hooks.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertTrue( \has_action( 'amp_post_template_head', [ $this->instance, 'remove_amp_meta_output' ] ), 'The remove AMP meta output function is registered.' );
		$this->assertTrue( \has_action( 'amp_post_template_head', [ $this->front_end, 'call_wpseo_head' ] ), 'The wpseo head action is registered.' );
	}

	/**
	 * Tests remove amp meta output.
	 *
	 * @covers ::remove_amp_meta_output
	 */
	public function test_remove_amp_meta_output() {
		\add_action( 'amp_post_template_head', 'amp_post_template_add_title' );
		\add_action( 'amp_post_template_head', 'amp_post_template_add_canonical' );
		\add_action( 'amp_post_template_head', 'amp_print_schemaorg_metadata' );

		$this->instance->remove_amp_meta_output();

		$this->assertFalse( \has_action( 'amp_post_template_head', 'amp_post_template_add_title' ), 'The AMP title action is not registered' );
		$this->assertFalse( \has_action( 'amp_post_template_head', 'amp_post_template_add_canonical' ), 'The AMP canonical action is not registered' );
		$this->assertFalse( \has_action( 'amp_post_template_head', 'amp_print_schemaorg_metadata' ), 'The AMP schema action is not registered' );
	}
}
