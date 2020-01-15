<?php

namespace Yoast\WP\SEO\Tests\Generators\Schema;

use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Schema\HTML_Helper;
use Yoast\WP\SEO\Helpers\Schema\ID_Helper;
use Yoast\WP\SEO\Presentations\Generators\Schema\Website;
use Yoast\WP\SEO\Tests\Mocks\Meta_Tags_Context;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Website_Test
 *
 * @group generators
 * @group schema
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Generators\Schema\Website
 */
class Website_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Website
	 */
	private $instance;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper|Mockery\MockInterface
	 */
	private $options;

	/**
	 * The HTML helper.
	 *
	 * @var HTML_Helper|Mockery\MockInterface
	 */
	private $html;

	/**
	 * The ID helper.
	 *
	 * @var ID_Helper|Mockery\MockInterface
	 */
	private $id;

	/**
	 * The meta tags context object.
	 *
	 * @var Meta_Tags_Context
	 */
	private $meta_tags_context;

	/**
	 * Sets up the tests.
	 */
	public function setUp() {
		parent::setUp();

		$this->options = Mockery::mock( Options_Helper::class );
		$this->html    = Mockery::mock( HTML_Helper::class );
		$this->id      = new ID_Helper();

		$this->instance = new Website(
			$this->options,
			$this->html
		);

		$this->instance->set_id_helper( $this->id );

		$this->meta_tags_context = new Meta_Tags_Context();
	}

	/**
	 * Tests the generate function.
	 *
	 * @covers ::generate
	 * @covers ::add_alternate_name
	 * @covers ::internal_search_section
	 */
	public function test_generate() {
		$this->meta_tags_context->site_url                  = 'https://example.com/';
		$this->meta_tags_context->site_name                 = 'My site';
		$this->meta_tags_context->site_represents_reference = 'https://example.com/#publisher';

		$this->html
			->expects( 'smart_strip_tags' )
			->twice()
			->andReturnArg( 0 );

		$this->options->expects( 'get' )
			->with( 'alternate_website_name', '' )
			->once()
			->andReturn( 'Alternate site name' );

		$expected = [
			'@type'           => 'WebSite',
			'@id'             => 'https://example.com/#website',
			'url'             => 'https://example.com/',
			'name'            => 'My site',
			'publisher'       => 'https://example.com/#publisher',
			'alternateName'   => 'Alternate site name',
			'description'     => 'description',
			'potentialAction' => [
				'@type'       => 'SearchAction',
				'target'      => 'https://example.com/?s={search_term_string}',
				'query-input' => 'required name=search_term_string',
			],
		];

		$this->assertEquals( $expected, $this->instance->generate( $this->meta_tags_context ) );
	}
}
