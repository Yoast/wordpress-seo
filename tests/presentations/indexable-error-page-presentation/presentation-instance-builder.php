<?php

namespace Yoast\WP\SEO\Tests\Presentations\Indexable_Error_Page_Presentation;

use Yoast\WP\SEO\Presentations\Indexable_Error_Page_Presentation;
use Yoast\WP\SEO\Tests\Mocks\Indexable;
use Yoast\WP\SEO\Tests\Presentations\Presentation_Instance_Dependencies;

/**
 * Trait Presentation_Instance_Builder
 */
trait Presentation_Instance_Builder {
	use Presentation_Instance_Dependencies;

	/**
	 * @var Indexable
	 */
	protected $indexable;

	/**
	 * @var Indexable_Error_Page_Presentation
	 */
	protected $instance;

	/**
	 * Builds an instance of Indexable_Error_Page_Presentation.
	 */
	protected function set_instance() {
		$this->indexable = new Indexable();

		$instance = new Indexable_Error_Page_Presentation();

		$this->instance = $instance->of( [ 'model' => $this->indexable ] );

		$this->set_instance_dependencies( $this->instance );
	}
}
