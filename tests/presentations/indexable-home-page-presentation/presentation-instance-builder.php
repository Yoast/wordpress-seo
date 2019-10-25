<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Home_Page_Presentation;

use Mockery;
use Yoast\WP\Free\Helpers\Rel_Adjacent_Helper;
use Yoast\WP\Free\Presentations\Indexable_Home_Page_Presentation;
use Yoast\WP\Free\Tests\Mocks\Indexable;
use Yoast\WP\Free\Tests\Presentations\Presentation_Instance_Dependencies;

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
	 * @var Indexable_Home_Page_Presentation|Mockery\MockInterface
	 */
	protected $instance;

	/**
	 * Holds the Rel_Adjacent_Helper instance.
	 *
	 * @var Rel_Adjacent_Helper
	 */
	protected $rel_adjacent;

	/**
	 * Builds an instance of Indexable_Home_Page_Presentation.
	 */
	protected function setInstance() {
		$this->indexable = new Indexable();

		$this->rel_adjacent = Mockery::mock( Rel_Adjacent_Helper::class );

		$instance = Mockery::mock( Indexable_Home_Page_Presentation::class, [ $this->rel_adjacent ] )
			->makePartial()
			->shouldAllowMockingProtectedMethods();

		$this->instance = $instance->of( [ 'model' => $this->indexable ] );

		$this->set_instance_dependencies( $this->instance );
	}
}
