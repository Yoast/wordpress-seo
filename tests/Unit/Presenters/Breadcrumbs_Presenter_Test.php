<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Breadcrumbs_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Breadcrumbs_Presenter_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Breadcrumbs_Presenter
 *
 * @group presenters
 * @group breadcrumbs
 */
final class Breadcrumbs_Presenter_Test extends TestCase {

	/**
	 * The options helper mock.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options;

	/**
	 * The breadcrumbs presenter instance.
	 *
	 * @var Breadcrumbs_Presenter
	 */
	private $instance;

	/**
	 * The indexable presentation.
	 *
	 * @var Indexable_Presentation
	 */
	private $presentation;

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubEscapeFunctions();

		$this->options = Mockery::mock( Options_Helper::class );

		$this->instance = Mockery::mock( Breadcrumbs_Presenter::class )
			->makePartial()
			->shouldAllowMockingProtectedMethods();

		$this->instance->helpers = (object) [
			'options' => $this->options,
		];

		$this->instance->presentation = new Indexable_Presentation();
		$this->presentation           = $this->instance->presentation;
	}

	/**
	 * Tests the presenter of the breadcrumbs when all goes well.
	 *
	 * @covers ::present
	 * @covers ::filter
	 *
	 * @return void
	 */
	public function test_present_happy_path() {
		$breadcrumb_1 = [
			'url'  => 'home_url',
			'text' => 'home_title',
		];
		$breadcrumb_2 = [
			'url'  => 'post_url',
			'text' => 'post_title',
			'id'   => 'post_id',
		];

		$this->presentation->breadcrumbs = [
			$breadcrumb_1,
			$breadcrumb_2,
		];

		$this->instance->expects( 'crumb_to_link' )
			->with( $breadcrumb_1, 0, 2 )
			->andReturn( '<a href="home_url">home_title</a>' );

		$this->instance->expects( 'crumb_to_link' )
			->with( $breadcrumb_2, 1, 2 )
			->andReturn( 'post_title' );

		$this->instance->expects( 'get_separator' )
			->once()
			->withNoArgs()
			->andReturn( ' » ' );

		$this->instance->expects( 'get_wrapper' )
			->twice()
			->withNoArgs()
			->andReturn( 'span' );

		$this->instance->expects( 'get_id' )
			->once()
			->withNoArgs()
			->andReturn( ' id="example_id"' );

		$this->instance->expects( 'get_class' )
			->once()
			->withNoArgs()
			->andReturn( ' class="example_class"' );

		$output_without_prefix = '<span id="example_id" class="example_class"><a href="home_url">home_title</a> » post_title</span>';

		Monkey\Filters\expectApplied( 'wpseo_breadcrumb_output' )
			->once()
			->with( $output_without_prefix, $this->presentation )
			->andReturn( $output_without_prefix );

		$this->options->expects( 'get' )
			->once()
			->with( 'breadcrumbs-prefix' )
			->andReturn( 'example_breadcrumbs_prefix' );

		$output_with_prefix = "\t" . 'example_breadcrumbs_prefix' . "\n" . $output_without_prefix;

		$this->assertEquals(
			$output_with_prefix,
			$this->instance->present()
		);
	}

	/**
	 * Tests the presenter of the breadcrumbs when the breadcrumbs are not in array format.
	 *
	 * @covers ::present
	 *
	 * @return void
	 */
	public function test_present_breadcrumbs_not_array() {
		$breadcrumb = 'breadcrumb_string';

		$this->presentation->breadcrumbs = $breadcrumb;

		$this->assertEmpty( $this->instance->present() );
	}

	/**
	 * Tests the presenter of the breadcrumbs when the breadcrumbs are empty.
	 *
	 * @covers ::present
	 *
	 * @return void
	 */
	public function test_present_breadcrumbs_empty() {
		$breadcrumb = '';

		$this->presentation->breadcrumbs = $breadcrumb;

		$this->assertEmpty( $this->instance->present() );
	}

	/**
	 * Tests the presenter of the breadcrumbs when the output is empty.
	 *
	 * @covers ::present
	 *
	 * @return void
	 */
	public function test_present_empty_output() {
		$breadcrumb_1 = [];
		$breadcrumb_2 = [];

		$this->presentation->breadcrumbs = [
			$breadcrumb_1,
			$breadcrumb_2,
		];

		$this->instance->expects( 'crumb_to_link' )
			->with( $breadcrumb_1, 0, 2 )
			->andReturn( '' );

		$this->instance->expects( 'crumb_to_link' )
			->with( $breadcrumb_2, 1, 2 )
			->andReturn( '' );

		$this->instance->expects( 'get_separator' )
			->once()
			->withNoArgs()
			->andReturn( ' » ' );

		$this->assertEmpty( $this->instance->present() );
	}

	/**
	 * Tests the presenter of the breadcrumbs when there is no breadcrumbs prefix.
	 *
	 * @covers ::present
	 * @covers ::filter
	 *
	 * @return void
	 */
	public function test_present_no_breadcrumbs_prefix() {
		$breadcrumb_1 = [
			'url'  => 'home_url',
			'text' => 'home_title',
		];
		$breadcrumb_2 = [
			'url'  => 'post_url',
			'text' => 'post_title',
			'id'   => 'post_id',
		];

		$this->presentation->breadcrumbs = [
			$breadcrumb_1,
			$breadcrumb_2,
		];

		$this->instance->expects( 'crumb_to_link' )
			->with( $breadcrumb_1, 0, 2 )
			->andReturn( '<a href="home_url">home_title</a>' );

		$this->instance->expects( 'crumb_to_link' )
			->with( $breadcrumb_2, 1, 2 )
			->andReturn( 'post_title' );

		$this->instance->expects( 'get_separator' )
			->once()
			->withNoArgs()
			->andReturn( ' » ' );

		$this->instance->expects( 'get_wrapper' )
			->twice()
			->withNoArgs()
			->andReturn( 'span' );

		$this->instance->expects( 'get_id' )
			->once()
			->withNoArgs()
			->andReturn( ' id="example_id"' );

		$this->instance->expects( 'get_class' )
			->once()
			->withNoArgs()
			->andReturn( ' class="example_class"' );

		$output_without_prefix = '<span id="example_id" class="example_class"><a href="home_url">home_title</a> » post_title</span>';

		Monkey\Filters\expectApplied( 'wpseo_breadcrumb_output' )
			->once()
			->with( $output_without_prefix, $this->presentation )
			->andReturn( $output_without_prefix );

		$this->options->expects( 'get' )
			->once()
			->with( 'breadcrumbs-prefix' )
			->andReturn( '' );

		$this->assertEquals(
			$output_without_prefix,
			$this->instance->present()
		);
	}

	/**
	 * Tests the creation of a breadcrumb element string when it's not the last element
	 * and all goes well.
	 *
	 * @covers ::crumb_to_link
	 *
	 * @return void
	 */
	public function test_crumb_to_link_not_last_element() {
		$breadcrumb = [
			'url'  => 'home_url',
			'text' => 'home_text',
		];

		$this->instance->expects( 'get_element' )
			->twice()
			->withNoArgs()
			->andReturn( 'span' );

		$link = '<span><a href="home_url">home_text</a></span>';

		$this->assertEquals(
			$link,
			$this->instance->crumb_to_link( $breadcrumb, 0, 2 )
		);
	}

	/**
	 * Tests whether the filter is applied when creating a breadcrumb element string.
	 *
	 * @covers ::crumb_to_link
	 *
	 * @return void
	 */
	public function test_crumb_to_link_filter_applied() {
		$breadcrumb = [
			'url'  => 'home_url',
			'text' => 'home_text',
		];

		$this->instance->expects( 'get_element' )
			->twice()
			->withNoArgs()
			->andReturn( 'span' );

		$link = '<span><a href="home_url">home_text</a></span>';

		Monkey\Filters\expectApplied( 'wpseo_breadcrumb_single_link' )
			->once()
			->with( $link, $breadcrumb )
			->andReturn( $link );

		$this->assertEquals(
			$link,
			$this->instance->crumb_to_link( $breadcrumb, 0, 2 )
		);
	}

	/**
	 * Tests the creation of a breadcrumb element string when it's not the last element
	 * and a title is set.
	 *
	 * @covers ::crumb_to_link
	 *
	 * @return void
	 */
	public function test_crumb_to_link_title_is_set() {
		$breadcrumb = [
			'url'   => 'home_url',
			'text'  => 'home_text',
			'title' => 'home_title',
		];

		$this->instance->expects( 'get_element' )
			->twice()
			->withNoArgs()
			->andReturn( 'span' );

		$link = '<span><a href="home_url" title="home_title">home_text</a></span>';

		$this->assertEquals(
			$link,
			$this->instance->crumb_to_link( $breadcrumb, 0, 2 )
		);
	}

	/**
	 * Tests the creation of a breadcrumb element has target blank in the editor.
	 *
	 * @covers ::crumb_to_link
	 *
	 * @return void
	 */
	public function test_crumb_in_editor() {
		$breadcrumb = [
			'url'   => 'home_url',
			'text'  => 'home_text',
			'title' => 'home_title',
		];

		$this->instance->expects( 'get_element' )
			->twice()
			->withNoArgs()
			->andReturn( 'span' );

		$link = '<span><a target="_blank" href="home_url" title="home_title">home_text</a></span>';

		$_GET['context'] = 'edit';
		$this->assertEquals(
			$link,
			$this->instance->crumb_to_link( $breadcrumb, 0, 2 )
		);
		unset( $_GET['context'] );
	}

	/**
	 * Tests the creation of a breadcrumb element string when it's the last element
	 * and the last element should be bolded.
	 *
	 * @covers ::crumb_to_link
	 *
	 * @return void
	 */
	public function test_crumb_to_link_last_element_bold() {
		$breadcrumb = [
			'url'  => 'page_url',
			'text' => 'page_text',
		];

		$this->options->expects( 'get' )
			->once()
			->with( 'breadcrumbs-boldlast' )
			->andReturnTrue();

		$link = '<span class="breadcrumb_last" aria-current="page"><strong>page_text</strong>';

		$this->instance->expects( 'get_element' )
			->twice()
			->withNoArgs()
			->andReturn( 'span' );

		$link .= '</span>';

		$this->assertEquals(
			$link,
			$this->instance->crumb_to_link( $breadcrumb, 1, 2 )
		);
	}

	/**
	 * Tests the creation of a breadcrumb element string when it's the last element
	 * and the last element should not be bolded.
	 *
	 * @covers ::crumb_to_link
	 *
	 * @return void
	 */
	public function test_crumb_to_link_last_element_not_bold() {
		$breadcrumb = [
			'url'  => 'page_url',
			'text' => 'page_text',
		];

		$this->options->expects( 'get' )
			->once()
			->with( 'breadcrumbs-boldlast' )
			->andReturnFalse();

		$link = '<span class="breadcrumb_last" aria-current="page">page_text';

		$this->instance->expects( 'get_element' )
			->twice()
			->withNoArgs()
			->andReturn( 'span' );

		$link .= '</span>';

		$this->assertEquals(
			$link,
			$this->instance->crumb_to_link( $breadcrumb, 1, 2 )
		);
	}

	/**
	 * Tests whether enough closing elements are added to the breadcrumb
	 * when it's the last element.
	 *
	 * @covers ::crumb_to_link
	 *
	 * @return void
	 */
	public function test_crumb_to_link_add_closing_elements() {
		$breadcrumb = [
			'url'  => 'page_url',
			'text' => 'page_text',
		];

		$this->options->expects( 'get' )
			->once()
			->with( 'breadcrumbs-boldlast' )
			->andReturnTrue();

		$link = '<span class="breadcrumb_last" aria-current="page"><strong>page_text</strong>';

		$this->instance->expects( 'get_element' )
			->times( 2 )
			->withNoArgs()
			->andReturn( 'span' );

		$link .= '</span>';

		$this->assertEquals(
			$link,
			$this->instance->crumb_to_link( $breadcrumb, 3, 4 )
		);
	}

	/**
	 * Tests the creation of a breadcrumb element string when the breadcrumb text is not set.
	 *
	 * @covers ::crumb_to_link
	 *
	 * @return void
	 */
	public function test_crumb_to_link_with_text_not_set() {
		$breadcrumb = [ 'url' => 'home_url' ];

		$this->assertEmpty( $this->instance->crumb_to_link( $breadcrumb, 0, 2 ) );
	}

	/**
	 * Tests the creation of a breadcrumb element string when the breadcrumb text is not a string.
	 *
	 * @covers ::crumb_to_link
	 *
	 * @return void
	 */
	public function test_crumb_to_link_with_text_not_string() {
		$breadcrumb = [
			'url'  => 'home_url',
			'text' => 123,
		];

		$this->assertEmpty( $this->instance->crumb_to_link( $breadcrumb, 0, 2 ) );
	}

	/**
	 * Tests the creation of a breadcrumb element string when the breadcrumb text is empty.
	 *
	 * @covers ::crumb_to_link
	 *
	 * @return void
	 */
	public function test_crumb_to_link_with_empty_text() {
		$breadcrumb = [
			'url'  => 'home_url',
			'text' => '',
		];

		$this->assertEmpty( $this->instance->crumb_to_link( $breadcrumb, 0, 2 ) );
	}

	/**
	 * Tests the creation of a breadcrumb element string when it's the last element
	 * but the breadcrumb URL is not set.
	 *
	 * @covers ::crumb_to_link
	 *
	 * @return void
	 */
	public function test_crumb_to_link_with_url_not_set() {
		$breadcrumb = [ 'text' => 'home_text' ];

		$link = '<span>home_text</span>';

		$this->assertEquals( $link, $this->instance->crumb_to_link( $breadcrumb, 0, 2 ) );
	}

	/**
	 * Tests the creation of a breadcrumb element string when it's the last element
	 * but the breadcrumb URL is not a string.
	 *
	 * @covers ::crumb_to_link
	 *
	 * @return void
	 */
	public function test_crumb_to_link_with_url_not_string() {
		$breadcrumb = [
			'url'  => 123,
			'text' => 'home_text',
		];

		$link = '<span>home_text</span>';

		$this->assertEquals( $link, $this->instance->crumb_to_link( $breadcrumb, 0, 2 ) );
	}

	/**
	 * Tests the creation of a breadcrumb element string when it's the last element
	 * but the breadcrumb URL is empty.
	 *
	 * @covers ::crumb_to_link
	 *
	 * @return void
	 */
	public function test_crumb_to_link_with_url_empty() {
		$breadcrumb = [
			'url'  => '',
			'text' => 'home_text',
		];

		$link = '<span>home_text</span>';

		$this->assertEquals( $link, $this->instance->crumb_to_link( $breadcrumb, 0, 2 ) );
	}

	/**
	 * Tests the retrieval of the HTML ID attribute when the ID is set through the filter.
	 *
	 * @covers ::get_id
	 *
	 * @return void
	 */
	public function test_get_id_where_id_is_set_in_filter() {
		Monkey\Filters\expectApplied( 'wpseo_breadcrumb_output_id' )
			->once()
			->with( '' )
			->andReturn( 'the_id' );

		$id = ' id="the_id"';

		$this->assertEquals( $id, $this->instance->get_id() );
		// Call it again to test that the ID is not built again.
		$this->assertEquals( $id, $this->instance->get_id() );
	}

	/**
	 * Tests the retrieval of the HTML ID attribute when the ID set through the filter
	 * is not a string.
	 *
	 * @covers ::get_id
	 *
	 * @return void
	 */
	public function test_get_id_not_string() {
		Monkey\Filters\expectApplied( 'wpseo_breadcrumb_output_id' )
			->once()
			->with( '' )
			->andReturn( 123 );

		$this->assertEmpty( $this->instance->get_id() );
	}

	/**
	 * Tests the retrieval of the HTML ID attribute when the ID is not set through the filter.
	 *
	 * @covers ::get_id
	 *
	 * @return void
	 */
	public function test_get_id_no_id_set() {
		Monkey\Filters\expectApplied( 'wpseo_breadcrumb_output_id' )
			->once()
			->with( '' )
			->andReturn( '' );

		$this->assertEmpty( $this->instance->get_id() );
	}

	/**
	 * Tests the retrieval of the HTML class attribute when the class is set through the filter.
	 *
	 * @covers ::get_class
	 *
	 * @return void
	 */
	public function test_get_class_where_class_is_set_in_filter() {
		Monkey\Filters\expectApplied( 'wpseo_breadcrumb_output_class' )
			->once()
			->with( '' )
			->andReturn( 'the_class' );

		$class = ' class="the_class"';

		$this->assertEquals( $class, $this->instance->get_class() );
		// Call it again to test that the class is not built again.
		$this->assertEquals( $class, $this->instance->get_class() );
	}

	/**
	 * Tests the retrieval of the HTML class attribute when the class set through the filter
	 * is not a string.
	 *
	 * @covers ::get_class
	 *
	 * @return void
	 */
	public function test_get_class_not_string() {
		Monkey\Filters\expectApplied( 'wpseo_breadcrumb_output_class' )
			->once()
			->with( '' )
			->andReturn( 123 );

		$this->assertEmpty( $this->instance->get_class() );
	}

	/**
	 * Tests the retrieval of the HTML class attribute when the class is not set through the filter.
	 *
	 * @covers ::get_class
	 *
	 * @return void
	 */
	public function test_get_class_no_class_set() {
		Monkey\Filters\expectApplied( 'wpseo_breadcrumb_output_class' )
			->once()
			->with( '' )
			->andReturn( '' );

		$this->assertEmpty( $this->instance->get_class() );
	}

	/**
	 * Tests the retrieval of the wrapper element name when the wrapper is set through the filter.
	 *
	 * @covers ::get_wrapper
	 *
	 * @return void
	 */
	public function test_get_wrapper_where_wrapper_is_set_in_filter() {
		Monkey\Filters\expectApplied( 'wpseo_breadcrumb_output_wrapper' )
			->once()
			->with( 'span' )
			->andReturn( 'span' );

		Monkey\Functions\expect( 'tag_escape' )
			->once()
			->with( 'span' )
			->andReturn( 'span' );

		$this->assertEquals( 'span', $this->instance->get_wrapper() );
		// Call it again to test that the wrapper is not built again.
		$this->assertEquals( 'span', $this->instance->get_wrapper() );
	}

	/**
	 * Tests the retrieval of the wrapper element name
	 * when the wrapper that is set through the filter, is not a string.
	 *
	 * @covers ::get_wrapper
	 *
	 * @return void
	 */
	public function test_get_wrapper_where_wrapper_not_a_string() {
		Monkey\Filters\expectApplied( 'wpseo_breadcrumb_output_wrapper' )
			->once()
			->with( 'span' )
			->andReturn( 123 );

		Monkey\Functions\expect( 'tag_escape' )
			->once()
			->with( 123 )
			->andReturn( 123 );

		$this->assertEquals( 'span', $this->instance->get_wrapper() );
	}

	/**
	 * Tests the retrieval of the wrapper element name
	 * when the wrapper that is set through the filter, is empty.
	 *
	 * @covers ::get_wrapper
	 *
	 * @return void
	 */
	public function test_get_wrapper_where_wrapper_empty() {
		Monkey\Filters\expectApplied( 'wpseo_breadcrumb_output_wrapper' )
			->once()
			->with( 'span' )
			->andReturn( '' );

		Monkey\Functions\expect( 'tag_escape' )
			->once()
			->with( '' )
			->andReturn( '' );

		$this->assertEquals( 'span', $this->instance->get_wrapper() );
	}

	/**
	 * Tests the retrieval of the separator.
	 *
	 * @covers ::get_separator
	 *
	 * @return void
	 */
	public function test_get_separator() {
		$this->options->expects( 'get' )
			->once()
			->with( 'breadcrumbs-sep' )
			->andReturn( 'the_separator' );

		Monkey\Filters\expectApplied( 'wpseo_breadcrumb_separator' )
			->once()
			->with( 'the_separator' )
			->andReturn( 'the_separator' );

		$separator = ' the_separator ';

		$this->assertEquals( $separator, $this->instance->get_separator() );
		// Call it again to test that the separator is not built again.
		$this->assertEquals( $separator, $this->instance->get_separator() );
	}

	/**
	 * Tests the retrieval of the crumb element name.
	 *
	 * @covers ::get_element
	 *
	 * @return void
	 */
	public function test_get_element() {
		Monkey\Filters\expectApplied( 'wpseo_breadcrumb_single_link_wrapper' )
			->once()
			->with( 'span' )
			->andReturn( 'span' );

		$this->assertEquals( 'span', $this->instance->get_element() );
		// Call it again to test that the element is not built again.
		$this->assertEquals( 'span', $this->instance->get_element() );
	}

	/**
	 * Tests the retrieval of the raw value.
	 *
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_get() {
		$breadcrumb_1 = [
			'url'  => 'home_url',
			'text' => 'home_title',
		];
		$breadcrumb_2 = [
			'url'  => 'post_url',
			'text' => 'post_title',
			'id'   => 'post_id',
		];

		$this->presentation->breadcrumbs = [
			$breadcrumb_1,
			$breadcrumb_2,
		];

		$this->assertEquals(
			[
				$breadcrumb_1,
				$breadcrumb_2,
			],
			$this->instance->get()
		);
	}
}
