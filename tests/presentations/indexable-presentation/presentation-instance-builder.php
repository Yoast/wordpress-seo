<?php

namespace Yoast\WP\SEO\Tests\Presentations\Indexable_Presentation;

use Mockery;
use Yoast\WP\SEO\Generators\Open_Graph_Image_Generator;
use Yoast\WP\SEO\Generators\Twitter_Image_Generator;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Tests\Mocks\Indexable;
use Yoast\WP\SEO\Tests\Mocks\Meta_Tags_Context;
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
	 * @var Indexable_Presentation|Mockery\MockInterface
	 */
	protected $instance;

	/**
	 * @var Meta_Tags_Context|Mockery\MockInterface
	 */
	protected $context;

	/**
	 * Builds an instance of Indexable_Post_Type_Presentation.
	 */
	protected function set_instance() {
		$this->indexable = new Indexable();

		$this->context = Mockery::mock( Meta_Tags_Context::class );

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
