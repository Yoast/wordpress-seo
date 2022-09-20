<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters;

use Brain\Monkey;
use Mockery;
use WP_User;
use Yoast\WP\SEO\Helpers\Schema\HTML_Helper;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Meta_Author_Presenter;
use Yoast\WP\SEO\Tests\Unit\Doubles\Context\Meta_Tags_Context_Mock;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Meta_Description_Presenter_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Meta_Author_Presenter
 *
 * @group presenters
 * @group opengraph
 */
class Meta_Author_Presenter_Test extends TestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var HTML_Helper|Mockery\MockInterface
	 */
	protected $html;

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var Meta_Tags_Context_Mock|Mockery\MockInterface
	 */
	protected $context;

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var Meta_Author_Presenter
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

		$this->html    = Mockery::mock( HTML_Helper::class );
		$this->context = Mockery::mock( Meta_Tags_Context_Mock::class );

		$this->instance          = new Meta_Author_Presenter();
		$this->instance->helpers = (object) [
			'schema' => (object) [
				'html' => $this->html,
			],
		];

		$this->context->post = (object) [
			'post_author' => 123,
		];

		$this->indexable_presentation          = new Indexable_Presentation();
		$this->indexable_presentation->context = $this->context;

		$this->instance->presentation = $this->indexable_presentation;
	}

	/**
	 * Tests the presenter of the meta description.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_present_and_filter_happy_path() {
		$this->indexable_presentation->model                  = new Indexable_Mock();
		$this->indexable_presentation->model->object_sub_type = 'post';

		$user_mock               = Mockery::mock( WP_User::class );
		$user_mock->display_name = 'John Doe';

		Monkey\Functions\expect( 'get_userdata' )
			->once()
			->with( 123 )
			->andReturn( $user_mock );

		$this->html
			->expects( 'smart_strip_tags' )
			->once()
			->with( 'John Doe' )
			->andReturn( 'John Doe' );
		Monkey\Functions\expect( 'is_admin_bar_showing' )->andReturn( false );

		$output = '<meta name="author" content="John Doe" />';

		Monkey\Filters\expectApplied( 'wpseo_meta_author' );
		$this->assertSame( $output, $this->instance->present() );
	}

	/**
	 * Tests the presenter of the meta description when there's a failure.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_present_and_filter_unhappy_path() {
		$this->indexable_presentation->model                  = new Indexable_Mock();
		$this->indexable_presentation->model->object_sub_type = 'post';

		Monkey\Functions\expect( 'get_userdata' )
			->once()
			->with( 123 )
			->andReturnFalse();
		Monkey\Functions\expect( 'is_admin_bar_showing' )->andReturn( false );

		$this->html
			->expects( 'smart_strip_tags' )
			->never();

		$output = '';

		$this->assertSame( $output, $this->instance->present() );
	}

	/**
	 * Tests the presenter of the meta description when we are not on a post.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_present_and_filter_not_a_post() {
		$this->indexable_presentation->model                  = new Indexable_Mock();
		$this->indexable_presentation->model->object_sub_type = 'page';

		Monkey\Functions\expect( 'get_userdata' )
			->never();

		$this->html
			->expects( 'smart_strip_tags' )
			->never();

		$output = '';

		$this->assertSame( $output, $this->instance->present() );
	}

	/**
	 * Tests the presenter of the meta description when the admin bar is showing a class is added.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_present_and_filter_with_class() {
		$this->indexable_presentation->model                  = new Indexable_Mock();
		$this->indexable_presentation->model->object_sub_type = 'post';

		$user_mock               = Mockery::mock( WP_User::class );
		$user_mock->display_name = 'John Doe';

		Monkey\Functions\expect( 'get_userdata' )
			->once()
			->with( 123 )
			->andReturn( $user_mock );

		$this->html
			->expects( 'smart_strip_tags' )
			->once()
			->with( 'John Doe' )
			->andReturn( 'John Doe' );
		Monkey\Functions\expect( 'is_admin_bar_showing' )->andReturn( true );

		$output = '<meta name="author" content="John Doe" class="yoast-seo-meta-tag" />';

		$this->assertSame( $output, $this->instance->present() );
	}
}
