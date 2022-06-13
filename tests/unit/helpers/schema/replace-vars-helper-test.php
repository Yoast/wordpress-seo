<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers\Schema;

use Mockery;
use WP_Post;
use WPSEO_Replace_Vars;
use Yoast\WP\SEO\Helpers\Date_Helper;
use Yoast\WP\SEO\Helpers\Schema\ID_Helper;
use Yoast\WP\SEO\Helpers\Schema\Replace_Vars_Helper;
use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Tests\Unit\Doubles\Context\Meta_Tags_Context_Mock;
use Yoast\WP\SEO\Tests\Unit\Doubles\Helpers\Schema\Replace_Vars_Helper_Double;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Replace_Vars_Helper_Test.
 *
 * @group helpers
 * @group schema
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Schema\Replace_Vars_Helper
 */
class Replace_Vars_Helper_Test extends TestCase {

	/**
	 * Meta_Tags_Context_Memoizer mock.
	 *
	 * @var Mockery\MockInterface|Meta_Tags_Context_Memoizer
	 */
	protected $meta_tags_context_memoizer;

	/**
	 * WPSEO_Replace_Vars mock.
	 *
	 * @var Mockery\MockInterface|WPSEO_Replace_Vars
	 */
	protected $replace_vars;

	/**
	 * ID_Helper mock.
	 *
	 * @var Mockery\MockInterface|ID_Helper
	 */
	protected $id_helper;

	/**
	 * Date_Helper mock.
	 *
	 * @var Mockery\MockInterface|Date_Helper
	 */
	protected $date_helper;

	/**
	 * The instance under test.
	 *
	 * @var Replace_Vars_Helper
	 */
	protected $instance;

	/**
	 * Sets up the class under test and mock objects.
	 */
	public function set_up() {
		parent::set_up();

		$this->replace_vars = Mockery::mock( WPSEO_Replace_Vars::class );
		$this->id_helper    = Mockery::mock( ID_Helper::class );
		$this->date_helper  = Mockery::mock( Date_Helper::class );

		$this->instance = new Replace_Vars_Helper(
			$this->replace_vars,
			$this->id_helper,
			$this->date_helper
		);
	}

	/**
	 * Tests the registration of the Schema ID replace vars.
	 *
	 * @covers ::__construct
	 * @covers ::register_replace_vars
	 * @covers ::register_replacement
	 */
	public function test_register_replace_vars() {
		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->author_id = 'author_id';

		$post            = Mockery::mock( WP_Post::class );
		$post->post_date = '2020-10-11 13:00:00';

		$meta_tags_context                 = Mockery::mock( Meta_Tags_Context_Mock::class );
		$meta_tags_context->indexable      = $indexable;
		$meta_tags_context->post           = $post;
		$meta_tags_context->main_schema_id = 'https://basic.wordpress.test/schema-templates/';
		$meta_tags_context->site_url       = 'https://basic.wordpress.test';
		$meta_tags_context->canonical      = 'https://basic.wordpress.test/schema-templates';

		$this->id_helper
			->expects( 'get_user_schema_id' )
			->andReturn( 'https://basic.wordpress.test#/schema/person/a00dc884baa6bd52ebacc06cfd5aab21' );

		$this->date_helper
			->expects( 'format' )
			->with( '2020-10-11 13:00:00', \DATE_ATOM )
			->andReturn( '2020-10-11T13:00:00+00:00' );

		$this->replace_vars
			->expects( 'safe_register_replacement' )
			->times( 8 );

		$this->instance->register_replace_vars( $meta_tags_context );
	}

	/**
	 * Tests the registration of the Schema ID replace vars.
	 *
	 * @covers ::__construct
	 * @covers ::register_replace_vars
	 * @covers ::register_replacement
	 */
	public function test_registers_the_right_replace_vars() {
		$replace_vars = [
			'main_schema_id'   => 'https://basic.wordpress.test/schema-templates/',
			'author_id'        => 'https://basic.wordpress.test#/schema/person/a00dc884baa6bd52ebacc06cfd5aab21',
			'person_id'        => 'https://basic.wordpress.test#/schema/person/',
			'primary_image_id' => 'https://basic.wordpress.test/schema-templates#primaryimage',
			'webpage_id'       => 'https://basic.wordpress.test/schema-templates/',
			'website_id'       => 'https://basic.wordpress.test#website',
			'post_date'        => '2020-10-11T13:00:00+00:00',
			'organization_id'  => 'https://basic.wordpress.test#organization',
		];

		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->author_id = 'author_id';

		$post            = Mockery::mock( WP_Post::class );
		$post->post_date = '2020-10-11 13:00:00';

		$meta_tags_context                 = Mockery::mock( Meta_Tags_Context_Mock::class );
		$meta_tags_context->indexable      = $indexable;
		$meta_tags_context->post           = $post;
		$meta_tags_context->main_schema_id = 'https://basic.wordpress.test/schema-templates/';
		$meta_tags_context->site_url       = 'https://basic.wordpress.test';
		$meta_tags_context->canonical      = 'https://basic.wordpress.test/schema-templates';

		$this->id_helper
			->expects( 'get_user_schema_id' )
			->andReturn( 'https://basic.wordpress.test#/schema/person/a00dc884baa6bd52ebacc06cfd5aab21' );

		$this->date_helper
			->expects( 'format' )
			->with( '2020-10-11 13:00:00', \DATE_ATOM )
			->andReturn( '2020-10-11T13:00:00+00:00' );

		// Partial mock, to be able to spy on the `register_replacement` method.
		$instance = Mockery::mock(
			Replace_Vars_Helper::class,
			[
				$this->replace_vars,
				$this->id_helper,
				$this->date_helper,
			]
		)
			->shouldAllowMockingProtectedMethods()
			->makePartial();

		foreach ( $replace_vars as $var => $value ) {
			$instance
				->expects( 'register_replacement' )
				->with( $var, $value );
		}

		$instance->register_replace_vars( $meta_tags_context );
	}

