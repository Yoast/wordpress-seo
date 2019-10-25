<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Post_Type_Archive_Presentation;

use Mockery;
use Yoast\WP\Free\Helpers\Rel_Adjacent_Helper;
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
	 * Holds the Rel_Adjacent_Helper instance.
	 *
	 * @var Rel_Adjacent_Helper|Mockery\MockInterface
	 */
	protected $rel_adjacent;

	/**
	 * Builds an instance of Indexable_Post_Type_Archive_Presentation.
	 */
	protected function setInstance() {
		$this->indexable = new Indexable();

		$this->rel_adjacent = Mockery::mock( Rel_Adjacent_Helper::class );

		$instance = new Indexable_Post_Type_Archive_Presentation( $this->rel_adjacent );

		$this->instance = $instance->of( [ 'model' => $this->indexable ] );

		$this->set_instance_dependencies( $this->instance );
	}
}
