<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters;

use Yoast\WP\SEO\Presenters\Abstract_Indexable_Tag_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Abstract_Indexable_Presenter_Test.
 *
 * @group presenters
 *
 * @phpcs:disable Yoast.Files.FileName.InvalidClassFileName
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Abstract_Indexable_Tag_Presenter_Test extends TestCase {

	/**
	 * Verifies that an exception is thrown, if a subclass does not specify the 'key' property.
	 *
	 * @covers \Yoast\WP\SEO\Presenters\Abstract_Indexable_Tag_Presenter
	 */
	public function test_key_not_defined() {
		$instance = new Concrete_Cached_Presenter();

		$this->expectException( 'InvalidArgumentException' );
		$this->expectExceptionMessage( 'Yoast\WP\SEO\Tests\Unit\Presenters\Concrete_Cached_Presenter is an Abstract_Indexable_Tag_Presenter but does not override the key property.' );

		$instance->present();
	}
}

/**
 * Class Concrete_Indexable_Presenter.
 *
 * @phpcs:disable Generic.Files.OneObjectStructurePerFile.MultipleFound Needed because abstract classes cannot be instantiated.
 */
class Concrete_Indexable_Presenter extends Abstract_Indexable_Tag_Presenter {

	/**
	 * A concrete implementation of get().
	 *
	 * @return string
	 */
	public function get() {
		return 'concrete';
	}
}
