<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\Application\Configuration;

use Mockery;
use Yoast\WP\SEO\Dashboard\Domain\Endpoint\Endpoint_List;
use Yoast\WP\SEO\Editors\Domain\Analysis_Features\Analysis_Features_List;

/**
 * Test class for the constructor.
 *
 * @group Dashboard_Configuration
 *
 * @covers Yoast\WP\SEO\Dashboard\Application\Configuration\Dashboard_Configuration::get_configuration
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Dashboard_Configuration_Get_Configuration_Test extends Abstract_Dashboard_Configuration_Test {

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @dataProvider get_configuration_data
	 *
	 * @param array<string> $content_types             The content types.
	 * @param bool          $indexables_enabled        The indexables enabled.
	 * @param string        $display_name              The display name.
	 * @param array<string> $enabled_analysis_features The enabled analysis features.
	 * @param array<string> $endpoints                 The endpoints.
	 * @param string        $nonce                     The nonce.
	 * @param array<string> $site_kit_configuration    The site kit configuration.
	 * @param array<string> $setup_steps_tracking      The setup steps tracking.
	 *
	 * @return void
	 */
	public function test_get_configuration( $content_types, $indexables_enabled, $display_name, $enabled_analysis_features, $endpoints, $nonce, $site_kit_configuration, $setup_steps_tracking ) {
		$feature_list  = Mockery::mock( Analysis_Features_List::class );
		$endpoint_list = Mockery::mock( Endpoint_List::class );
		$feature_list->shouldReceive( 'to_array' )->once()->andReturn( $enabled_analysis_features );
		$endpoint_list->shouldReceive( 'to_array' )->once()->andReturn( $endpoints );
		$this->content_types_repository->shouldReceive( 'get_content_types' )->once()->andReturn( $content_types );
		$this->indexable_helper->shouldReceive( 'should_index_indexables' )->once()->andReturn( $indexables_enabled );
		$this->user_helper->shouldReceive( 'get_current_user_display_name' )->once()->andReturn( $display_name );
		$this->enabled_analysis_features_repository->shouldReceive( 'get_features_by_keys' )->once()->andReturn( $feature_list );
		$this->endpoints_repository->shouldReceive( 'get_all_endpoints' )->once()->andReturn( $endpoint_list );
		$this->nonce_repository->shouldReceive( 'get_rest_nonce' )->once()->andReturn( $nonce );
		$this->site_kit_integration_data->shouldReceive( 'to_array' )->once()->andReturn( $site_kit_configuration );
		$this->setup_steps_tracking->shouldReceive( 'to_array' )->once()->andReturn( $setup_steps_tracking );

		$this->assertEquals(
			[
				'contentTypes'            => $content_types,
				'indexablesEnabled'       => $indexables_enabled,
				'displayName'             => $display_name,
				'enabledAnalysisFeatures' => $enabled_analysis_features,
				'endpoints'               => $endpoints,
				'nonce'                   => $nonce,
				'siteKitConfiguration'    => $site_kit_configuration,
				'setupStepsTracking'      => $setup_steps_tracking,
			],
			$this->instance->get_configuration()
		);
	}

	/**
	 * Data provider for the get_configuration test.
	 *
	 * @return array<array<string, bool|string|array<string>>>
	 */
	public static function get_configuration_data(): array {
		return [
			'data' => [
				'contentTypes'            => [ 'post', 'page' ],
				'indexablesEnabled'       => true,
				'displayName'             => 'Test Name',
				'enabledAnalysisFeatures' => [
					'readability' => false,
					'keyphrase'   => true,
				],
				'endpoints'               => [ 'endpoint1', 'endpoint2' ],
				'nonce'                   => 'T35TN0nc3',
				'siteKitConfiguration'    => [
					'data1' => 'value1',
					'data2' => 'value2',
				],
				'setupStepsTracking'      => [
					'data3' => 'value3',
					'data4' => 'value4',
				],
			],
		];
	}
}
