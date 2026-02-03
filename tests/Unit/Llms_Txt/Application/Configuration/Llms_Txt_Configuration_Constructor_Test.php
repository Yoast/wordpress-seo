<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Application\Configuration;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Llms_Txt\Application\Health_Check\File_Runner;

/**
 * Test class for the constructor.
 *
 * @group Llms_Txt_Configuration
 *
 * @covers Yoast\WP\SEO\Llms_Txt\Application\Configuration\Llms_Txt_Configuration::__construct
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Llms_Txt_Configuration_Constructor_Test extends Abstract_Llms_Txt_Configuration_Test {

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			File_Runner::class,
			$this->getPropertyValue( $this->instance, 'runner' )
		);
		$this->assertInstanceOf(
			Post_Type_Helper::class,
			$this->getPropertyValue( $this->instance, 'post_type_helper' )
		);
		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $this->instance, 'options_helper' )
		);
	}
}
