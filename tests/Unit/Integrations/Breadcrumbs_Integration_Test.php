<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations;

use Mockery;
use WPSEO_Replace_Vars;
use Yoast\WP\SEO\Integrations\Breadcrumbs_Integration;
use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;
use Yoast\WP\SEO\Presenters\Breadcrumbs_Presenter;
use Yoast\WP\SEO\Surfaces\Helpers_Surface;
use Yoast\WP\SEO\Tests\Unit\Doubles\Presentations\Indexable_Presentation_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Breadcrumbs_Integration_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Breadcrumbs_Integration
 *
 * @group integrations
 */
final class Breadcrumbs_Integration_Test extends TestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var Breadcrumbs_Integration
	 */
	protected $instance;

	/**
	 * The breadcrumbs presenter.
	 *
	 * @var Breadcrumbs_Presenter
	 */
	protected $presenter;

	/**
	 * The meta tags context memoizer.
	 *
	 * @var Meta_Tags_Context_Memoizer
	 */
	protected $context_memoizer;

	/**
	 * Set up the class which will be tested.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->context_memoizer = Mockery::mock( Meta_Tags_Context_Memoizer::class );
		$this->instance         = new Breadcrumbs_Integration(
			Mockery::mock( Helpers_Surface::class ),
			Mockery::mock( WPSEO_Replace_Vars::class ),
			$this->context_memoizer
		);
	}

	/**
	 * Tests the get_conditionals functions.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals( [], Breadcrumbs_Integration::get_conditionals() );
	}

	/**
	 * Tests the render function.
	 *
	 * @covers ::render
	 *
	 * @return void
	 */
	public function test_render() {
		$indexable_presentation              = Mockery::mock( Indexable_Presentation_Mock::class );
		$indexable_presentation->breadcrumbs = [];

		$this->context_memoizer
			->expects( 'for_current_page' )
			->andReturn( (object) [ 'presentation' => $indexable_presentation ] );

		$this->assertEquals( '', $this->instance->render() );
	}
}
