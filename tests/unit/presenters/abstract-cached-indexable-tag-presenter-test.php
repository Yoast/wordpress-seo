<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters;

use Yoast\WP\SEO\Presenters\Abstract_Cached_Indexable_Tag_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Abstract_Indexable_Presenter_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Abstract_Cached_Indexable_Tag_Presenter
 *
 * @group presenters
 */
class Abstract_Cached_Indexable_Tag_Presenter_Test extends TestCase {

	public function test_get_should_run_once() {
		$instance = new Concrete_Cached_Presenter();

		$initial = $instance->get(); // hit count 1;
		$cached  = $instance->get(); // cache hit;
		$cached2 = $instance->get(); // cache hit;

		$this->assertEquals( $initial, $cached );
		$this->assertEquals( $initial, $cached2 );
		$this->assertEquals( 1, $instance->get_hit_count() );
	}
}

class Concrete_Cached_Presenter extends Abstract_Cached_Indexable_Tag_Presenter {

	protected $hit_count = 0;

	/**
	 * For testing purposes, returns the number of times a refresh was run.
	 *
	 * @return int
	 */
	public function get_hit_count() {
		return $this->hit_count;
	}

	/**
	 * provide a fresh value
	 *
	 * @return string
	 */
	public function refresh() {
		 $this->hit_count++;
		return 'value refreshed!';
	}
}
