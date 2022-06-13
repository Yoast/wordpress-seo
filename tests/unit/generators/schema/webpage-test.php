<?php

namespace Yoast\WP\SEO\Tests\Unit\Generators\Schema;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Generators\Schema\WebPage;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Date_Helper;
use Yoast\WP\SEO\Helpers\Schema\HTML_Helper;
use Yoast\WP\SEO\Helpers\Schema\ID_Helper;
use Yoast\WP\SEO\Helpers\Schema\Language_Helper;
use Yoast\WP\SEO\Tests\Unit\Doubles\Context\Meta_Tags_Context_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

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
	 * @var Meta_Tags_Context_Mock
	 */
	private $meta_tags_context;

	/**
	 * Sets up the tests.
	 */
	protected function set_up() {
		parent::set_up();

		$this->current_page      = Mockery::mock( Current_Page_Helper::class );
		$this->html              = Mockery::mock( HTML_Helper::class );
		$this->date              = Mockery::mock( Date_Helper::class );
		$this->language          = Mockery::mock( Language_Helper::class );
		$this->meta_tags_context = Mockery::mock( Meta_Tags_Context_Mock::class );
		$this->id                = Mockery::mock( ID_Helper::class );

		$this->instance          = Mockery::mock( WebPage::class )
			->makePartial();
		$this->instance->context = $this->meta_tags_context;
		$this->instance->helpers = (object) [
			'current_page' => $this->current_page,
			'date'         => $this->date,
			'schema'       => (object) [
				'html'     => $this->html,
				'id'       => $this->id,
				'language' => $this->language,
			],
		];

		// Set some values that are used in multiple tests.
		$this->meta_tags_context->schema_page_type = [ 'WebPage' ];
		$this->meta_tags_context->canonical        = 'https://example.com/the-post/';
		$this->meta_tags_context->main_schema_id   = 'https://example.com/the-post/';
		$this->meta_tags_context->title            = 'the-title';
		$this->meta_tags_context->description      = '';
		$this->meta_tags_context->site_url         = 'https://example.com/';
		$this->meta_tags_context->has_image        = false;
		$this->meta_tags_context->post             = (object) [
			'post_date_gmt'     => '2345-12-12 12:12:12',
			'post_modified_gmt' => '2345-12-12 23:23:23',
			'post_author'       => 'the_author',
		];
		$this->meta_tags_context->indexable        = (object) [
			'object_type'     => 'post',
			'object_sub_type' => 'page',
		];

		$this->id->webpage_hash = '';
		$this->id->website_hash = '#website';
	}

	/**
	 * Sets up the tests that cover the generate function.
	 *
	 * @param bool   $is_front_page                          Whether the current page is a front page.
	 * @param string $schema_page_type                       The Schema page type.
	 * @param int    $calls_to_format_with_post_date_gmt     The number of function calls to 'format' with
	 *                                                       'post_date_gmt' as argument.
	 * @param int    $calls_to_format_with_post_modified_gmt The number of function calls to 'format' with
	 *                                                       'post_modified_gmt' as argument.
	 * @param int    $calls_to_filter                        The number of calls to the
	 *                                                       'wpseo_schema_webpage_potential_action_target' filter.
	 */
	public function setup_generate_test(
		$is_front_page,
		$schema_page_type,
		$calls_to_format_with_post_date_gmt,
		$calls_to_format_with_post_modified_gmt,
		$calls_to_filter
	) {
		$this->html
			->expects( 'smart_strip_tags' )
			->with( 'the-title' )
			->once()
			->andReturnArg( 0 );

		$this->current_page
			->expects( 'is_front_page' )
			->once()
			->withNoArgs()
			->andReturn( $is_front_page );

		$this->date
			->expects( 'format' )
			->with( $this->meta_tags_context->post->post_date_gmt )
			->times( $calls_to_format_with_post_date_gmt )
			->andReturn( $this->meta_tags_context->post->post_date_gmt );

		$this->date
			->expects( 'format' )
			->with( $this->meta_tags_context->post->post_modified_gmt )
			->times( $calls_to_format_with_post_modified_gmt )
			->andReturn( $this->meta_tags_context->post->post_modified_gmt );

		$this->language->expects( 'add_piece_language' )
			->once()
			->andReturnUsing(
				static function ( $data ) {
					$data['inLanguage'] = 'the-language';

					return $data;
				}
			);

		Monkey\Filters\expectApplied( 'wpseo_schema_webpage_potential_action_target' )
			->with( [ $this->meta_tags_context->canonical ] )
			->times( $calls_to_filter )
			->andReturn( [ $this->meta_tags_context->canonical ] );
	}

	/**
	 * Tests generate in various scenarios with a provider.
	 *
	 * @covers ::generate
	 * @covers ::add_image
	 * @covers ::add_breadcrumbs
	 * @covers ::add_potential_action
	 *
	 * @dataProvider provider_for_generate
	 *
	 * @param array  $values_to_test The values that need to vary in order to test all the paths.
	 * @param bool   $expected       The expected generated webpage schema.
	 * @param string $message        The message to show in case a test fails.
	 */
	public function test_generate_with_provider( $values_to_test, $expected, $message ) {
		$this->meta_tags_context->has_image = $values_to_test['has_image'];

		$this->id->primary_image_hash = '#primaryimage';
		$this->id->breadcrumb_hash    = '#breadcrumb';

		$this->setup_generate_test(
			false,
			[ 'WebPage' ],
			1,
			1,
			1
		);

		$this->assertEquals( $expected, $this->instance->generate(), $message );
	}

	/**
	 * Tests generate on the front case when the site isn't set to represent anything.
	 *
	 * @covers ::generate
	 * @covers ::add_breadcrumbs
	 * @covers ::add_potential_action
	 */
	public function test_generate_on_front_page_site_does_not_represents_reference() {
		$this->setup_generate_test(
			true,
			[ 'WebPage' ],
			1,
			1,
			1
		);

		$expected = [
			'@type'           => [ 'WebPage' ],
			'@id'             => 'https://example.com/the-post/',
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
		];

		$this->assertEquals( $expected, $this->instance->generate() );
	}

	/**
	 * Tests generate on the front page when the site represents an organization.
	 *
	 * @covers ::generate
	 * @covers ::add_breadcrumbs
	 * @covers ::add_potential_action
	 */
	public function test_generate_on_front_page_site_represents_reference() {
		$this->meta_tags_context->site_represents_reference = [ '@id' => $this->meta_tags_context->site_url . '#organization' ];

		$this->setup_generate_test(
			true,
			[ 'WebPage' ],
			1,
			1,
			1
		);

		$expected = [
			'@type'           => [ 'WebPage' ],
			'@id'             => 'https://example.com/the-post/',
			'url'             => 'https://example.com/the-post/',
			'name'            => 'the-title',
			'isPartOf'        => [
				'@id' => 'https://example.com/#website',
			],
			'datePublished'   => '2345-12-12 12:12:12',
			'dateModified'    => '2345-12-12 23:23:23',
			'breadcrumb'      => [ '@id' => 'https://example.com/the-post/#breadcrumb' ],
			'about'           => [ '@id' => 'https://example.com/#organization' ],
			'inLanguage'      => 'the-language',
			'potentialAction' => [
				[
					'@type'  => 'ReadAction',
					'target' => [ 'https://example.com/the-post/' ],
				],
			],
		];

		$this->assertEquals( $expected, $this->instance->generate() );
	}

	/**
	 * Tests generate for posts when site_represents is set to true.
	 *
	 * @covers ::generate
	 * @covers ::add_author
	 * @covers ::add_breadcrumbs
	 * @covers ::add_potential_action
	 */
	public function test_generate_object_post_site_represents_true() {
		$this->meta_tags_context->site_represents = true;

		$this->meta_tags_context->indexable = (object) [
			'object_type'     => 'post',
			'object_sub_type' => 'post',
		];

		$this->setup_generate_test(
			false,
			[ 'WebPage' ],
			1,
			1,
			1
		);

		$expected = [
			'@type'           => [ 'WebPage' ],
			'@id'             => 'https://example.com/the-post/',
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
		];

		$this->assertEquals( $expected, $this->instance->generate() );
	}

	/**
	 * Tests generate for posts when site_represents is set to false.
	 *
	 * @covers ::generate
	 * @covers ::add_author
	 * @covers ::add_breadcrumbs
	 * @covers ::add_potential_action
	 */
	public function test_generate_object_post_site_represents_false() {
		$this->meta_tags_context->site_represents = false;

		$this->meta_tags_context->indexable = (object) [
			'object_type'     => 'post',
			'object_sub_type' => 'post',
		];

		$this->setup_generate_test(
			false,
			[ 'WebPage' ],
			1,
			1,
			1
		);

		$this->id
			->expects( 'get_user_schema_id' )
			->with( $this->meta_tags_context->post->post_author, $this->meta_tags_context )
			->once()
			->andReturn( 'the-user-schema-id' );

		$expected = [
			'@type'           => [ 'WebPage' ],
			'@id'             => 'https://example.com/the-post/',
			'url'             => 'https://example.com/the-post/',
			'name'            => 'the-title',
			'isPartOf'        => [
				'@id' => 'https://example.com/#website',
			],
			'datePublished'   => '2345-12-12 12:12:12',
			'dateModified'    => '2345-12-12 23:23:23',
			'breadcrumb'      => [ '@id' => 'https://example.com/the-post/#breadcrumb' ],
			'author'          => [ '@id' => 'the-user-schema-id' ],
			'inLanguage'      => 'the-language',
			'potentialAction' => [
				[
					'@type'  => 'ReadAction',
					'target' => [ 'https://example.com/the-post/' ],
				],
			],
		];

		$this->assertEquals( $expected, $this->instance->generate() );
	}

	/**
	 * Tests generate when the description is not empty.
	 *
	 * @covers ::generate
	 * @covers ::add_breadcrumbs
	 * @covers ::add_potential_action
	 */
	public function test_generate_description_not_empty() {
		$this->meta_tags_context->description = 'the-description';

		$this->setup_generate_test(
			false,
			[ 'WebPage' ],
			1,
			1,
			1
		);

		$this->html
			->expects( 'smart_strip_tags' )
			->with( 'the-description' )
			->once()
			->andReturnArg( 0 );

		$expected = [
			'@type'           => [ 'WebPage' ],
			'@id'             => 'https://example.com/the-post/',
			'url'             => 'https://example.com/the-post/',
			'name'            => 'the-title',
			'isPartOf'        => [
				'@id' => 'https://example.com/#website',
			],
			'datePublished'   => '2345-12-12 12:12:12',
			'dateModified'    => '2345-12-12 23:23:23',
			'breadcrumb'      => [ '@id' => 'https://example.com/the-post/#breadcrumb' ],
			'description'     => 'the-description',
			'inLanguage'      => 'the-language',
			'potentialAction' => [
				[
					'@type'  => 'ReadAction',
					'target' => [ 'https://example.com/the-post/' ],
				],
			],
		];

		$this->assertEquals( $expected, $this->instance->generate() );
	}

	/**
	 * Tests generate when the object type is home page.
	 *
	 * @covers ::generate
	 * @covers ::add_breadcrumbs
	 * @covers ::add_potential_action
	 */
	public function test_generate_object_type_home_page() {
		$this->meta_tags_context->schema_page_type = 'CollectionPage';
		$this->meta_tags_context->indexable        = (object) [
			'object_type' => 'home-page',
		];

		$this->setup_generate_test(
			false,
			'CollectionPage',
			0,
			0,
			1
		);

		$expected = [
			'@type'           => 'CollectionPage',
			'@id'             => 'https://example.com/the-post/',
			'url'             => 'https://example.com/the-post/',
			'name'            => 'the-title',
			'isPartOf'        => [
				'@id' => 'https://example.com/#website',
			],
			'inLanguage'      => 'the-language',
			'potentialAction' => [
				[
					'@type'  => 'ReadAction',
					'target' => [
						'https://example.com/the-post/',
					],
				],
			],
			'breadcrumb'      => [ '@id' => 'https://example.com/the-post/#breadcrumb' ],
		];

		$this->assertEquals( $expected, $this->instance->generate() );
	}

	/**
	 * Tests generate for a static homepage.
	 *
	 * @covers ::generate
	 * @covers ::add_breadcrumbs
	 * @covers ::add_potential_action
	 */
	public function test_generate_home_static_page() {
		$this->meta_tags_context->schema_page_type = 'CollectionPage';

		$this->setup_generate_test(
			false,
			'CollectionPage',
			1,
			1,
			1
		);

		$expected = [
			'@type'           => 'CollectionPage',
			'@id'             => 'https://example.com/the-post/',
			'url'             => 'https://example.com/the-post/',
			'name'            => 'the-title',
			'datePublished'   => '2345-12-12 12:12:12',
			'dateModified'    => '2345-12-12 23:23:23',
			'breadcrumb'      => [ '@id' => 'https://example.com/the-post/#breadcrumb' ],
			'isPartOf'        => [
				'@id' => 'https://example.com/#website',
			],
			'inLanguage'      => 'the-language',
			'potentialAction' => [
				[
					'@type'  => 'ReadAction',
					'target' => [
						'https://example.com/the-post/',
					],
				],
			],
		];

		$this->assertEquals( $expected, $this->instance->generate() );
	}

	/**
	 * Tests is_needed when the conditional is true.
	 *
	 * @covers ::is_needed
	 *
	 * @dataProvider provider_for_is_needed
	 *
	 * @param string $object_type     The object type.
	 * @param string $object_sub_type The object subtype.
	 * @param bool   $expected        Whether is_needed returns true or false.
	 * @param string $message         The message to show in case a test fails.
	 */
	public function test_is_needed( $object_type, $object_sub_type, $expected, $message ) {
		$this->meta_tags_context->indexable = (object) [
			'object_type'     => $object_type,
			'object_sub_type' => $object_sub_type,
		];
		$this->assertEquals( $expected, $this->instance->is_needed(), $message );
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
				],
				'expected'       => [
					'@type'           => [ 'WebPage' ],
					'@id'             => 'https://example.com/the-post/',
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
				'message'        => 'There is no image, and breadcrumbs are enabled.',
			],
			[
				'values_to_test' => [
					'has_image'           => true,
				],
				'expected'       => [
					'@type'              => [ 'WebPage' ],
					'@id'                => 'https://example.com/the-post/',
					'url'                => 'https://example.com/the-post/',
					'name'               => 'the-title',
					'isPartOf'           => [
						'@id' => 'https://example.com/#website',
					],
					'datePublished'      => '2345-12-12 12:12:12',
					'dateModified'       => '2345-12-12 23:23:23',
					'breadcrumb'         => [ '@id' => 'https://example.com/the-post/#breadcrumb' ],
					'primaryImageOfPage' => [ '@id' => 'https://example.com/the-post/#primaryimage' ],
					'inLanguage'         => 'the-language',
					'potentialAction'    => [
						[
							'@type'  => 'ReadAction',
							'target' => [ 'https://example.com/the-post/' ],
						],
					],
				],
				'message'        => 'There is an image, but breadcrumbs are enabled.',
			],
			[
				'values_to_test' => [
					'has_image'           => false,
				],
				'expected'       => [
					'@type'           => [ 'WebPage' ],
					'@id'             => 'https://example.com/the-post/',
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
				'message'        => 'There no image, but breadcrumbs are enabled.',
			],
		];
	}

	/**
	 * Provides data to the is_needed test.
	 *
	 * @return array The data to use.
	 */
	public function provider_for_is_needed() {
		return [
			[
				'object_type'     => 'user',
				'object_sub_type' => '',
				'expected'        => true,
				'message'         => 'Tests is_needed when the conditional is true.',
			],
			[
				'object_type'     => 'system-page',
				'object_sub_type' => '',
				'expected'        => true,
				'message'         => 'Tests is_needed for a system page (but not a 404 page).',
			],
			[
				'object_type'     => 'system-page',
				'object_sub_type' => '404',
				'expected'        => false,
				'message'         => 'Tests is_needed for a system page / 404 page.',
			],
		];
	}
}
