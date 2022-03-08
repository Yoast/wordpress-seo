<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Health_Check;

use Mockery;
use WPSEO_Shortlinker;
use Yoast\WP\SEO\Presenters\Admin\Alert_Presenter;
use Yoast\WP\SEO\Services\Health_Check\Alert_Presenter_Factory;
use Yoast\WP\SEO\Services\Health_Check\Report_Builder;
use Yoast\WP\SEO\Services\Health_Check\Report_Builder_Factory;
use Yoast\WP\SEO\Services\Health_Check\Ryte_Reports;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Ryte_Reports
 *
 * @coversDefaultClass Yoast\WP\SEO\Services\Health_Check\Ryte_Reports
 */
class Ryte_Reports_Test extends TestCase {

	/**
	 * The Ryte_Repors instance to be tested.
	 *
	 * @var Ryte_Reports
	 */
	private $instance;

	/**
	 * A mocked Report_Builder object.
	 *
	 * @var Report_Builder
	 */
	private $report_builder_mock;

	/**
	 * A mock for WPSEO_Shortlinker used to mock its static get() method.
	 *
	 * @var WPSEO_Shortlinker
	 */
	private $shortlinker_mock;

	/**
	 * A mock for Alert_Presenter.
	 *
	 * @var Alert_Presenter
	 */
	private $alert_presenter_mock;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		$report_builder_factory_mock  = Mockery::mock( Report_Builder_Factory::class );
		$this->report_builder_mock    = Mockery::mock( Report_Builder::class );
		$this->shortlinker_mock       = Mockery::mock( WPSEO_Shortlinker::class );
		$alert_presenter_factory_mock = Mockery::mock( Alert_Presenter_Factory::class );
		$this->alert_presenter_mock   = Mockery::mock( Alert_Presenter::class );
		$report_builder_factory_mock->shouldReceive( 'create' )->andReturn( $this->report_builder_mock );
		$alert_presenter_factory_mock->shouldReceive( 'create' )->andReturn( $this->alert_presenter_mock );

