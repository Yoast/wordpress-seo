<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Application\Configuration;

use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Llms_Txt\Application\Configuration\Llms_Txt_Configuration;
use Yoast\WP\SEO\Llms_Txt\Application\Health_Check\File_Runner;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the llms.txt configuration.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Llms_Txt_Configuration_Test extends TestCase {

	/**
	 * The file runner.
	 *
	 * @var File_Runner
	 */
	protected $runner;

	/**
	 * The post type helper.
	 *
	 * @var Mockery\MockInterface|Post_Type_Helper
	 */
	protected $post_type_helper;

	/**
	 * The options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * Holds the instance.
	 *
	 * @var Llms_Txt_Configuration
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->runner           = Mockery::mock( File_Runner::class );
		$this->post_type_helper = Mockery::mock( Post_Type_Helper::class );
		$this->options_helper   = Mockery::mock( Options_Helper::class );

		$this->instance = new Llms_Txt_Configuration(
			$this->runner,
			$this->post_type_helper,
			$this->options_helper
		);
	}
}
