<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Presentation;

use Mockery;
use Yoast\WP\Free\Generators\OG_Image_Generator;
use Yoast\WP\Free\Generators\Twitter_Image_Generator;
use Yoast\WP\Free\Helpers\Open_Graph\Image_Helper as OG_Image_Helper;
use Yoast\WP\Free\Helpers\Twitter\Image_Helper as Twitter_Image_Helper;
use Yoast\WP\Free\Presentations\Generators\OG_Locale_Generator;
use Yoast\WP\Free\Presentations\Generators\Schema_Generator;
use Yoast\WP\Free\Presentations\Indexable_Presentation;

/**
 * Trait Presentation_Instance_Generator_Builder
 *
 * @property Indexable_Presentation $instance;
 */
trait Presentation_Instance_Generator_Builder {

	/**
	 * @var OG_Image_Helper|Mockery\MockInterface
	 */
	protected $og_image_helper;

	/**
	 * @var Twitter_Image_Helper|Mockery\MockInterface
	 */
	protected $twitter_helper;

	/**
	 * @var OG_Image_Generator|Mockery\MockInterface
	 */
	protected $og_image_generator;

	/**
	 * @var Twitter_Image_Generator|Mockery\MockInterface
	 */
	protected $twitter_image_generator;

	/**
	 * Sets the instance generators.
	 */
	protected function set_instance_generators() {
		$this->og_image_helper = Mockery::mock( OG_Image_Helper::class );
		$this->twitter_helper  = Mockery::mock( Twitter_Image_Helper::class );

		$this->og_image_generator = Mockery::mock(
			OG_Image_Generator::class,
			[
				$this->og_image_helper,
				$this->image_helper,
				$this->options_helper,
				$this->url_helper,
			]
		);

		$this->twitter_image_generator = Mockery::mock(
			Twitter_Image_Generator::class,
			[
				$this->image_helper,
				$this->url_helper,
				$this->twitter_helper,
			]
		);

		$this->instance->set_generators(
			Mockery::mock( Schema_Generator::class ),
			new OG_Locale_Generator(),
			$this->og_image_generator,
			$this->twitter_image_generator
		);
	}
}
