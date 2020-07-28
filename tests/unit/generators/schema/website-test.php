<?php

namespace Yoast\WP\SEO\Tests\Generators\Schema;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Generators\Schema\Website;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Schema\HTML_Helper;
use Yoast\WP\SEO\Helpers\Schema\ID_Helper;
use Yoast\WP\SEO\Helpers\Schema\Language_Helper;
use Yoast\WP\SEO\Tests\Doubles\Context\Meta_Tags_Context_Mock;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Website_Test
 *
 * @group generators
 * @group schema
 *
 * @coversDefaultClass \Yoast\WP\SEO\Generators\Schema\Website
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
	 * The language helper.
	 *
	 * @var Language_Helper|Mockery\MockInterface
	 */
	private $language;

	/**
	 * The meta tags context object.
	 *
	 * @var Meta_Tags_Context_Mock
	 */
	private $meta_tags_context;

	/**
	 * Sets up the tests.
	 */
	public function setUp() {
		parent::setUp();

		$this->options  = Mockery::mock( Options_Helper::class );
		$this->html     = Mockery::mock( HTML_Helper::class );
		$this->language = Mockery::mock( Language_Helper::class );

		$this->instance = new Website();

		$this->meta_tags_context = new Meta_Tags_Context_Mock();

		$this->instance->context = $this->meta_tags_context;
		$this->instance->helpers = (object) [
			'options' => $this->options,
			'schema'  => (object) [
				'id'       => new ID_Helper(),
				'language' => $this->language,
				'html'     => $this->html,
			],
		];
	}

	/**
	 * Tests the generate method.
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

		$this->language->expects( 'add_piece_language' )
			->once()
			->andReturnUsing(
				function( $data ) {
					$data['inLanguage'] = 'language';

					return $data;
				}
			);

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
				[
					'@type'       => 'SearchAction',
					'target'      => 'https://example.com/?s={search_term_string}',
					'query-input' => 'required name=search_term_string',
				],
			],
			'inLanguage'      => 'language',
		];

		$this->assertEquals( $expected, $this->instance->generate() );
	}

	/**
	 * Tests that no internal search section is added to the schema
	 * when the `disable_wpseo_json_ld_search` filter disables it.
	 *
	 * @covers ::generate
	 * @covers ::add_alternate_name
	 * @covers ::internal_search_section
	 */
	public function test_generate_does_not_add_internal_search_when_filter_disables_it() {
		Monkey\Filters\expectApplied( 'disable_wpseo_json_ld_search' )
			->with( false )
			->andReturn( true );

		$this->meta_tags_context->site_url                  = 'https://example.com/';
		$this->meta_tags_context->site_name                 = 'My site';
		$this->meta_tags_context->site_represents_reference = 'https://example.com/#publisher';

		$this->html
			->expects( 'smart_strip_tags' )
			->twice()
			->andReturnArg( 0 );

		$this->language->expects( 'add_piece_language' )
			->once()
			->andReturnUsing(
				function( $data ) {
					$data['inLanguage'] = 'language';

					return $data;
				}
			);

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
			'inLanguage'      => 'language',
		];

		$this->assertEquals( $expected, $this->instance->generate() );
	}

	/**
	 * Tests that the webpage graph piece is always needed.
	 *
	 * @covers ::is_needed
	 */
	public function test_is_needed() {
		// The website graph piece is always needed.
		$this->assertTrue( $this->instance->is_needed() );
	}
}
