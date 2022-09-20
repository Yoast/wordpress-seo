<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters;

use Mockery;
use Yoast\WP\SEO\Helpers\Robots_Txt_Helper;
use Yoast\WP\SEO\Presenters\Robots_Txt_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Values\Robots\User_Agent_List;

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
	 * @param array  $robots_txt_user_agents Output for the registered user agents.
	 * @param array  $sitemaps               Output for the registered sitemaps.
	 * @param string $expected               The expected output to be written to robots.txt.
	 *
	 * @dataProvider present_dataprovider
	 *
	 * @covers ::present
	 */
	public function test_present( $robots_txt_user_agents, $sitemaps, $expected ) {
		$this->robots_txt_helper
			->expects( 'get_robots_txt_user_agents' )
			->andReturn( $robots_txt_user_agents );

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
		$no_disallow_allow_directives_registered = [
			'robots_txt_user_agents' => ( new User_Agent_List() )->get_user_agents(),
			'sitemaps'               => [
				'http://example.com/sitemap_index.html',
			],
			'expected'               => "# START YOAST BLOCK\n# ---------------------------\nUser-agent: *\nDisallow:\n\nSitemap: http://example.com/sitemap_index.html\n# ---------------------------\n# END YOAST BLOCK",
		];
		$user_agent_list                         = new User_Agent_List();
		$user_agent                              = $user_agent_list->get_user_agent( '*' );
		$user_agent->add_disallow_directive( '/wp-json/' );

		$only_disallow_directives = [
			'robots_txt_user_agents' => $user_agent_list->get_user_agents(),
			'sitemaps'               => [
				'http://example.com/sitemap_index.html',
			],
			'expected'               => "# START YOAST BLOCK\n# ---------------------------\nUser-agent: *\nDisallow: /wp-json/\n\nSitemap: http://example.com/sitemap_index.html\n# ---------------------------\n# END YOAST BLOCK",
		];

		$user_agent_list = new User_Agent_List();
		$user_agent      = $user_agent_list->get_user_agent( '*' );
		$user_agent->add_disallow_directive( '/wp-json/' );
		$user_agent->add_disallow_directive( '/search/' );

		$user_agent = $user_agent_list->get_user_agent( 'Googlebot' );
		$user_agent->add_disallow_directive( '/disallowed/for/googlebot' );
		$multiple_disallow_directives = [
			'robots_txt_user_agents' => $user_agent_list->get_user_agents(),
			'sitemaps'               => [
				'http://example.com/sitemap_index.html',
			],
			'expected'               => "# START YOAST BLOCK\n# ---------------------------\nUser-agent: *\nDisallow: /wp-json/\nDisallow: /search/\n\nUser-agent: Googlebot\nDisallow: /disallowed/for/googlebot\n\nSitemap: http://example.com/sitemap_index.html\n# ---------------------------\n# END YOAST BLOCK",
		];
		$user_agent_list              = new User_Agent_List();
		$user_agent                   = $user_agent_list->get_user_agent( '*' );
		$user_agent->add_disallow_directive( '/wp-json/' );
		$user_agent->add_allow_directive( '/search/' );

		$one_allow_and_one_disallow_directive_for_same_user_agent = [
			'robots_txt_user_agents' => $user_agent_list->get_user_agents(),
			'sitemaps'               => [
				'http://example.com/sitemap_index.html',
			],
			'expected'               => "# START YOAST BLOCK\n# ---------------------------\nUser-agent: *\nDisallow: /wp-json/\nAllow: /search/\n\nSitemap: http://example.com/sitemap_index.html\n# ---------------------------\n# END YOAST BLOCK",
		];

		$user_agent_list = new User_Agent_List();
		$user_agent      = $user_agent_list->get_user_agent( '*' );
		$user_agent->add_disallow_directive( '/wp-json/' );
		$user_agent->add_allow_directive( '/search/' );

		$user_agent = $user_agent_list->get_user_agent( 'Googlebot' );
		$user_agent->add_disallow_directive( '/disallowed/for/googlebot' );
		$user_agent->add_disallow_directive( '/wp-admin' );

		$user_agent = $user_agent_list->get_user_agent( 'Yahoobot' );
		$user_agent->add_allow_directive( '/allowed/for/yahoo' );
		$multiple_allow_and_disallow_directives_for_multiple_user_agents = [
			'robots_txt_user_agents' => $user_agent_list->get_user_agents(),
			'sitemaps'               => [
				'http://example.com/sitemap_index.html',
			],
			'expected'               => "# START YOAST BLOCK\n# ---------------------------\nUser-agent: *\nDisallow: /wp-json/\nAllow: /search/\n\nUser-agent: Googlebot\nDisallow: /disallowed/for/googlebot\nDisallow: /wp-admin\n\nUser-agent: Yahoobot\nAllow: /allowed/for/yahoo\n\nSitemap: http://example.com/sitemap_index.html\n# ---------------------------\n# END YOAST BLOCK",
		];

		$user_agent_list = new User_Agent_List();
		$user_agent      = $user_agent_list->get_user_agent( '*' );
		$user_agent->add_allow_directive( '/search/' );

		$single_allow_directive = [
			'robots_txt_user_agents' => $user_agent_list->get_user_agents(),
			'sitemaps'               => [
				'http://example.com/sitemap_index.html',
			],
			'expected'               => "# START YOAST BLOCK\n# ---------------------------\nUser-agent: *\nAllow: /search/\n\nSitemap: http://example.com/sitemap_index.html\n# ---------------------------\n# END YOAST BLOCK",
		];
		$multiple_sitemaps      = [
			'robots_txt_user_agents' => ( new User_Agent_List() )->get_user_agents(),
			'sitemaps'               => [
				'http://example.com/sitemap_index.html',
				'http://example.com/subsite/sitemap_index.html',
			],
			'expected'               => "# START YOAST BLOCK\n# ---------------------------\nUser-agent: *\nDisallow:\n\nSitemap: http://example.com/sitemap_index.html\nSitemap: http://example.com/subsite/sitemap_index.html\n# ---------------------------\n# END YOAST BLOCK",
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
