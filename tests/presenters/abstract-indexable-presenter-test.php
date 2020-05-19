<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Presenters
 */

namespace Yoast\WP\SEO\Tests\Presenters;

use Mockery;
use WPSEO_Replace_Vars;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Abstract_Indexable_Presenter;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Abstract_Presenter_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Abstract_Indexable_Presenter
 *
 * @group presenters
 */
class Abstract_Indexable_Presenter_Test extends TestCase {

	/**
	 * Tests the outputting of the value.
	 *
	 * @covers ::replace_vars
	 */
	public function test_replace_vars() {
		$replace_vars = Mockery::mock( WPSEO_Replace_Vars::class );
		$presentation = new Indexable_Presentation();
		$instance     = Mockery::mock( Abstract_Indexable_Presenter::class )->makePartial();

		$instance->replace_vars = $replace_vars;
		$instance->presentation = $presentation;

		$presentation->source = [ 123 ];

		$replace_vars
			->expects( 'replace' )
			->once()
			->with( 'the given value', [ 123 ] )
			->andReturn( 'the replaced value' );

		$this->assertSame( 'the replaced value', $instance->replace_vars( 'the given value' ) );
	}
}
