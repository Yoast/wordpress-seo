<?php

namespace Yoast\WP\SEO\Tests\Generators\Schema;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Date_Helper;
use Yoast\WP\SEO\Helpers\Schema\HTML_Helper;
use Yoast\WP\SEO\Helpers\Schema\Language_Helper;
use Yoast\WP\SEO\Helpers\Schema\ID_Helper;
use Yoast\WP\SEO\Generators\Schema\WebPage;
use Yoast\WP\SEO\Tests\Mocks\Meta_Tags_Context;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class WebPage_Test
 *
 * @group generators
 * @group schema
 *
 * @coversDefaultClass \Yoast\WP\SEO\Generators\Schema\WebPage
 */
class WebPage_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var WebPage
	 */
	private $instance;

	/**
	 * The current page helper.
	 *
	 * @var Current_Page_Helper|Mockery\MockInterface
	 */
	private $current_page;

	/**
	 * The HTML helper.
	 *
	 * @var HTML_Helper|Mockery\MockInterface
	 */
	private $html;

	/**
	 * The date helper.
	 *
	 * @var Date_Helper|Mockery\MockInterface
	 */
	private $date;

	/**
	 * The language helper.
	 *
	 * @var Language_Helper|Mockery\MockInterface
	 */
	private $language;

	/**
	 * The Schema ID helper.
	 *
	 * @var ID_Helper
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

		$this->current_page      = Mockery::mock( Current_Page_Helper::class );
		$this->html              = Mockery::mock( HTML_Helper::class );
		$this->date              = Mockery::mock( Date_Helper::class );
		$this->language          = Mockery::mock( Language_Helper::class );
		$this->meta_tags_context = Mockery::mock( Meta_Tags_Context::class );
		$this->id                = Mockery::mock( ID_Helper::class );

		$this->instance = new WebPage(
			$this->current_page,
			$this->html,
			$this->date,
			$this->language
		);
		$this->instance->set_id_helper( $this->id );

		// Set some values that are used in multiple tests.
		$this->meta_tags_context->schema_page_type = 'WebPage';
		$this->meta_tags_context->canonical        = 'https://example.com/the-post/';
		$this->meta_tags_context->title            = 'the-title';
		$this->meta_tags_context->description      = '';
		$this->meta_tags_context->site_url         = 'https://example.com/';
		$this->meta_tags_context->post             = (Object) [
			'post_date_gmt'     => '2345-12-12 12:12:12',
			'post_modified_gmt' => '2345-12-12 23:23:23',
			'post_author'       => 'the_author',
		];
		$this->meta_tags_context->indexable        = (Object) [
			'object_type'     => 'post',
			'object_sub_type' => 'page',
		];
		$this->id->webpage_hash                    = '#webpage';
		$this->id->website_hash                    = '#website';
	}

	/**
	 * Tests generate in various scenarios with a provider.
	 *
	 * @covers ::__construct
	 * @covers ::generate
	 * @covers ::add_breadcrumbs
	 * @covers ::add_potential_action
	 *
	 * @param array   $values_to_test The values that need to vary in order to test all the paths.
	 * @param boolean $expected       The expected generated webpage schema.
	 * @param string  $message        The message to show in case a test fails.
	 *
	 * @dataProvider provider_for_generate
	 */
	public function test_generate_with_provider( $values_to_test, $expected, $message ) {
		$this->meta_tags_context->has_image           = $values_to_test['has_image'];
		$this->meta_tags_context->breadcrumbs_enabled = $values_to_test['breadcrumbs_enabled'];

		$this->id->primary_image_hash = '#primaryimage';
		$this->id->breadcrumb_hash    = '#breadcrumb';

		$this->html
			->expects( 'smart_strip_tags' )
			->with( 'the-title' )
			->once()
			->andReturnArg( 0 );

		$this->current_page
			->expects( 'is_front_page' )
			->once()
			->withNoArgs()
			->andReturnFalse();

		$this->date
			->expects( 'format' )
			->with( $this->meta_tags_context->post->post_date_gmt )
			->once()
			->andReturn( $this->meta_tags_context->post->post_date_gmt );

		$this->date
			->expects( 'format' )
			->with( $this->meta_tags_context->post->post_modified_gmt )
			->once()
			->andReturn( $this->meta_tags_context->post->post_modified_gmt );

		$this->current_page
			->expects( 'is_home_static_page' )
			->once()
			->withNoArgs()
			->andReturnFalse();

		$this->language->expects( 'add_piece_language' )
			->once()
			->andReturnUsing( function( $data ) {
				$data['inLanguage'] = 'the-language';

				return $data;
			} );

		$this->meta_tags_context
			->expects( 'generate_schema_page_type' )
			->withNoArgs()
			->once()
			->andReturn( 'WebPage' );

		Monkey\Filters\expectApplied( 'wpseo_schema_webpage_potential_action_target' )
			->with( [ $this->meta_tags_context->canonical ] )
			->once()
			->andReturn( [ $this->meta_tags_context->canonical ] );

		$this->assertEquals( $expected, $this->instance->generate( $this->meta_tags_context ), $message );
	}

	/**
	 * Tests generate on the front case when the site isn't set to represent anything.
	 *
	 * @covers ::__construct
	 * @covers ::generate
	 * @covers ::add_breadcrumbs
	 * @covers ::add_potential_action
	 */
	public function test_generate_on_front_page_site_does_not_represents_reference() {
		$this->meta_tags_context->has_image           = false;
		$this->meta_tags_context->breadcrumbs_enabled = false;

		$this->html
			->expects( 'smart_strip_tags' )
			->with( 'the-title' )
			->once()
			->andReturnArg( 0 );

		$this->current_page
			->expects( 'is_front_page' )
			->once()
			->withNoArgs()
			->andReturnTrue();

		$this->date
			->expects( 'format' )
			->with( $this->meta_tags_context->post->post_date_gmt )
			->once()
			->andReturn( $this->meta_tags_context->post->post_date_gmt );

		$this->date
			->expects( 'format' )
			->with( $this->meta_tags_context->post->post_modified_gmt )
			->once()
			->andReturn( $this->meta_tags_context->post->post_modified_gmt );

		$this->current_page
			->expects( 'is_home_static_page' )
			->once()
			->withNoArgs()
			->andReturnFalse();

		$this->language->expects( 'add_piece_language' )
			->once()
			->andReturnUsing( function( $data ) {
				$data['inLanguage'] = 'the-language';

				return $data;
			} );

		$this->meta_tags_context
			->expects( 'generate_schema_page_type' )
			->withNoArgs()
			->once()
			->andReturn( 'WebPage' );

		Monkey\Filters\expectApplied( 'wpseo_schema_webpage_potential_action_target' )
			->with( [ $this->meta_tags_context->canonical ] )
			->once()
			->andReturn( [ $this->meta_tags_context->canonical ] );

		$expected = [
			'@type'           => 'WebPage',
			'@id'             => 'https://example.com/the-post/#webpage',
			'url'             => 'https://example.com/the-post/',
			'name'            => 'the-title',
			'isPartOf'        => [
				'@id' => 'https://example.com/#website',
			],
			'datePublished'   => '2345-12-12 12:12:12',
			'dateModified'    => '2345-12-12 23:23:23',
			'inLanguage'      => 'the-language',
			'potentialAction' => [
				[
					'@type'  => 'ReadAction',
					'target' => [ 'https://example.com/the-post/' ],
				],
			],
		];

		$this->assertEquals( $expected, $this->instance->generate( $this->meta_tags_context ) );
	}

	/**
	 * Tests generate on the front page when the site represents an organization.
	 *
	 * @covers ::__construct
	 * @covers ::generate
	 * @covers ::add_breadcrumbs
	 * @covers ::add_potential_action
	 */
	public function test_generate_on_front_page_site_represents_reference() {
		$this->meta_tags_context->has_image                 = false;
		$this->meta_tags_context->breadcrumbs_enabled       = false;
		$this->meta_tags_context->site_represents_reference = [ '@id' => $this->meta_tags_context->site_url . '#organization' ];

		$this->html
			->expects( 'smart_strip_tags' )
			->with( 'the-title' )
			->once()
			->andReturnArg( 0 );

		$this->current_page
			->expects( 'is_front_page' )
			->once()
			->withNoArgs()
			->andReturnTrue();

		$this->date
			->expects( 'format' )
			->with( $this->meta_tags_context->post->post_date_gmt )
			->once()
			->andReturn( $this->meta_tags_context->post->post_date_gmt );

		$this->date
			->expects( 'format' )
			->with( $this->meta_tags_context->post->post_modified_gmt )
			->once()
			->andReturn( $this->meta_tags_context->post->post_modified_gmt );

		$this->current_page
			->expects( 'is_home_static_page' )
			->once()
			->withNoArgs()
			->andReturnFalse();

		$this->language->expects( 'add_piece_language' )
			->once()
			->andReturnUsing( function( $data ) {
				$data['inLanguage'] = 'the-language';

				return $data;
			} );

		$this->meta_tags_context
			->expects( 'generate_schema_page_type' )
			->withNoArgs()
			->once()
			->andReturn( 'WebPage' );

		Monkey\Filters\expectApplied( 'wpseo_schema_webpage_potential_action_target' )
			->with( [ $this->meta_tags_context->canonical ] )
			->once()
			->andReturn( [ $this->meta_tags_context->canonical ] );

		$expected = [
			'@type'           => 'WebPage',
			'@id'             => 'https://example.com/the-post/#webpage',
			'url'             => 'https://example.com/the-post/',
			'name'            => 'the-title',
			'isPartOf'        => [
				'@id' => 'https://example.com/#website',
			],
			'datePublished'   => '2345-12-12 12:12:12',
			'dateModified'    => '2345-12-12 23:23:23',
			'about'           => [ '@id' => 'https://example.com/#organization' ],
			'inLanguage'      => 'the-language',
			'potentialAction' => [
				[
					'@type'  => 'ReadAction',
					'target' => [ 'https://example.com/the-post/' ],
				],
			],
		];

		$this->assertEquals( $expected, $this->instance->generate( $this->meta_tags_context ) );
	}

	/**
	 * Tests generate for posts when site_represents is set to true.
	 *
	 * @covers ::__construct
	 * @covers ::generate
	 * @covers ::add_author
	 * @covers ::add_breadcrumbs
	 * @covers ::add_potential_action
	 */
	public function test_generate_object_post_site_represents_true() {
		$this->meta_tags_context->has_image           = false;
		$this->meta_tags_context->breadcrumbs_enabled = false;
		$this->meta_tags_context->site_represents     = true;

		$this->meta_tags_context->indexable = (Object) [
			'object_type'     => 'post',
			'object_sub_type' => 'post',
		];

		$this->html
			->expects( 'smart_strip_tags' )
			->with( 'the-title' )
			->once()
			->andReturnArg( 0 );

		$this->current_page
			->expects( 'is_front_page' )
			->once()
			->withNoArgs()
			->andReturnFalse();

		$this->date
			->expects( 'format' )
			->with( $this->meta_tags_context->post->post_date_gmt )
			->once()
			->andReturn( $this->meta_tags_context->post->post_date_gmt );

		$this->date
			->expects( 'format' )
			->with( $this->meta_tags_context->post->post_modified_gmt )
			->once()
			->andReturn( $this->meta_tags_context->post->post_modified_gmt );

		$this->current_page
			->expects( 'is_home_static_page' )
			->once()
			->withNoArgs()
			->andReturnFalse();

		$this->language->expects( 'add_piece_language' )
			->once()
			->andReturnUsing( function( $data ) {
				$data['inLanguage'] = 'the-language';

				return $data;
			} );

		$this->meta_tags_context
			->expects( 'generate_schema_page_type' )
			->withNoArgs()
			->once()
			->andReturn( 'WebPage' );

		Monkey\Filters\expectApplied( 'wpseo_schema_webpage_potential_action_target' )
			->with( [ $this->meta_tags_context->canonical ] )
			->once()
			->andReturn( [ $this->meta_tags_context->canonical ] );

		$expected = [
			'@type'           => 'WebPage',
			'@id'             => 'https://example.com/the-post/#webpage',
			'url'             => 'https://example.com/the-post/',
			'name'            => 'the-title',
			'isPartOf'        => [
				'@id' => 'https://example.com/#website',
			],
			'datePublished'   => '2345-12-12 12:12:12',
			'dateModified'    => '2345-12-12 23:23:23',
			'inLanguage'      => 'the-language',
			'potentialAction' => [
				[
					'@type'  => 'ReadAction',
					'target' => [ 'https://example.com/the-post/' ],
				],
			],
		];

		$this->assertEquals( $expected, $this->instance->generate( $this->meta_tags_context ) );
	}

	/**
	 * Tests generate for posts when site_represents is set to false.
	 *
	 * @covers ::__construct
	 * @covers ::generate
	 * @covers ::add_author
	 * @covers ::add_breadcrumbs
	 * @covers ::add_potential_action
	 */
	public function test_generate_object_post_site_represents_false() {
		$this->meta_tags_context->has_image           = false;
		$this->meta_tags_context->breadcrumbs_enabled = false;
		$this->meta_tags_context->site_represents     = false;

		$this->meta_tags_context->indexable = (Object) [
			'object_type'     => 'post',
			'object_sub_type' => 'post',
		];

		$this->html
			->expects( 'smart_strip_tags' )
			->with( 'the-title' )
			->once()
			->andReturnArg( 0 );

		$this->current_page
			->expects( 'is_front_page' )
			->once()
			->withNoArgs()
			->andReturnFalse();

		$this->date
			->expects( 'format' )
			->with( $this->meta_tags_context->post->post_date_gmt )
			->once()
			->andReturn( $this->meta_tags_context->post->post_date_gmt );

		$this->date
			->expects( 'format' )
			->with( $this->meta_tags_context->post->post_modified_gmt )
			->once()
			->andReturn( $this->meta_tags_context->post->post_modified_gmt );

		$this->id
			->expects( 'get_user_schema_id' )
			->with( $this->meta_tags_context->post->post_author, $this->meta_tags_context )
			->once()
			->andReturn( 'the-user-schema-id' );

		$this->current_page
			->expects( 'is_home_static_page' )
			->once()
			->withNoArgs()
			->andReturnFalse();

		$this->language->expects( 'add_piece_language' )
			->once()
			->andReturnUsing( function( $data ) {
				$data['inLanguage'] = 'the-language';

				return $data;
			} );

		$this->meta_tags_context
			->expects( 'generate_schema_page_type' )
			->withNoArgs()
			->once()
			->andReturn( 'WebPage' );

		Monkey\Filters\expectApplied( 'wpseo_schema_webpage_potential_action_target' )
			->with( [ $this->meta_tags_context->canonical ] )
			->once()
			->andReturn( [ $this->meta_tags_context->canonical ] );

		$expected = [
			'@type'           => 'WebPage',
			'@id'             => 'https://example.com/the-post/#webpage',
			'url'             => 'https://example.com/the-post/',
			'name'            => 'the-title',
			'isPartOf'        => [
				'@id' => 'https://example.com/#website',
			],
			'datePublished'   => '2345-12-12 12:12:12',
			'dateModified'    => '2345-12-12 23:23:23',
			'author'          => [ '@id' => 'the-user-schema-id' ],
			'inLanguage'      => 'the-language',
			'potentialAction' => [
				[
					'@type'  => 'ReadAction',
					'target' => [ 'https://example.com/the-post/' ],
				],
			],
		];

		$this->assertEquals( $expected, $this->instance->generate( $this->meta_tags_context ) );
	}

	/**
	 * Tests generate when the description is not empty.
	 *
	 * @covers ::__construct
	 * @covers ::generate
	 * @covers ::add_breadcrumbs
	 * @covers ::add_potential_action
	 */
	public function test_generate_description_not_empty() {
		$this->meta_tags_context->has_image           = false;
		$this->meta_tags_context->breadcrumbs_enabled = false;
		$this->meta_tags_context->description         = 'the-description';

		$this->html
			->expects( 'smart_strip_tags' )
			->with( 'the-title' )
			->once()
			->andReturnArg( 0 );

		$this->current_page
			->expects( 'is_front_page' )
			->once()
			->withNoArgs()
			->andReturnFalse();

		$this->date
			->expects( 'format' )
			->with( $this->meta_tags_context->post->post_date_gmt )
			->once()
			->andReturn( $this->meta_tags_context->post->post_date_gmt );

		$this->date
			->expects( 'format' )
			->with( $this->meta_tags_context->post->post_modified_gmt )
			->once()
			->andReturn( $this->meta_tags_context->post->post_modified_gmt );

		$this->html
			->expects( 'smart_strip_tags' )
			->with( 'the-description' )
			->once()
			->andReturnArg( 0 );

		$this->current_page
			->expects( 'is_home_static_page' )
			->once()
			->withNoArgs()
			->andReturnFalse();

		$this->language->expects( 'add_piece_language' )
			->once()
			->andReturnUsing( function( $data ) {
				$data['inLanguage'] = 'the-language';

				return $data;
			} );

		$this->meta_tags_context
			->expects( 'generate_schema_page_type' )
			->withNoArgs()
			->once()
			->andReturn( 'WebPage' );

		Monkey\Filters\expectApplied( 'wpseo_schema_webpage_potential_action_target' )
			->with( [ $this->meta_tags_context->canonical ] )
			->once()
			->andReturn( [ $this->meta_tags_context->canonical ] );

		$expected = [
			'@type'           => 'WebPage',
			'@id'             => 'https://example.com/the-post/#webpage',
			'url'             => 'https://example.com/the-post/',
			'name'            => 'the-title',
			'isPartOf'        => [
				'@id' => 'https://example.com/#website',
			],
			'datePublished'   => '2345-12-12 12:12:12',
			'dateModified'    => '2345-12-12 23:23:23',
			'description'     => 'the-description',
			'inLanguage'      => 'the-language',
			'potentialAction' => [
				[
					'@type'  => 'ReadAction',
					'target' => [ 'https://example.com/the-post/' ],
				],
			],
		];

		$this->assertEquals( $expected, $this->instance->generate( $this->meta_tags_context ) );
	}

	/**
	 * Tests generate when the object type is home page.
	 *
	 * @covers ::__construct
	 * @covers ::generate
	 * @covers ::add_breadcrumbs
	 * @covers ::add_potential_action
	 */
	public function test_generate_object_type_home_page() {
		$this->meta_tags_context->schema_page_type = 'CollectionPage';
		$this->meta_tags_context->has_image        = false;
		$this->meta_tags_context->indexable        = (Object) [
			'object_type' => 'home-page',
		];

		$this->html
			->expects( 'smart_strip_tags' )
			->with( 'the-title' )
			->once()
			->andReturnArg( 0 );

		$this->current_page
			->expects( 'is_front_page' )
			->once()
			->withNoArgs()
			->andReturnFalse();

		$this->language->expects( 'add_piece_language' )
			->once()
			->andReturnUsing( function( $data ) {
				$data['inLanguage'] = 'the-language';

				return $data;
			} );

		$this->meta_tags_context
			->expects( 'generate_schema_page_type' )
			->once()
			->andReturn( 'CollectionPage' );

		$expected = [
			'@type'      => 'CollectionPage',
			'@id'        => 'https://example.com/the-post/#webpage',
			'url'        => 'https://example.com/the-post/',
			'name'       => 'the-title',
			'isPartOf'   => [
				'@id' => 'https://example.com/#website',
			],
			'inLanguage' => 'the-language',
		];

		$this->assertEquals( $expected, $this->instance->generate( $this->meta_tags_context ) );
	}

	/**
	 * Tests generate for a static homepage.
	 *
	 * @covers ::__construct
	 * @covers ::generate
	 * @covers ::add_breadcrumbs
	 * @covers ::add_potential_action
	 */
	public function test_generate_home_static_page() {
		$this->meta_tags_context->schema_page_type = 'CollectionPage';
		$this->meta_tags_context->has_image        = false;

		$this->html
			->expects( 'smart_strip_tags' )
			->with( 'the-title' )
			->once()
			->andReturnArg( 0 );

		$this->current_page
			->expects( 'is_front_page' )
			->once()
			->withNoArgs()
			->andReturnFalse();

		$this->date
			->expects( 'format' )
			->with( $this->meta_tags_context->post->post_date_gmt )
			->once()
			->andReturn( $this->meta_tags_context->post->post_date_gmt );

		$this->date
			->expects( 'format' )
			->with( $this->meta_tags_context->post->post_modified_gmt )
			->once()
			->andReturn( $this->meta_tags_context->post->post_modified_gmt );

		$this->current_page
			->expects( 'is_home_static_page' )
			->withNoArgs()
			->once()
			->andReturnTrue();

		$this->language->expects( 'add_piece_language' )
			->once()
			->andReturnUsing( function( $data ) {
				$data['inLanguage'] = 'the-language';

				return $data;
			} );

		$this->meta_tags_context
			->expects( 'generate_schema_page_type' )
			->once()
			->andReturn( 'CollectionPage' );

		$expected = [
			'@type'         => 'CollectionPage',
			'@id'           => 'https://example.com/the-post/#webpage',
			'url'           => 'https://example.com/the-post/',
			'name'          => 'the-title',
			'datePublished' => '2345-12-12 12:12:12',
			'dateModified'  => '2345-12-12 23:23:23',
			'isPartOf'      => [
				'@id' => 'https://example.com/#website',
			],
			'inLanguage'    => 'the-language',
		];

		$this->assertEquals( $expected, $this->instance->generate( $this->meta_tags_context ) );
	}

	/**
	 * Tests is needed when the conditional is true.
	 *
	 * @covers ::__construct
	 * @covers ::is_needed
	 */
	public function test_is_needed() {
		$this->meta_tags_context->indexable = (Object) [
			'object_type'     => 'user',
			'object_sub_type' => '',
		];
		$this->assertTrue( $this->instance->is_needed( $this->meta_tags_context ) );
	}

	/**
	 * Tests is needed for a system page (but not a 404 page).
	 *
	 * @covers ::__construct
	 * @covers ::is_needed
	 */
	public function test_is_needed_system_page() {
		$this->meta_tags_context->indexable = (Object) [
			'object_type'     => 'system_page',
			'object_sub_type' => '',
		];
		$this->assertTrue( $this->instance->is_needed( $this->meta_tags_context ) );
	}

	/**
	 * Tests is needed for a system page / 404 page.
	 *
	 * @covers ::__construct
	 * @covers ::is_needed
	 */
	public function test_is_needed_system_page_404() {
		$this->meta_tags_context->indexable = (Object) [
			'object_type'     => 'system-page',
			'object_sub_type' => '404',
		];
		$this->assertFalse( $this->instance->is_needed( $this->meta_tags_context ) );
	}

	/**
	 * Provides data to the generate test.
	 *
	 * @return array The data to use.
	 */
	public function provider_for_generate() {
		return [
			[
				'values_to_test' => [
					'has_image'           => false,
					'breadcrumbs_enabled' => false,
				],
				'expected'       => [
					'@type'           => 'WebPage',
					'@id'             => 'https://example.com/the-post/#webpage',
					'url'             => 'https://example.com/the-post/',
					'name'            => 'the-title',
					'isPartOf'        => [
						'@id' => 'https://example.com/#website',
					],
					'datePublished'   => '2345-12-12 12:12:12',
					'dateModified'    => '2345-12-12 23:23:23',
					'inLanguage'      => 'the-language',
					'potentialAction' => [
						[
							'@type'  => 'ReadAction',
							'target' => [ 'https://example.com/the-post/' ],
						],
					],
				],
				'message'        => 'The object type is post, and all other conditionals are false.',
			],
			[
				'values_to_test' => [
					'has_image'           => true,
					'breadcrumbs_enabled' => false,
				],
				'expected'       => [
					'@type'              => 'WebPage',
					'@id'                => 'https://example.com/the-post/#webpage',
					'url'                => 'https://example.com/the-post/',
					'name'               => 'the-title',
					'isPartOf'           => [
						'@id' => 'https://example.com/#website',
					],
					'datePublished'      => '2345-12-12 12:12:12',
					'dateModified'       => '2345-12-12 23:23:23',
					'primaryImageOfPage' => [ '@id' => 'https://example.com/the-post/#primaryimage' ],
					'inLanguage'         => 'the-language',
					'potentialAction'    => [
						[
							'@type'  => 'ReadAction',
							'target' => [ 'https://example.com/the-post/' ],
						],
					],
				],
				'message'        => 'The object type is post, and the post has an image.',
			],
			[
				'values_to_test' => [
					'has_image'           => false,
					'breadcrumbs_enabled' => true,
				],
				'expected'       => [
					'@type'           => 'WebPage',
					'@id'             => 'https://example.com/the-post/#webpage',
					'url'             => 'https://example.com/the-post/',
					'name'            => 'the-title',
					'isPartOf'        => [
						'@id' => 'https://example.com/#website',
					],
					'datePublished'   => '2345-12-12 12:12:12',
					'dateModified'    => '2345-12-12 23:23:23',
					'breadcrumb'      => [ '@id' => 'https://example.com/the-post/#breadcrumb' ],
					'inLanguage'      => 'the-language',
					'potentialAction' => [
						[
							'@type'  => 'ReadAction',
							'target' => [ 'https://example.com/the-post/' ],
						],
					],
				],
				'message'        => 'The object type is post, and breadcrumbs are enabled.',
			],
		];
	}
}
