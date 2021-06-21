<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters;

use Mockery;
use Yoast\WP\SEO\Presenters\Abstract_Indexable_Tag_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Abstract_Indexable_Presenter_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Abstract_Indexable_Tag_Presenter
 *
 * @group presenters
 */
class Abstract_Indexable_Tag_Presenter_Test extends TestCase {

	public function test_key_not_defined() {
		$instance = new Concrete_Indexable_Presenter();

		$this->expectException( \InvalidArgumentException::class );
		$this->expectExceptionMessage( 'Concrete_Indexable_Presenter is an Abstract_Indexable_Tag_Presenter but does not provide a KEY constant.' );

		$instance->present();
	}
}

class Concrete_Indexable_Presenter extends Abstract_Indexable_Tag_Presenter {

	public function get()
	{
		return "concrete";
	}
}
