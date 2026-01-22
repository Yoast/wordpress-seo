<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\User_Interface\Health_Check;

use Mockery;
use Yoast\WP\SEO\Llms_Txt\User_Interface\Health_Check\File_Reports;
use Yoast\WP\SEO\Services\Health_Check\Report_Builder;
use Yoast\WP\SEO\Services\Health_Check\Report_Builder_Factory;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the File_Reports tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 *
 * @group health-check
 */
abstract class Abstract_File_Reports_Test extends TestCase {

	/**
	 * The File_Reports instance to be tested.
	 *
	 * @var File_Reports
	 */
	protected $instance;

	/**
	 * The mocked Report_Builder.
	 *
	 * @var Report_Builder
	 */
	protected $reports;

	/**
	 * The mocked Report_Builder_Factory that returns the Report_Builder mock.
	 *
	 * @var Report_Builder_Factory
	 */
	protected $report_builder_factory;

	/**
	 * Set up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->reports                = Mockery::mock( Report_Builder::class );
		$this->report_builder_factory = Mockery::mock( Report_Builder_Factory::class );
		$this->report_builder_factory
			->shouldReceive( 'create' )
			->once()
			->andReturn( $this->reports );

		$this->instance = new File_Reports( $this->report_builder_factory );
		$this->stubTranslationFunctions();
	}
}
