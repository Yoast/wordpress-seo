<?php

namespace Yoast\WP\Free\Tests\Presentations;

use Mockery;
use Yoast\WP\Free\Helpers\User_Helper;
use Yoast\WP\Free\Presentations\Indexable_Presentation;
use Yoast\WP\Free\Helpers\Canonical_Helper;
use Yoast\WP\Free\Helpers\Current_Page_Helper;
use Yoast\WP\Free\Helpers\Image_Helper;
use Yoast\WP\Free\Helpers\Options_Helper;
use Yoast\WP\Free\Helpers\Robots_Helper;

trait Presentation_Instance_Helpers {
	/**
	 * @var Options_Helper|Mockery\Mock
	 */
	protected $options_helper;

	/**
	 * @var Robots_Helper|Mockery\Mock
	 */
	protected $robots_helper;

	/**
	 * @var Image_Helper|Mockery\Mock
	 */
	protected $image_helper;

	/**
	 * @var Canonical_Helper|Mockery\MockInterface
	 */
	protected $canonical_helper;

	/**
	 * @var Current_Page_Helper|Mockery\MockInterface
	 */
	protected $current_page_helper;

	/**
	 * @var User_Helper|Mockery\MockInterface
	 */
	protected $user_helper;

	/**
	 * Helper function for setting helpers of the base indexable presentation.
	 *
	 * @param Indexable_Presentation $presentation_instance The indexable presentation instance.
	 */
	protected function set_instance_helpers( Indexable_Presentation $presentation_instance ) {
		$this->options_helper      = Mockery::mock( Options_Helper::class );
		$this->robots_helper       = Mockery::mock( Robots_Helper::class );
		$this->image_helper        = Mockery::mock( Image_Helper::class );
		$this->current_page_helper = Mockery::mock( Current_Page_Helper::class );
		$this->canonical_helper    = Mockery::mock( Canonical_Helper::class );
		$this->user_helper         = Mockery::mock( User_Helper::class );

		$presentation_instance->set_helpers(
			$this->robots_helper,
			$this->image_helper,
			$this->options_helper,
			$this->current_page_helper,
			$this->canonical_helper,
			$this->user_helper
		);
	}
}
