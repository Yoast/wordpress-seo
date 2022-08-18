<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters;

use Mockery;
use Yoast\WP\SEO\Helpers\Robots_Txt_Helper;
use Yoast\WP\SEO\Presenters\Robots_Txt_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Robots_Txt_Presenter_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Robots_Txt_Presenter
 *
 * @group presenters
 */
class Robots_Txt_Presenter_Test extends TestCase {

	/**
	 * The robots txt helper.
	 *
	 * @var Robots_Txt_Helper|Mockery\MockInterface
	 */
	protected $robots_txt_helper;

	/**
	 * The robots txt presenter instance.
	 *
	 * @var Robots_Txt_Presenter
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

		$this->robots_txt_helper = Mockery::mock( Robots_Txt_Helper::class );

		$this->instance = new Robots_Txt_Presenter( $this->robots_txt_helper );
	}

	/**
	 * Test the present function.
	 *
	 * @param array  $disallow_directives Output for the registered disallow directives.
	 * @param array  $allow_directives Output for the registered allow directives.
	 * @param array  $sitemaps Output for the registered sitemaps.
	 * @param string $expected The expected output to be written to robots.txt.
	 *
	 * @dataProvider present_dataprovider
	 *
	 * @covers ::present
	 */
	public function test_present( $disallow_directives, $allow_directives, $sitemaps, $expected ) {
		$this->robots_txt_helper
			->expects( 'get_disallow_directives' )
			->andReturn( $disallow_directives );

		$this->robots_txt_helper
			->expects( 'get_allow_directives' )
			->andReturn( $allow_directives );

		$this->robots_txt_helper
			->expects( 'get_sitemap_rules' )
			->andReturn( $sitemaps );

		$this->assertEquals(
			$expected,
			$this->instance->present()
		);
	}

	/**
	 * Data provider for test_present.
	 *
	 * @return array The data used for test_present.
	 */
	public function present_dataprovider() {
		$no_disallow_allow_directives_registered                         = [
			'disallow_directives' => [],
			'allow_directives'    => [],
			'sitemaps'            => [
				'http://example.com/sitemap_index.html',
			],
			'expected'            => "# START YOAST INTERNAL SEARCH BLOCK\n# Added by Yoast SEO (see yoa.st/robots-txt-additions for more info).\n# ---------------------------\nUser-agent: *\nDisallow:\n\nSitemap: http://example.com/sitemap_index.html\n# ---------------------------\n# END YOAST INTERNAL SEARCH BLOCK",
		];
		$only_disallow_directives                                        = [
			'disallow_directives' => [
				'*' => [ '/wp-json/' ],
			],
			'allow_directives'    => [],
			'sitemaps'            => [
				'http://example.com/sitemap_index.html',
			],
			'expected'            => "# START YOAST INTERNAL SEARCH BLOCK\n# Added by Yoast SEO (see yoa.st/robots-txt-additions for more info).\n# ---------------------------\nUser-agent: *\nDisallow: /wp-json/\n\nSitemap: http://example.com/sitemap_index.html\n# ---------------------------\n# END YOAST INTERNAL SEARCH BLOCK",
		];
		$multiple_disallow_directives                                    = [
			'disallow_directives' => [
				'*'         => [ '/wp-json/', '/search/' ],
				'Googlebot' => [ '/disallowed/for/googlebot' ],
			],
			'allow_directives'    => [],
			'sitemaps'            => [
				'http://example.com/sitemap_index.html',
			],
			'expected'            => "# START YOAST INTERNAL SEARCH BLOCK\n# Added by Yoast SEO (see yoa.st/robots-txt-additions for more info).\n# ---------------------------\nUser-agent: *\nDisallow: /wp-json/\nDisallow: /search/\n\nUser-agent: Googlebot\nDisallow: /disallowed/for/googlebot\n\nSitemap: http://example.com/sitemap_index.html\n# ---------------------------\n# END YOAST INTERNAL SEARCH BLOCK",
		];
		$one_allow_and_one_disallow_directive_for_same_user_agent        = [
			'disallow_directives' => [
				'*' => [ '/wp-json/' ],
			],
			'allow_directives'    => [
				'*' => [ '/search/' ],
			],
			'sitemaps'            => [
				'http://example.com/sitemap_index.html',
			],
			'expected'            => "# START YOAST INTERNAL SEARCH BLOCK\n# Added by Yoast SEO (see yoa.st/robots-txt-additions for more info).\n# ---------------------------\nUser-agent: *\nDisallow: /wp-json/\nAllow: /search/\n\nSitemap: http://example.com/sitemap_index.html\n# ---------------------------\n# END YOAST INTERNAL SEARCH BLOCK",
		];
		$multiple_allow_and_disallow_directives_for_multiple_user_agents = [
			'disallow_directives' => [
				'*'         => [ '/wp-json/' ],
				'Googlebot' => [ '/disallowed/for/googlebot', '/wp-admin' ],
			],
			'allow_directives'    => [
				'*'        => [ '/search/' ],
				'Yahoobot' => [ '/allowed/for/yahoo' ],
			],
			'sitemaps'            => [
				'http://example.com/sitemap_index.html',
			],
			'expected'            => "# START YOAST INTERNAL SEARCH BLOCK\n# Added by Yoast SEO (see yoa.st/robots-txt-additions for more info).\n# ---------------------------\nUser-agent: *\nDisallow: /wp-json/\nAllow: /search/\n\nUser-agent: Googlebot\nDisallow: /disallowed/for/googlebot\nDisallow: /wp-admin\n\nUser-agent: Yahoobot\nAllow: /allowed/for/yahoo\n\nSitemap: http://example.com/sitemap_index.html\n# ---------------------------\n# END YOAST INTERNAL SEARCH BLOCK",
		];
		$single_allow_directive = [
			'disallow_directives' => [],
			'allow_directives'    => [
				'*' => [ '/search/' ],
			],
			'sitemaps'            => [
				'http://example.com/sitemap_index.html',
			],
			'expected'            => "# START YOAST INTERNAL SEARCH BLOCK\n# Added by Yoast SEO (see yoa.st/robots-txt-additions for more info).\n# ---------------------------\nUser-agent: *\nAllow: /search/\n\nSitemap: http://example.com/sitemap_index.html\n# ---------------------------\n# END YOAST INTERNAL SEARCH BLOCK",
		];
		$multiple_sitemaps      = [
			'disallow_directives' => [],
			'allow_directives'    => [],
			'sitemaps'            => [
				'http://example.com/sitemap_index.html',
				'http://example.com/subsite/sitemap_index.html',
			],
			'expected'            => "# START YOAST INTERNAL SEARCH BLOCK\n# Added by Yoast SEO (see yoa.st/robots-txt-additions for more info).\n# ---------------------------\nUser-agent: *\nDisallow:\n\nSitemap: http://example.com/sitemap_index.html\nSitemap: http://example.com/subsite/sitemap_index.html\n# ---------------------------\n# END YOAST INTERNAL SEARCH BLOCK",
		];
		return [
			'No disallow and allow directives registered' => $no_disallow_allow_directives_registered,
			'Only disallow directives registered'         => $only_disallow_directives,
			'Multiple disallow directives registered'     => $multiple_disallow_directives,
			'One allow and one disallow directive for the same user agent' => $one_allow_and_one_disallow_directive_for_same_user_agent,
			'Multiple allow and disallow directives for multiple user agents' => $multiple_allow_and_disallow_directives_for_multiple_user_agents,
			'Single allow directive'                      => $single_allow_directive,
			'Multiple sitemaps'                           => $multiple_sitemaps,
		];
	}
}
