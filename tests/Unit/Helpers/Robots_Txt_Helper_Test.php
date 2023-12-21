<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Yoast\WP\SEO\Helpers\Robots_Txt_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Robots_Txt_Helper_Test
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Robots_Txt_Helper
 */
final class Robots_Txt_Helper_Test extends TestCase {

	/**
	 * Holds the Robots_Txt_Helper.
	 *
	 * @var Robots_Txt_Helper
	 */
	private $instance;

	/**
	 * Set up test case.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->instance = new Robots_Txt_Helper();
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_construct() {
		$this->assertIsObject(
			$this->getPropertyValue( $this->instance, 'robots_txt_user_agents' )
		);
		$this->assertIsArray(
			$this->getPropertyValue( $this->instance, 'robots_txt_sitemaps' )
		);
	}

	/**
	 * Tests if add_disallow works as expected.
	 *
	 * @dataProvider add_disallow_dataprovider
	 *
	 * @covers ::add_disallow
	 *
	 * @param array $arguments The arguments to be passed to the function.
	 * @param array $expected  The expected result.
	 *
	 * @return void
	 */
	public function test_add_disallow( $arguments, $expected ) {
		foreach ( $arguments as $argument ) {
			$this->instance->add_disallow( $argument[0], $argument[1] );
		}

		$this->assertEquals( $expected, $this->instance->get_disallow_directives() );
	}

	/**
	 * Data provider for test_add_disallow.
	 *
	 * @return array Data to use for test_add_disallow.
	 */
	public static function add_disallow_dataprovider() {
		$single_disallow_rule                         = [
			'arguments' => [
				[ '*', '/admin.php' ],
			],
			'expected' => [
				'*' => [
					'/admin.php',
				],
			],
		];
		$multiple_disallow_rules_same_user_agent      = [
			'arguments' => [
				[ '*', '/admin.php' ],
				[ '*', '/post/23' ],
				[ '*', '/page/1' ],
			],
			'expected' => [
				'*' => [
					'/admin.php',
					'/post/23',
					'/page/1',
				],
			],
		];
		$multiple_disallow_rules_multiple_user_agents = [
			'arguments' => [
				[ '*', '/admin.php' ],
				[ '*', '/post/23' ],
				[ 'Googlebot', '/page/1' ],
				[ 'Googlebot', '/page/13' ],
			],
			'expected' => [
				'*' => [
					'/admin.php',
					'/post/23',
				],
				'Googlebot' => [
					'/page/1',
					'/page/13',
				],
			],
		];
		$duplicate_disallow_rule                      = [
			'arguments' => [
				[ '*', '/admin.php' ],
				[ '*', '/admin.php' ],
			],
			'expected' => [
				'*' => [
					'/admin.php',
				],
			],
		];
		return [
			'Single disallow rule'                             => $single_disallow_rule,
			'Multiple disallow rules for the same user agent'  => $multiple_disallow_rules_same_user_agent,
			'Multiple disallow rules for multiple user agents' => $multiple_disallow_rules_multiple_user_agents,
			'Duplicate disallow rule'                          => $duplicate_disallow_rule,
		];
	}

	/**
	 * Tests if add_allow works as expected.
	 *
	 * @dataProvider add_allow_dataprovider
	 *
	 * @covers ::add_allow
	 *
	 * @param array $arguments The arguments to be passed to the function.
	 * @param array $expected  The expected result.
	 *
	 * @return void
	 */
	public function test_add_allow( $arguments, $expected ) {
		foreach ( $arguments as $argument ) {
			$this->instance->add_allow( $argument[0], $argument[1] );
		}

		$this->assertEquals( $expected, $this->instance->get_allow_directives() );
	}

	/**
	 * Data provider for test_add_allow.
	 *
	 * @return array Data to use for test_add_allow.
	 */
	public static function add_allow_dataprovider() {
		$single_allow_rule                         = [
			'arguments' => [
				[ '*', '/admin.php' ],
			],
			'expected' => [
				'*' => [
					'/admin.php',
				],
			],
		];
		$multiple_allow_rules_same_user_agent      = [
			'arguments' => [
				[ '*', '/admin.php' ],
				[ '*', '/post/23' ],
				[ '*', '/page/1' ],
			],
			'expected' => [
				'*' => [
					'/admin.php',
					'/post/23',
					'/page/1',
				],
			],
		];
		$multiple_allow_rules_multiple_user_agents = [
			'arguments' => [
				[ '*', '/admin.php' ],
				[ '*', '/post/23' ],
				[ 'Googlebot', '/page/1' ],
				[ 'Googlebot', '/page/13' ],
			],
			'expected' => [
				'*' => [
					'/admin.php',
					'/post/23',
				],
				'Googlebot' => [
					'/page/1',
					'/page/13',
				],
			],
		];
		$duplicate_allow_rule                      = [
			'arguments' => [
				[ '*', '/admin.php' ],
				[ '*', '/admin.php' ],
			],
			'expected' => [
				'*' => [
					'/admin.php',
				],
			],
		];
		return [
			'Single allow rule'                             => $single_allow_rule,
			'Multiple allow rules for the same user agent'  => $multiple_allow_rules_same_user_agent,
			'Multiple allow rules for multiple user agents' => $multiple_allow_rules_multiple_user_agents,
			'Duplicate allow rule'                          => $duplicate_allow_rule,
		];
	}

	/**
	 * Tests if add_sitemap works as expected.
	 *
	 * @dataProvider add_sitemap_dataprovider
	 *
	 * @covers ::add_allow
	 *
	 * @param array $sitemaps The sitemaps to be passed to the function.
	 * @param array $expected The expected result.
	 *
	 * @return void
	 */
	public function test_add_sitemap( $sitemaps, $expected ) {
		foreach ( $sitemaps as $sitemap ) {
			$this->instance->add_sitemap( $sitemap );
		}

		$this->assertEquals( $expected, $this->instance->get_sitemap_rules() );
	}

	/**
	 * Data provider for test_add_sitemap.
	 *
	 * @return array Data to use for test_add_sitemap.
	 */
	public static function add_sitemap_dataprovider() {
		$single_sitemap    = [
			'sitemaps' => [
				'http://sitemap.com/sitemap_index.xml',
			],
			'expected' => [
				'http://sitemap.com/sitemap_index.xml',
			],
		];
		$multiple_sitemaps = [
			'sitemaps' => [
				'http://sitemap.com/sitemap_index.xml',
				'http://example.com/sitemap_index.xml',
				'http://google.com/sitemap.xml',
			],
			'expected' => [
				'http://sitemap.com/sitemap_index.xml',
				'http://example.com/sitemap_index.xml',
				'http://google.com/sitemap.xml',
			],
		];
		$duplicate_sitemap = [
			'sitemaps' => [
				'http://sitemap.com/sitemap_index.xml',
				'http://sitemap.com/sitemap_index.xml',
				'http://google.com/sitemap.xml',
			],
			'expected' => [
				'http://sitemap.com/sitemap_index.xml',
				'http://google.com/sitemap.xml',
			],
		];
		return [
			'Single sitemap'    => $single_sitemap,
			'Multiple sitemaps' => $multiple_sitemaps,
			'Duplicate sitemap' => $duplicate_sitemap,
		];
	}
}
