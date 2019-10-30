<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Post_Type_Archive_Presentation;

use Yoast\WP\Free\Presentations\Indexable_Post_Type_Archive_Presentation;
use Yoast\WP\Free\Tests\Mocks\Indexable;
use Yoast\WP\Free\Tests\Presentations\Presentation_Instance_Dependencies;

/**
 * Trait Presentation_Instance_Builder
 */
trait Presentation_Instance_Builder {
	use Presentation_Instance_Dependencies;

	/**
	 * Holds the Indexable instance.
	 *
	 * @var Indexable
	 */
	protected $indexable;

	/**
	 * Holds the Indexable_Post_Type_Archive_Presentation instance.
	 *
	 * @var Indexable_Post_Type_Archive_Presentation
	 */
	protected $instance;

	/**
	 * Builds an instance of Indexable_Post_Type_Archive_Presentation.
	 */
	protected function setInstance() {
		$this->indexable = new Indexable();

		$instance = new Indexable_Post_Type_Archive_Presentation();

		$this->instance = $instance->of( [ 'model' => $this->indexable ] );

		$this->set_instance_dependencies( $this->instance );
	}
}
