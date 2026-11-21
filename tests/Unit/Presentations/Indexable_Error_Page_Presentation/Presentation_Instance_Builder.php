<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Error_Page_Presentation;

use Yoast\WP\SEO\Presentations\Indexable_Error_Page_Presentation;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\Presentations\Presentation_Instance_Dependencies;

/**
 * Trait Presentation_Instance_Builder
 */
trait Presentation_Instance_Builder {

	use Presentation_Instance_Dependencies;

	/**
	 * Represents the indexable mock.
	 *
	 * @var Indexable_Mock
	 */
	protected $indexable;

	/**
	 * Represents the instance to test.
	 *
	 * @var Indexable_Error_Page_Presentation
	 */
	protected $instance;

	/**
	 * Builds an instance of Indexable_Error_Page_Presentation.
	 *
	 * @return void
	 */
	protected function set_instance() {
		$this->indexable = new Indexable_Mock();

		$instance = new Indexable_Error_Page_Presentation();

		$this->instance = $instance->of( [ 'model' => $this->indexable ] );

		$this->set_instance_dependencies( $this->instance );
	}
}
