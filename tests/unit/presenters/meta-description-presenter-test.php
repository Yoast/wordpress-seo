<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters;

use Brain\Monkey;
use Mockery;
use WPSEO_Replace_Vars;
use Yoast\WP\SEO\Helpers\String_Helper;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Meta_Description_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Meta_Description_Presenter_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Meta_Description_Presenter
 *
 * @group presenters
 * @group twitter
 * @group twitter-description
 */
class Meta_Description_Presenter_Test extends TestCase {

	/**
	 * The WPSEO Replace Vars object.
	 *
	 * @var WPSEO_Replace_Vars|Mockery\MockInterface
	 */
	protected $replace_vars;

	/**
	 * The string helper mock.
	 *
	 * @var Mockery\MockInterface|String_Helper
	 */
	protected $string;

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var Meta_Description_Presenter
	 */
	protected $instance;

	/**
	 * The indexable presentation.
	 *
	 * @var Indexable_Presentation
	 */
	protected $indexable_presentation;

	/**
	 * Setup of the tests.
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		$this->replace_vars = Mockery::mock( WPSEO_Replace_Vars::class );
		$this->string       = Mockery::mock( String_Helper::class );

		$this->instance               = new Meta_Description_Presenter();
		$this->instance->replace_vars = $this->replace_vars;
		$this->instance->helpers      = (object) [
			'string' => $this->string,
		];

		$this->indexable_presentation         = new Indexable_Presentation();
		$this->indexable_presentation->source = [];

		$this->instance->presentation = $this->indexable_presentation;
	}

	/**
	 * Tests the presenter of the meta description.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_present_and_filter_happy_path() {
		$this->indexable_presentation->meta_description = 'the_meta_description';

		$this->replace_vars
			->expects( 'replace' )
			->once()
			->andReturnUsing(
				static function( $replace_string ) {
					return $replace_string;
				}
			);

		Monkey\Filters\expectApplied( 'wpseo_metadesc' )
			->once()
			->with( 'the_meta_description', $this->indexable_presentation )
			->andReturn( 'the_meta_description' );

		$this->string
			->expects( 'strip_all_tags' )
			->once()
			->with( 'the_meta_description' )
			->andReturn( 'the_meta_description' );

		$output = '<meta name="description" content="the_meta_description" />';

		$this->assertEquals( $output, $this->instance->present() );
	}

	/**
	 * Tests the presenter of the meta description when the meta description is empty.
	 *
	 * @covers ::present
	 */
	public function test_present_meta_description_not_string() {
		$this->indexable_presentation->meta_description = '';

		$this->replace_vars
			->expects( 'replace' )
			->once()
			->andReturnUsing(
				static function( $replace_string ) {
					return $replace_string;
				}
			);

		$this->string
			->expects( 'strip_all_tags' )
			->once()
			->with( '' )
			->andReturn( '' );

		Monkey\Functions\expect( 'current_user_can' )
			->once()
			->with( 'wpseo_manage_options' )
			->andReturn( false );

		$this->assertEmpty( $this->instance->present() );
	}

	/**
	 * Tests the presenter of the meta description when the meta description is empty
	 * and the current user can manage the options.
	 *
	 * @covers ::present
	 */
	public function test_present_meta_description_not_string_show_notice() {
		$this->indexable_presentation->meta_description = '';

		$this->replace_vars
			->expects( 'replace' )
			->once()
			->andReturnUsing(
				static function( $replace_string ) {
					return $replace_string;
				}
			);

		$this->string
			->expects( 'strip_all_tags' )
			->once()
			->with( '' )
			->andReturn( '' );

		Monkey\Functions\expect( 'current_user_can' )
			->once()
			->with( 'wpseo_manage_options' )
			->andReturn( true );

		$notice = '<!-- Admin only notice: this page does not show a meta description because it does not have one, either write it for this page specifically or go into the [SEO - Search Appearance] menu and set up a template. -->';

		$this->assertEquals( $notice, $this->instance->present() );
	}
}
