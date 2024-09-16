<?php

namespace Yoast\WP\SEO\Tests\Unit\Builders\Indexable_Link_Builder;

use Brain\Monkey\Functions;
use Yoast\WP\SEO\Tests\Unit\Doubles\Builders\Indexable_Link_Builder_Double;

/**
 * Class Get_Permalink_Test.
 * Tests the get_permalink method.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Indexable_Link_Builder
 */
final class Get_Permalink_Test extends Abstract_Indexable_Link_Builder_TestCase {

	/**
	 * Sets up the tests.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Indexable_Link_Builder_Double(
			$this->seo_links_repository,
			$this->url_helper,
			$this->post_helper,
			$this->options_helper,
			$this->indexable_helper,
			$this->image_content_extractor
		);

		$this->instance->set_dependencies( $this->indexable_repository, $this->image_helper );
	}

	/**
	 * Data provider for test_get_permalink.
	 *
	 * @return array
	 */
	public static function data_provider_get_permalink() {
		return [
			'No www with anchor' => [
				'link'           => 'http://example.com/page#section',
				'home_url'       => [
					'scheme' => 'http',
					'host'   => 'example.com',
				],
				'set_url_scheme' => 'http://example.com/page',
				'expected'       => 'http://example.com/page',
			],
			'No www with param' => [
				'link'           => 'http://example.com/page?query=value',
				'home_url'       => [
					'scheme' => 'http',
					'host'   => 'example.com',
				],
				'set_url_scheme' => 'http://example.com/page',
				'expected'       => 'http://example.com/page',
			],
			'No www with param and achor' => [
				'link'           => 'https://example.com/page?test=value#section',
				'home_url'       => [
					'scheme' => 'http',
					'host'   => 'example.com',
				],
				'set_url_scheme' => 'http://example.com/page',
				'expected'       => 'http://example.com/page',
			],
			'Add www.' => [
				'link'           => 'http://example.com/page',
				'home_url'       => [
					'scheme' => 'https',
					'host'   => 'www.example.com',
				],
				'set_url_scheme' => 'https://example.com/page',
				'expected'       => 'https://www.example.com/page',
			],
			'Strip www.' => [
				'link'           => 'https://www.example.com/page',
				'home_url'       => [
					'scheme' => 'https',
					'host'   => 'example.com',
				],
				'set_url_scheme' => 'https://www.example.com/page',
				'expected'       => 'https://example.com/page',
			],
		];
	}

	/**
	 * Tests that the incoming link count is updated for all related indexables.
	 *
	 * @covers ::get_permalink
	 *
	 * @dataProvider data_provider_get_permalink
	 *
	 * @param string $link           The link to test.
	 * @param array  $home_url       The home URL schema and host.
	 * @param string $set_url_scheme The URL scheme.
	 * @param string $expected       The expected permalink.
	 *
	 * @return void
	 */
	public function test_get_permalink( $link, $home_url, $set_url_scheme, $expected ) {

		Functions\when( 'set_url_scheme' )
			->justReturn( $set_url_scheme );

		$this->assertSame( $expected, $this->instance->exposed_get_permalink( $link, $home_url ) );
	}
}
