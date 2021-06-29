<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters;

use Mockery;
use WPSEO_Replace_Vars;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Abstract_Indexable_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Abstract_Indexable_Presenter_Test.
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

	/**
	 * Verifies that an exception is thrown, if a subclass does not specify the 'key' property.
	 *
	 * @covers \Yoast\WP\SEO\Presenters\Abstract_Indexable_Presenter
	 */
	public function test_key_not_defined() {
		$instance = new Concrete_Indexable_Presenter();

		$this->expectException( 'InvalidArgumentException' );
		$this->expectExceptionMessage( 'Yoast\WP\SEO\Tests\Unit\Presenters\Concrete_Indexable_Presenter is an Abstract_Indexable_Presenter but does not override the key property.' );

		$instance->present();
	}
}

/**
 * Class Concrete_Indexable_Presenter.
 *
 * @phpcs:disable Generic.Files.OneObjectStructurePerFile.MultipleFound
 */
class Concrete_Indexable_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * A concrete implementation of get().
	 *
	 * @return string
	 */
	public function get() {
		return 'concrete';
	}
}
