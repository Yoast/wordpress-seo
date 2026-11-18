<?php

namespace Yoast\WP\SEO\Tests\Unit\Inc;

use Brain\Monkey;
use Mockery;
use RuntimeException;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast_Dynamic_Rewrites;

/**
 * Unit Test Class.
 *
 * @coversDefaultClass Yoast_Dynamic_Rewrites
 */
final class Yoast_Dynamic_Rewrites_Test extends TestCase {

	/**
	 * Holds the rewrite class.
	 *
	 * @var WP_Rewrite
	 */
	private $wp_rewrite;

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var Yoast_Dynamic_Rewrites
	 */
	private $instance;

	/**
	 * Set up the class which will be tested.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();

		$this->wp_rewrite        = Mockery::mock( 'WP_Rewrite' );
		$this->wp_rewrite->index = 'index.php';

		$this->instance = new Yoast_Dynamic_Rewrites( $this->wp_rewrite );
	}

	/**
	 * Tear down the class which was tested.
	 *
	 * @return void
	 */
	protected function tear_down() {
		parent::tear_down();

		unset( $GLOBALS['wp_rewrite'] );
	}

	/**
	 * Test construct method.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_construct_with_runtime_exception() {
		$this->expectException( RuntimeException::class );
		$GLOBALS['wp_rewrite'] = null;
		$instance              = new Yoast_Dynamic_Rewrites();

		$this->assertNotEmpty( $instance->wp_rewrite, 'WP_Rewrite instance is not set.' );
		$this->assertInstanceOf( 'WP_Rewrite', $instance->wp_rewrite, 'WP_Rewrite instance is not set with the given parameter.' );
	}

	/**
	 * Test construct method.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_construct() {
		$GLOBALS['wp_rewrite'] = $this->wp_rewrite;
		$instance              = new Yoast_Dynamic_Rewrites();

		$this->assertNotEmpty( $instance->wp_rewrite, 'WP_Rewrite instance is not set as expected.' );
		$this->assertInstanceOf( 'WP_Rewrite', $instance->wp_rewrite, 'WP_Rewrite instance is not set with the given parameter.' );
	}

	/**
	 * Tests instance method.
	 *
	 * @covers ::instance
	 *
	 * @return void
	 */
	public function test_instance() {
		global $wp_rewrite;
		$wp_rewrite            = Mockery::mock( 'WP_Rewrite' );
		$GLOBALS['wp_rewrite'] = $wp_rewrite;
		$this->assertInstanceOf( 'Yoast_Dynamic_Rewrites', Yoast_Dynamic_Rewrites::instance(), 'Instance is not returned as expected.' );
	}

	/**
	 * Test register_hooks method.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( \has_action( 'init', [ $this->instance, 'trigger_dynamic_rewrite_rules_hook' ] ), 'Does not have expected init action.' );
		$this->assertNotFalse( \has_filter( 'option_rewrite_rules', [ $this->instance, 'filter_rewrite_rules_option' ] ), 'Does not have expected option_rewrite_rules filter.' );
		$this->assertNotFalse( \has_filter( 'sanitize_option_rewrite_rules', [ $this->instance, 'sanitize_rewrite_rules_option' ] ), 'Does not have expected sanitize_option_rewrite_rules filter.' );
	}

	/**
	 * Data provider for test_sanitize_rewrite_rules_option.
	 *
	 * @return array
	 */
	public static function data_provider_sanitize_rewrite_rules_option() {
		return [
			'Empty rewrite_rules' => [
				'rewrite_rules' => '',
				'expected'      => '',
			],
			'Rewrite_rules is an array' => [
				'rewrite_rules' => [ 'test' => '123' ],
				'expected'      => [ 'test' => '123' ],
			],
		];
	}

	/**
	 * Tests sanitize_rewrite_rules_option method.
	 *
	 * @covers ::sanitize_rewrite_rules_option
	 *
	 * @dataProvider data_provider_sanitize_rewrite_rules_option
	 *
	 * @param string|array $rewrite_rules Rewrite rules.
	 * @param string       $expected      Expected result.
	 *
	 * @return void
	 */
	public function test_sanitize_rewrite_rules_option( $rewrite_rules, $expected ) {

		$this->assertSame( $expected, $this->instance->sanitize_rewrite_rules_option( $rewrite_rules ) );
	}

	/**
	 * Data provider for test_filter_rewrite_rules_option.
	 *
	 * @return array
	 */
	public static function data_provider_filter_rewrite_rules_option() {
		return [
			'Empty rewrite_rules' => [
				'rewrite_rules' => '',
				'expected'      => '',
			],
			'Rewrite_rules is an array' => [
				'rewrite_rules' => [ 'test' => '123' ],
				'expected'      => [ 'test' => '123' ],
			],
		];
	}

	/**
	 * Tests filter_rewrite_rules_option method.
	 *
	 * @covers ::filter_rewrite_rules_option
	 *
	 * @dataProvider data_provider_filter_rewrite_rules_option
	 *
	 * @param string|array $rewrite_rules Rewrite rules.
	 * @param string       $expected      Expected result.
	 *
	 * @return void
	 */
	public function test_filter_rewrite_rules_option( $rewrite_rules, $expected ) {

		$this->assertSame( $expected, $this->instance->filter_rewrite_rules_option( $rewrite_rules ) );
	}

	/**
	 * Tests trigger_dynamic_rewrite_rules_hook method.
	 *
	 * @covers ::trigger_dynamic_rewrite_rules_hook
	 *
	 * @return void
	 */
	public function test_trigger_dynamic_rewrite_rules_hook() {
		Monkey\Functions\expect( 'do_action' )
			->once()
			->with( 'yoast_add_dynamic_rewrite_rules', $this->instance );

		$this->instance->trigger_dynamic_rewrite_rules_hook();
	}
}
