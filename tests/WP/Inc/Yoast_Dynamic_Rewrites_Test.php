<?php

namespace Yoast\WP\SEO\Tests\WP\Inc;

use Yoast_Dynamic_Rewrites;
use Yoast\WP\SEO\Tests\WP\TestCase;


/**
 * Unit Test Class.
 *
 * @coversDefaultClass Yoast_Dynamic_Rewrites
 */
class Yoast_Dynamic_Rewrites_Test extends TestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var Yoast_Dynamic_Rewrites
	 */
	private static $instance;

	/**
	 * Set up the class which will be tested.
	 */
	public static function set_up_before_class() {
		parent::set_up_before_class();
		global $wp_rewrite;

		self::$instance = new Yoast_Dynamic_Rewrites( $wp_rewrite );
	}

	/**
	 * Test construct method.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->assertNotEmpty( self::$instance->wp_rewrite, 'WP_Rewrite instance is set.' );
		$this->assertInstanceOf( 'WP_Rewrite', self::$instance->wp_rewrite, 'WP_Rewrite instance is set with the given parameter.' );
	}

	/**
	 * Tests instance method.
	 *
	 * @covers ::instance
	 */
	public function test_instance() {
		global $wp_rewrite;
		$GLOBALS['wp_rewrite'] = $wp_rewrite;
		$this->assertInstanceOf( 'Yoast_Dynamic_Rewrites', Yoast_Dynamic_Rewrites::instance(), 'Instance is not returned as expected.' );
	}

	/**
	 * Test register_hooks method.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		self::$instance->register_hooks();

		$this->assertNotFalse( \has_action( 'init', [ self::$instance, 'trigger_dynamic_rewrite_rules_hook' ] ), 'Does not have expected init action.' );
		$this->assertNotFalse( \has_filter( 'option_rewrite_rules', [ self::$instance, 'filter_rewrite_rules_option' ] ), 'Does not have expected option_rewrite_rules filter.' );
		$this->assertNotFalse( \has_filter( 'sanitize_option_rewrite_rules', [ self::$instance, 'sanitize_rewrite_rules_option' ] ), 'Does not have expected sanitize_option_rewrite_rules filter.' );
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

		$this->assertSame( $expected, self::$instance->sanitize_rewrite_rules_option( $rewrite_rules ) );
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
		$this->assertSame( $expected, self::$instance->filter_rewrite_rules_option( $rewrite_rules ) );
	}

	/**
	 * Tests add_rule method.
	 *
	 * @covers ::add_rule
	 * @covers ::filter_rewrite_rules_option
	 */
	public function test_add_rule_bottom() {
		$regex    = 'sitemap_index\.xml$';
		$query    = 'index.php?sitemap=1';
		$priority = 'bottom';
		$expected = [
			'test'                => '123',
			'sitemap_index\.xml$' => 'index.php?sitemap=1',
		];

		self::$instance->add_rule( $regex, $query, $priority );
		$rewrite_rules = [ 'test' => '123' ];
		$result        = self::$instance->filter_rewrite_rules_option( $rewrite_rules );

		$this->assertSame( $result, $expected );
	}

	/**
	 * Tests add_rule method.
	 *
	 * @covers ::add_rule
	 * @covers ::filter_rewrite_rules_option
	 */
	public function test_add_rule_top() {
		$regex    = 'sitemap_index\.xml$';
		$query    = 'index.php?sitemap=1';
		$priority = 'top';
		$expected = [
			'sitemap_index\.xml$' => 'index.php?sitemap=1',
			'test'                => '123',
		];

		self::$instance->add_rule( $regex, $query, $priority );
		$rewrite_rules = [ 'test' => '123' ];
		$result        = self::$instance->filter_rewrite_rules_option( $rewrite_rules );

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
		$priority = 'top';
		$expected = [
			'sitemap_index\.xml$' => 'index.php?sitemap=1',
			'test'                => '123',
		];

		self::$instance->add_rule( $regex, [], $priority );
		$rewrite_rules = [ 'test' => '123' ];
		$result        = self::$instance->filter_rewrite_rules_option( $rewrite_rules );

		$this->assertSame( $result, $expected );
	}
}
