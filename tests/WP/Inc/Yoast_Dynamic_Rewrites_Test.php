<?php

namespace Yoast\WP\SEO\Tests\WP\Inc;

use Yoast\WP\SEO\Tests\WP\TestCase;
use Yoast_Dynamic_Rewrites;

/**
 * Unit Test Class.
 *
 * @coversDefaultClass Yoast_Dynamic_Rewrites
 */
final class Yoast_Dynamic_Rewrites_Test extends TestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var Yoast_Dynamic_Rewrites
	 */
	private static $instance;

	/**
	 * Set up the class which will be tested.
	 *
	 * @return void
	 */
	public static function set_up_before_class() {
		parent::set_up_before_class();
		global $wp_rewrite;

		self::$instance = new Yoast_Dynamic_Rewrites( $wp_rewrite );
	}

	/**
	 * Tests the `add_rule method when adding rules to the bottom of the list.
	 *
	 * @covers ::add_rule
	 * @covers ::filter_rewrite_rules_option
	 *
	 * @return void
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
	 * Tests the `add_rule` method when adding rules to the top of the list.
	 *
	 * @covers ::add_rule
	 * @covers ::filter_rewrite_rules_option
	 *
	 * @return void
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
	 * Tests add_rule method with empty query.
	 *
	 * @covers ::add_rule
	 * @covers ::filter_rewrite_rules_option
	 *
	 * @return void
	 */
	public function test_add_rule_without_query() {
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
