<?php
/**
 * WPSEO plugin test file.
 */

namespace Yoast\WP\SEO\Tests\Presenters;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Breadcrumbs_Presenter;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Breadcrumbs_Presenter_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Breadcrumbs_Presenter
 *
 * @group presenters
 * @group breadcrumbs
 */
class Breadcrumbs_Presenter_Test extends TestCase {

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
	 */
	public function setUp() {
		$this->options = Mockery::mock( Options_Helper::class );

		$this->instance     = Mockery::mock( Breadcrumbs_Presenter::class, [ $this->options ] )
		                             ->makePartial()
		                             ->shouldAllowMockingProtectedMethods();
		$this->presentation = new Indexable_Presentation();

		return parent::setUp();
	}

	/**
	 * Tests the presenter of the breadcrumbs when all goes well.
	 *
	 * @covers ::present
	 */
	public function test_present_happy_path() {
		$breadcrumb_1 = [ 'url' => 'home_url', 'text' => 'home_title' ];
		$breadcrumb_2 = [ 'url' => 'post_url', 'text' => 'post_title', 'id' => 'post_id' ];

		$this->presentation->breadcrumbs =
			[
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
			$this->instance->present( $this->presentation ) );
	}

	/**
	 * Tests the presenter of the breadcrumbs when the breadcrumbs are not in array format.
	 *
	 * @covers ::present
	 */
	public function test_present_breadcrumbs_not_array() {
		$breadcrumb = 'breadcrumb_string';

		$this->presentation->breadcrumbs = $breadcrumb;

		$this->assertEmpty( $this->instance->present( $this->presentation ) );
	}

	/**
	 * Tests the presenter of the breadcrumbs when the breadcrumbs are empty.
	 *
	 * @covers ::present
	 */
	public function test_present_breadcrumbs_empty() {
		$breadcrumb = '';

		$this->presentation->breadcrumbs = $breadcrumb;

		$this->assertEmpty( $this->instance->present( $this->presentation ) );
	}

	/**
	 * Tests the presenter of the breadcrumbs when the output is empty.
	 *
	 * @covers ::present
	 */
	public function test_present_empty_output() {
		$breadcrumb_1 = [];
		$breadcrumb_2 = [];

		$this->presentation->breadcrumbs =
			[
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

		$this->assertEmpty( $this->instance->present( $this->presentation ) );
	}

	/**
	 * Tests the presenter of the breadcrumbs when there is no breadcrumbs prefix.
	 *
	 * @covers ::present
	 */
	public function test_present_no_breadcrumbs_prefix() {
		$breadcrumb_1 = [ 'url' => 'home_url', 'text' => 'home_title' ];
		$breadcrumb_2 = [ 'url' => 'post_url', 'text' => 'post_title', 'id' => 'post_id' ];

		$this->presentation->breadcrumbs =
			[
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
			$this->instance->present( $this->presentation ) );
	}
}
