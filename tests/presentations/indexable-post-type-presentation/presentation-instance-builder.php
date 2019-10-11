<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Post_Type_Presentation;

use Mockery;
use Yoast\WP\Free\Helpers\Date_Helper;
use Yoast\WP\Free\Helpers\Post_Type_Helper;
use Yoast\WP\Free\Helpers\Rel_Adjacent_Helper;
use Yoast\WP\Free\Helpers\Url_Helper;
use Yoast\WP\Free\Helpers\User_Helper;
use Yoast\WP\Free\Presentations\Indexable_Post_Type_Presentation;
use Yoast\WP\Free\Tests\Mocks\Indexable;
use Yoast\WP\Free\Tests\Mocks\Meta_Tags_Context;
use Yoast\WP\Free\Tests\Presentations\Indexable_Presentation\Presentation_Instance_Generator_Builder;
use Yoast\WP\Free\Tests\Presentations\Presentation_Instance_Helpers;
use Yoast\WP\Free\Wrappers\WP_Rewrite_Wrapper;

/**
 * Trait Presentation_Instance_Builder
 */
trait Presentation_Instance_Builder {
	use Presentation_Instance_Helpers;
	use Presentation_Instance_Generator_Builder;

	/**
	 * @var Indexable
	 */
	protected $indexable;

	/**
	 * @var Indexable_Post_Type_Presentation|Mockery\MockInterface
	 */
	protected $instance;

	/**
	 * @var Post_Type_Helper|Mockery\MockInterface
	 */
	protected $post_type_helper;

	/**
	 * @var Meta_Tags_Context|Mockery\MockInterface
	 */
	protected $context;

	/**
	 * @var WP_Rewrite_Wrapper|Mockery\MockInterface
	 */
	protected $wp_rewrite_wrapper;

	/**
	 * @var Rel_Adjacent_Helper|Mockery\MockInterface
	 */
	protected $rel_adjacent;

	/**
	 * @var Date_Helper
	 */
	protected $date_helper;

	/**
	 * Builds an instance of Indexable_Post_Type_Presentation.
	 */
	protected function setInstance() {
		$this->indexable = new Indexable();

		$this->post_type_helper    = Mockery::mock( Post_Type_Helper::class );
		$this->context             = Mockery::mock( Meta_Tags_Context::class )->makePartial();
		$this->wp_rewrite_wrapper  = Mockery::mock( WP_Rewrite_Wrapper::class );
		$this->rel_adjacent        = Mockery::mock( Rel_Adjacent_Helper::class );
		$this->url_helper          = Mockery::mock( Url_Helper::class );
		$this->user_helper         = Mockery::mock( User_Helper::class );
		$this->date_helper         = Mockery::mock( Date_Helper::class );

		$instance = Mockery::mock(
			Indexable_Post_Type_Presentation::class,
			[
				$this->post_type_helper,
				$this->wp_rewrite_wrapper,
				$this->rel_adjacent,
				$this->date_helper,
			]
		)
			->shouldAllowMockingProtectedMethods()
			->makePartial();

		$this->instance = $instance->of(
			[
				'model'   => $this->indexable,
				'context' => $this->context,
			]
		);

		$this->set_instance_helpers( $this->instance );

		$this->set_instance_generators();

		$this->context->indexable = $this->indexable;
	}
}
