<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Date_Archive_Presentation;

use Yoast\WP\Free\Presentations\Indexable_Date_Archive_Presentation;
use Yoast\WP\Free\Tests\Mocks\Indexable;
use Yoast\WP\Free\Tests\Presentations\Presentation_Instance_Helpers;

/**
 * Trait Presentation_Instance_Builder
 */
trait Presentation_Instance_Builder {
	use Presentation_Instance_Helpers;

	/**
	 * @var Indexable
	 */
	protected $indexable;

	/**
	 * @var Indexable_Date_Archive_Presentation
	 */
	protected $instance;

	/**
	 * Builds an instance of Indexable_Post_Type_Presentation.
	 */
	protected function setInstance() {
		$this->indexable = new Indexable();

		$instance = new Indexable_Date_Archive_Presentation();

		$this->instance = $instance->of( [ 'model' => $this->indexable ] );

		$this->set_instance_helpers( $this->instance );
	}
}
