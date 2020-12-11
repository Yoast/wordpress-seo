<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers\Schema;

use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Tests\Unit\Doubles\Context\Meta_Tags_Context_Mock;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

use Brain\Monkey;
use Mockery;

use Yoast\WP\SEO\Helpers\Schema\Replace_Vars_Helper;

use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;
use WPSEO_Replace_Vars;
use Yoast\WP\SEO\Helpers\Schema\ID_Helper;

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

		$this->meta_tags_context_memoizer = Mockery::mock( Meta_Tags_Context_Memoizer::class );
		$this->replace_vars               = Mockery::mock( WPSEO_Replace_Vars::class );
		$this->id_helper                  = Mockery::mock( ID_Helper::class );

		$this->instance = new Replace_Vars_Helper(
			$this->meta_tags_context_memoizer,
			$this->replace_vars,
			$this->id_helper
		);
	}

	/**
	 * Tests the registration of the Schema ID replace vars.
	 *
	 * @covers ::register_replace_vars
	 * @covers ::maybe_register_replacement
	 */
	public function test_register_replace_vars() {
		$replace_vars = [
			'main_schema_id'   => 'https://basic.wordpress.test/schema-templates/#webpage',
			'author_id'        => 'https://basic.wordpress.test#/schema/person/a00dc884baa6bd52ebacc06cfd5aab21',
			'person_id'        => 'https://basic.wordpress.test#/schema/person/',
			'primary_image_id' => 'https://basic.wordpress.test/schema-templates#primaryimage',
			'webpage_id'       => 'https://basic.wordpress.test/schema-templates#webpage',
			'website_id'       => 'https://basic.wordpress.test#website',
		];

		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->author_id = 'author_id';

		$meta_tags_context                 = Mockery::mock( Meta_Tags_Context_Mock::class );
		$meta_tags_context->indexable      = $indexable;
		$meta_tags_context->main_schema_id = $replace_vars['main_schema_id'];
		$meta_tags_context->site_url       = 'https://basic.wordpress.test';
		$meta_tags_context->canonical      = 'https://basic.wordpress.test/schema-templates';

		$this->meta_tags_context_memoizer
			->expects( 'for_current_page' )
			->andReturn( $meta_tags_context );

		$this->id_helper
			->expects( 'get_user_schema_id' )
			->andReturn( $replace_vars['author_id'] );

		foreach ( $replace_vars as $var => $value ) {
			$this->replace_vars
				->expects( 'has_been_registered' )
				->with( $var )
				->andReturnFalse();
		}

		/*
		 * Need to make a partial mock, since we are not able to mock
		 * the static WPSEO_Replace_Vars::register_replacement method.
		 */
		$instance = Mockery::mock(
			Replace_Vars_Helper::class,
			[
				$this->meta_tags_context_memoizer,
				$this->replace_vars,
				$this->id_helper,
			]
		)
			->shouldAllowMockingProtectedMethods()
			->makePartial();

		foreach ( $replace_vars as $var => $value ) {
			$instance
				->expects( 'register_replacement' )
				->with( $var, $value );
		}

		$instance->register_replace_vars();
	}

	/**
	 * Tests the replace method.
	 *
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
		$presentation->source = [];

		$this->replace_vars
			->expects( 'replace' )
			->times( 6 );

		$this->instance->replace( $schema_data, $presentation );
	}
}
