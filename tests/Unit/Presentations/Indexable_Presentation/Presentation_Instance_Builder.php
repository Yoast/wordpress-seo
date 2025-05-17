<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Presentation;

use Mockery;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Tests\Unit\Doubles\Context\Meta_Tags_Context_Mock;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\Presentations\Presentation_Instance_Dependencies;

/**
 * Trait Presentation_Instance_Builder
 */
trait Presentation_Instance_Builder {

	use Presentation_Instance_Dependencies;

	/**
	 * Represents an indexable mock object.
	 *
	 * @var Indexable_Mock
	 */
	protected $indexable;

	/**
	 * Represents the instance to test.
	 *
	 * @var Indexable_Presentation
	 */
	protected $instance;

	/**
	 * Represents the meta tags context mock object.
	 *
	 * @var Meta_Tags_Context_Mock|Mockery\MockInterface
	 */
	protected $context;

	/**
	 * Builds an instance of Indexable_Post_Type_Presentation.
	 *
	 * @return void
	 */
	protected function set_instance() {
		$this->indexable = new Indexable_Mock();

		$this->context = Mockery::mock( Meta_Tags_Context_Mock::class );

		$instance = Mockery::mock( Indexable_Presentation::class )
			->shouldAllowMockingProtectedMethods()
			->makePartial();

		$this->instance = $instance->of(
			[
				'model'   => $this->indexable,
				'context' => $this->context,
			]
		);

		$this->set_instance_dependencies( $this->instance );

		$this->context->indexable = $this->indexable;
	}
}
