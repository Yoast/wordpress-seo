<?php

namespace Yoast\WP\SEO\Tests\Unit\Inc;

use Mockery;
use Brain\Monkey;
use Yoast_Dynamic_Rewrites;
use RuntimeException;
use Yoast\WP\SEO\Tests\Unit\TestCase;


/**
 * Unit Test Class.
 *
 * @coversDefaultClass Yoast_Dynamic_Rewrites
 */
class Yoast_Dynamic_Rewrites_Test extends TestCase {

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
	 */
	protected function tear_down() {
		parent::tear_down();

		unset( $GLOBALS['wp_rewrite'] );
	}

	/**
	 * Test construct method.
	 *
	 * @covers ::__construct
	 */
	public function test_construct_with_runtime_exception() {
		$this->expectException( RuntimeException::class );
		$GLOBALS['wp_rewrite'] = null;
		$instance = new Yoast_Dynamic_Rewrites();

		$this->assertNotEmpty( $instance->wp_rewrite, 'WP_Rewrite instance is not set.' );
		$this->assertInstanceOf( 'WP_Rewrite', $instance->wp_rewrite, 'WP_Rewrite instance is not set with the given parameter.' );
	}

	/**
	 * Test construct method.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$GLOBALS['wp_rewrite'] = $this->wp_rewrite;
		$instance              = new Yoast_Dynamic_Rewrites();

		$this->assertNotEmpty( $instance->wp_rewrite, 'WP_Rewrite instance is set.' );
		$this->assertInstanceOf( 'WP_Rewrite', $instance->wp_rewrite, 'WP_Rewrite instance is set with the given parameter.' );
	}

	/**
	 * Tests instance method.
	 *
	 * @covers ::instance
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
	 * @param string       $expected Expected result.
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
	 * @param string       $expected Expected result.
	 */
	public function test_filter_rewrite_rules_option( $rewrite_rules, $expected ) {

		$this->assertSame( $expected, $this->instance->filter_rewrite_rules_option( $rewrite_rules ) );
	}

	/**
	 * Tests trigger_dynamic_rewrite_rules_hook method.
	 *
	 * @covers ::trigger_dynamic_rewrite_rules_hook
	 */
	public function test_trigger_dynamic_rewrite_rules_hook() {
		Monkey\Functions\expect( 'do_action' )
			->once()
			->with( 'yoast_add_dynamic_rewrite_rules', $this->instance );

		$this->instance->trigger_dynamic_rewrite_rules_hook();
	}

	/**
	 * Data provider for test_add_rule.
	 *
	 * @return array
	 */
	public static function data_provider_add_rule() {

		return [
			'Priority is top' => [
				'regex'    => 'sitemap_index\.xml$',
				'query'    => 'index.php?sitemap=1',
				'priority' => 'top',
				'index'    => 'index.php',
				'expected' => [
					'sitemap_index\.xml$' => 'index.php?sitemap=1',
					'test'                => '123',
				],
			],
			'Priority is bottom' => [
				'regex'    => 'sitemap_index\.xml$',
				'query'    => 'index.php?sitemap=1',
				'priority' => 'bottom',
				'index'    => 'index.php',
				'expected' => [
					'test'                => '123',
					'sitemap_index\.xml$' => 'index.php?sitemap=1',
				],
			],
			'Do not further handle external rules' => [
				'regex'    => 'sitemap_index\.xml$',
				'query'    => 'index.php?sitemap=1',
				'priority' => 'bottom',
				'index'    => 'nothing.php',
				'expected' => [
					'test'                => '123',
				],
			],
		];
	}

	/**
	 * Tests add_rule method.
	 *
	 * @covers ::add_rule
	 * @covers ::filter_rewrite_rules_option
	 *
	 * @dataProvider data_provider_add_rule
	 *
	 * @param string $regex Regex.
	 * @param string $query Query.
	 * @param string $priority Priority.
	 * @param string $index Index.
	 * @param string $expected Expected result.
	 */
	public function test_add_rule( $regex, $query, $priority, $index, $expected ) {

		$this->wp_rewrite
			->expects( 'add_rule' )
			->once()
			->with( $regex, $query, $priority );

		$this->wp_rewrite->index = $index;

		$this->instance->add_rule( $regex, $query, $priority );
		$rewrite_rules = [ 'test' => '123' ];
		$result        = $this->instance->filter_rewrite_rules_option( $rewrite_rules );

		$this->assertSame( $result, $expected );
	}

	/**
	 * Tests add_rule method.
	 *
	 * @covers ::add_rule
	 * @covers ::filter_rewrite_rules_option
	 */
	public function test_add_rule_with_query() {
		$regex    = 'sitemap_index\.xml$';
		$query    = 'index.php?sitemap=1';
		$priority = 'bottom';
		$expected = [
			'test'                => '123',
			'sitemap_index\.xml$' => 'index.php?sitemap=1',
		];

		Monkey\Functions\expect( 'add_query_arg' )
			->once()
			->with( [], 'index.php' )
			->andReturn( $query );

		$this->wp_rewrite
			->expects( 'add_rule' )
			->once()
			->with( $regex, $query, $priority );

		$this->instance->add_rule( $regex, [], $priority );

		$rewrite_rules = [ 'test' => '123' ];
		$result        = $this->instance->filter_rewrite_rules_option( $rewrite_rules );

		$this->assertSame( $result, $expected );
	}
}