	/**
	 * Tests the registration of the Schema ID replace vars when on a non-post.
	 * E.g. a term- or author archive page.
	 *
	 * @covers ::__construct
	 * @covers ::register_replace_vars
	 * @covers ::register_replacement
	 */
	public function test_registers_the_right_replace_vars_on_non_post() {
		$replace_vars = [
			'main_schema_id'   => 'https://basic.wordpress.test/schema-templates/',
			'author_id'        => 'https://basic.wordpress.test#/schema/person/a00dc884baa6bd52ebacc06cfd5aab21',
			'person_id'        => 'https://basic.wordpress.test#/schema/person/',
			'primary_image_id' => 'https://basic.wordpress.test/schema-templates#primaryimage',
			'webpage_id'       => 'https://basic.wordpress.test/schema-templates/',
			'website_id'       => 'https://basic.wordpress.test#website',
			'organization_id'  => 'https://basic.wordpress.test#organization',
		];

		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->author_id = 'author_id';

		$meta_tags_context                 = Mockery::mock( Meta_Tags_Context_Mock::class );
		$meta_tags_context->indexable      = $indexable;
		$meta_tags_context->main_schema_id = 'https://basic.wordpress.test/schema-templates/';
		$meta_tags_context->site_url       = 'https://basic.wordpress.test';
		$meta_tags_context->canonical      = 'https://basic.wordpress.test/schema-templates';

		$this->id_helper
			->expects( 'get_user_schema_id' )
			->andReturn( 'https://basic.wordpress.test#/schema/person/a00dc884baa6bd52ebacc06cfd5aab21' );

		// Partial mock, to be able to spy on the `register_replacement` method.
		$instance = Mockery::mock(
			Replace_Vars_Helper::class,
			[
				$this->replace_vars,
				$this->id_helper,
				$this->date_helper,
			]
		)
			->shouldAllowMockingProtectedMethods()
			->makePartial();

		foreach ( $replace_vars as $var => $value ) {
			$instance
				->expects( 'register_replacement' )
				->with( $var, $value );
		}

		$instance->register_replace_vars( $meta_tags_context );
	}

	/**
	 * Tests the replace method.
	 *
	 * @covers ::__construct
	 * @covers ::replace
	 */
	public function test_replace() {
		$schema_data = [
			'blockName' => 'FAQ Block',
			'attrs'     => [
				'questions' => [
					[
						'id'           => 'id-1',
						'jsonQuestion' => 'This is a question',
						'jsonAnswer'   => 'This is an answer',
					],
					[
						'id'           => 'id-2',
						'jsonQuestion' => 'This is a question with no answer',
					],
				],
			],
		];

		$presentation         = Mockery::mock( Indexable_Presentation::class );
		$presentation->source = [ 'post_content' => 'some text' ];

		$values = $this->array_values_recursively( $schema_data );

		// We expect all the schema values (the leafs) to be run through the replace vars.
		foreach ( $values as $value ) {
			$this->replace_vars
				->expects( 'replace' )
				->with( $value, $presentation->source );
		}

		$this->instance->replace( $schema_data, $presentation );
	}

	/**
	 * Tests that the `get_identity_function` returns an identity function.
	 *
	 * @covers ::get_identity_function
	 */
	public function test_get_identity_function() {
		$instance = new Replace_Vars_Helper_Double(
			$this->replace_vars,
			$this->id_helper,
			$this->date_helper
		);
		$value    = 'a_value';
		$closure  = $instance->get_identity_function( $value );
		self::assertEquals( $value, $closure( $value ) );
	}

	/**
	 * Returns all the values of the given nested array as one flat array.
	 *
	 * @param array $nested_array A nested array of key-value pairs.
	 *
	 * @return array All of the values in the nested array.
	 */
	protected function array_values_recursively( $nested_array ) {
		$merged = [];

		foreach ( $nested_array as $value ) {
			if ( \is_array( $value ) ) {
				$merged[] = $this->array_values_recursively( $value );
			}
			else {
				$merged[] = [ $value ];
			}
		}

		return \array_merge( ...$merged );
	}
}