		$this->instance = new Ryte_Reports( $report_builder_factory_mock, $alert_presenter_factory_mock, $this->shortlinker_mock );
	}

	/**
	 * Checks if the instance builds the correct success report.
	 *
	 * @return void
	 * @covers ::__construct
	 * @covers ::get_success_result
	 * @covers ::get_ryte_actions
	 * @covers ::get_success_result_description
	 */
	public function test_get_success_result() {
		$expected_result      = [ 'correct' ];
		$expected_label       = 'Your site can be found by search engines';
		$expected_description = 'Ryte offers a free indexability check for Yoast SEO users, and it shows that your site can be found by search engines.';
		$expected_actions     = '<a href="link" target="_blank">Go to Ryte to analyze your entire site<span class="screen-reader-text">(Opens in a new browser tab)</span></a>';

		$this->shortlinker_mock
			->shouldReceive( 'get' )
			->once()
			->andReturn( 'link' );
		$this->report_builder_mock
			->shouldReceive( 'set_label' )
			->once()
			->with( $expected_label )
			->andReturn( $this->report_builder_mock );
		$this->report_builder_mock
			->shouldReceive( 'set_description' )
			->once()
			->with( $expected_description )
			->andReturn( $this->report_builder_mock );
		$this->report_builder_mock
			->shouldReceive( 'set_actions' )
			->once()
			->with( $expected_actions )
			->andReturn( $this->report_builder_mock );
		$this->report_builder_mock
			->shouldReceive( 'set_status_good' )
			->once()
			->andReturn( $this->report_builder_mock );
		$this->report_builder_mock
			->shouldReceive( 'build' )
			->once()
			->andReturn( $expected_result );

		$actual_result = $this->instance->get_success_result();

		$this->assertEquals( $expected_result, $actual_result );
	}

	/**
	 * Checks if the instance builds the correct report for when the site is not indexable.
	 *
	 * @return void
	 * @covers ::__construct
	 * @covers ::get_ryte_actions
	 * @covers ::get_not_indexable_result
	 * @covers ::get_not_indexable_result_description
	 * @covers ::get_not_indexable_result_actions
	 */
	public function test_get_not_indexable_result() {
		$expected_result      = [ 'correct' ];
		$expected_label       = 'Your site cannot be found by search engines';
		$expected_description = 'Ryte offers a free indexability check for Yoast SEO users and it has determined that your site cannot be found by search engines. If this site is live or about to become live, this should be fixed.';
		$expected_actions     = '<a href="link1" target="_blank">Read more about troubleshooting search engine visibility.<span class="screen-reader-text">(Opens in a new browser tab)</span></a><br /><br /><a href="link2" target="_blank">Go to Ryte to analyze your entire site<span class="screen-reader-text">(Opens in a new browser tab)</span></a>';

		$this->shortlinker_mock
			->shouldReceive( 'get' )
			->once()
			->andReturn( 'link1' );
		$this->shortlinker_mock
			->shouldReceive( 'get' )
			->once()
			->andReturn( 'link2' );
		$this->report_builder_mock
			->shouldReceive( 'set_label' )
			->once()
			->with( $expected_label )
			->andReturn( $this->report_builder_mock );
		$this->report_builder_mock
			->shouldReceive( 'set_description' )
			->once()
			->with( $expected_description )
			->andReturn( $this->report_builder_mock );
		$this->report_builder_mock
			->shouldReceive( 'set_actions' )
			->once()
			->with( $expected_actions )
			->andReturn( $this->report_builder_mock );
		$this->report_builder_mock
			->shouldReceive( 'set_status_critical' )
			->once()
			->andReturn( $this->report_builder_mock );
		$this->report_builder_mock
			->shouldReceive( 'build' )
			->once()
			->andReturn( $expected_result );

		$actual_result = $this->instance->get_not_indexable_result();

		$this->assertEquals( $expected_result, $actual_result );
	}

	/**
	 * Checks if the instance builds the correct report for when the site's indexability could not be determined.
	 *
	 * @return void
	 * @covers ::__construct
	 * @covers ::get_ryte_actions
	 * @covers ::get_unknown_indexability_result
	 * @covers ::get_unknown_indexability_result_description
	 * @covers ::get_unknown_indexability_description_alert
	 */
	public function test_get_unknown_indexability_result() {
		$expected_result      = [ 'correct' ];
		$expected_label       = 'Ryte cannot determine whether your site can be found by search engines';
		$expected_description = 'Ryte offers a free indexability check for Yoast SEO users and right now it has trouble determining whether search engines can find your site. This could have several (legitimate) reasons and is not a problem in itself. If this is a live site, it is recommended that you figure out why the Ryte check failed.<br />alert';
		$expected_actions     = '<a href="link2" target="_blank">Go to Ryte to analyze your entire site<span class="screen-reader-text">(Opens in a new browser tab)</span></a>';

		$this->shortlinker_mock
			->shouldReceive( 'get' )
			->once()
			->andReturn( 'link1' );
		$this->shortlinker_mock
			->shouldReceive( 'get' )
			->once()
			->andReturn( 'link2' );
		$this->alert_presenter_mock
			->shouldReceive( 'present' )
			->once()
			->andReturn( 'alert' );
		$this->report_builder_mock
			->shouldReceive( 'set_label' )
			->once()
			->with( $expected_label )
			->andReturn( $this->report_builder_mock );
		$this->report_builder_mock
			->shouldReceive( 'set_description' )
			->once()
			->with( $expected_description )
			->andReturn( $this->report_builder_mock );
		$this->report_builder_mock
			->shouldReceive( 'set_actions' )
			->once()
			->with( $expected_actions )
			->andReturn( $this->report_builder_mock );
		$this->report_builder_mock
			->shouldReceive( 'set_status_recommended' )
			->once()
			->andReturn( $this->report_builder_mock );
		$this->report_builder_mock
			->shouldReceive( 'build' )
			->once()
			->andReturn( $expected_result );

		$actual_result = $this->instance->get_unknown_indexability_result();

		$this->assertEquals( $expected_result, $actual_result );
	}

	/**
	 * Checks if the instance builds the correct report for when the health check received an error from Ryte.
	 *
	 * @return void
	 * @covers ::__construct
	 * @covers ::get_ryte_actions
	 * @covers ::get_response_error_result
	 * @covers ::get_response_error_result_description
	 * @covers ::get_response_error_result_actions
	 */
	public function test_got_response_erorr_result() {
		$error_response = [
			'raw_error_code' => 400,
			'message'        => 'Bad request',
			'wp_error_code'  => 500,
		];

		$expected_result      = [ 'correct' ];
		$expected_label       = 'An error occurred while checking whether your site can be found by search engines';
		$expected_description = 'Ryte offers a free indexability check for Yoast SEO users. The request to Ryte to check whether your site can be found by search engines failed due to an error.<br><br>Error details: 400 Bad request 500';
		$expected_actions     = 'If this is a live site, <a href="link1" target="_blank">it is recommended that you figure out why the check failed.<span class="screen-reader-text">(Opens in a new browser tab)</span></a><br /><br /><a href="link2" target="_blank">Go to Ryte to analyze your entire site<span class="screen-reader-text">(Opens in a new browser tab)</span></a>';

		$this->shortlinker_mock
			->shouldReceive( 'get' )
			->once()
			->andReturn( 'link1' );
		$this->shortlinker_mock
			->shouldReceive( 'get' )
			->once()
			->andReturn( 'link2' );
		$this->report_builder_mock
			->shouldReceive( 'set_label' )
			->once()
			->with( $expected_label )
			->andReturn( $this->report_builder_mock );
		$this->report_builder_mock
			->shouldReceive( 'set_description' )
			->once()
			->with( $expected_description )
			->andReturn( $this->report_builder_mock );
		$this->report_builder_mock
			->shouldReceive( 'set_actions' )
			->once()
			->with( $expected_actions )
			->andReturn( $this->report_builder_mock );
		$this->report_builder_mock
			->shouldReceive( 'set_status_recommended' )
			->once()
			->andReturn( $this->report_builder_mock );
		$this->report_builder_mock
			->shouldReceive( 'build' )
			->once()
			->andReturn( $expected_result );

		$actual_result = $this->instance->get_response_error_result( $error_response );

		$this->assertEquals( $expected_result, $actual_result );
	}
}
