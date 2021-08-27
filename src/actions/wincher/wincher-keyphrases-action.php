<?php

namespace Yoast\WP\SEO\Actions\Wincher;

use Exception;
use Yoast\WP\SEO\Config\Wincher_Client;
use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Class Wincher_Keyphrases_Action
 */
class Wincher_Keyphrases_Action {

	/**
	 * The transient cache key.
	 */
	const TRANSIENT_CACHE_KEY = 'wpseo_wincher_tracked_keyphrases_%s';

	/**
	 * The Wincher keyphrase URL for single keyphrase addition.
	 *
	 * @var string
	 */
	const KEYPHRASE_ADD_URL = 'https://api.wincher.com/beta/websites/%s/keywords';

	/**
	 * The Wincher keyphrase URL for bulk addition.
	 *
	 * @var string
	 */
	const KEYPHRASES_ADD_URL = 'https://api.wincher.com/beta/websites/%s/keywords/bulk';

	/**
	 * The Wincher tracked keyphrase retrieval URL.
	 *
	 * @var string
	 */
	const KEYPHRASES_URL = 'https://api.wincher.com/beta/websites/%s/keywords';

	/**
	 * The Wincher delete tracked keyphrase URL.
	 *
	 * @var string
	 */
	const KEYPHRASE_DELETE_URL = 'https://api.wincher.com/beta/websites/%s/keywords/%s';

	/**
	 * The Wincher tracked keyphrase chart data retrieval URL.
	 *
	 * @var string
	 */
	const KEYPHRASES_CHART_URL = 'https://api.wincher.com/beta/int/websites/%s/pages';

	/**
	 * The Wincher_Client instance.
	 *
	 * @var Wincher_Client
	 */
	protected $client;

	/**
	 * The Options_Helper instance.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * Wincher_Keyphrases_Action constructor.
	 *
	 * @param Wincher_Client $client The API client.
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct( Wincher_Client $client, Options_Helper $options_helper ) {
		$this->client         = $client;
		$this->options_helper = $options_helper;
	}

	/**
	 * Sends the tracking API request for one or more keyphrases.
	 *
	 * @param string|array $keyphrases One or more keyphrases that should be tracked.
	 *
	 * @return object The reponse object.
	 */
	public function track_keyphrases( $keyphrases ) {
		try {
			$endpoint = \sprintf(
				self::KEYPHRASES_ADD_URL,
				$this->options_helper->get( 'wincher_website_id' )
			);

			// Enforce arrrays to ensure a consistent way of preparing the request.
			if ( ! is_array( $keyphrases ) ) {
				$keyphrases = [ $keyphrases ];
			}

			$formatted_keyphrases = array_map(
				function( $keyphrase ) {
					return [
						'keyword' => $keyphrase,
						'groups'  => [],
					];
				},
				$keyphrases
			);

			$results = $this->client->post( $endpoint, \WPSEO_Utils::format_json_encode( $formatted_keyphrases ) );

			$results['data'] = $this->match_chart_data( $results['data'], $keyphrases );

			return $this->to_result_object( $results );
		} catch ( Exception $e ) {
			return (object) [
				'error'  => $e->getMessage(),
				'status' => $e->getCode(),
			];
		}
	}

	/**
	 * Sends an untrack request for the passed keyword ID.
	 *
	 * @param int $keyphrase_id The ID of the keyphrase to untrack.
	 *
	 * @return object The response object.
	 */
	public function untrack_keyphrase( $keyphrase_id ) {
		try {
			$endpoint = \sprintf(
				self::KEYPHRASE_DELETE_URL,
				$this->options_helper->get( 'wincher_website_id' ),
				$keyphrase_id
			);

			$results = $this->client->delete( $endpoint );

			return $this->to_result_object( $results );
		} catch ( Exception $e ) {
			return (object) [
				'error'  => $e->getMessage(),
				'status' => $e->getCode(),
			];
		}
	}

	/**
	 * Gets the tracked keyphrases.
	 *
	 * @param array $used_keyphrases The keyphrases used in the current post.
	 *
	 * @return object The response object.
	 */
	public function get_tracked_keyphrases( $used_keyphrases = [] ) {
		try {
			$results = $this->client->get(
				\sprintf(
					self::KEYPHRASES_URL,
					$this->options_helper->get( 'wincher_website_id' )
				)
			);

			if ( ! empty( $used_keyphrases ) ) {
				$results['data'] = $this->filter_results_by_used_keyphrases( $results['data'], $used_keyphrases );
			}

			$results['data'] = \array_combine(
				\array_column( $results['data'], 'keyword' ),
				\array_values( $results['data'] )
			);

			return $this->to_result_object( $results );
		} catch ( Exception $e ) {
			return (object) [
				'error'  => $e->getMessage(),
				'status' => $e->getCode(),
			];
		}
	}

	/**
	 * Gets the keyphrase chart data for the passed keyphrases.
	 * Retrieves all available chart data if no keyphrases are provided.
	 *
	 * @param array $used_keyphrases The currently used keyphrases. Optional.
	 *
	 * @return object The keyphrase chart data.
	 */
	public function get_keyphrase_chart_data( $used_keyphrases = [] ) {
		try {
			$endpoint = \sprintf(
				self::KEYPHRASES_CHART_URL,
				$this->options_helper->get( 'wincher_website_id' )
			);

			$results = $this->client->get(
				$endpoint,
				[
					'query' => [
						'start_at' => gmdate( 'Y-m-d\T00:00:00\Z', strtotime( '-90 days' ) ),
						'end_at'   => gmdate( 'Y-m-d\TH:i:s\Z' ),
					],
				]
			);

			// TODO: Remove this.
			$current_site_url = ( get_site_url() !== 'http://localhost' ) ? get_site_url() : 'https://www.wincher.com/';

			// Filter correct site data.
			$site_chart = \array_filter(
				$results['data'],
				function( $entry ) use ( $current_site_url ) {
					return $entry['url'] === $current_site_url;
				}
			);

			if ( ! empty( $site_chart ) ) {
				// Ensure we have a proper zero-indexed data set.
				$results['data'] = \reset( $site_chart );
			}

			if ( ! empty( $used_keyphrases ) ) {
				$results['data']['keywords'] = $this->filter_results_by_used_keyphrases( $results['data']['keywords'], $used_keyphrases );
			}

			// Extract the positional data and assign it to the keyphrase.
			$results['data'] = \array_combine(
				\array_column( $results['data']['keywords'], 'keyword' ),
				\array_values( $results['data']['keywords'] )
			);

			return $this->to_result_object( $results );
		} catch ( Exception $e ) {
			return (object) [
				'error'  => $e->getMessage(),
				'status' => $e->getCode(),
			];
		}
	}

	/**
	 * Matches the keyphrase and chart data.
	 *
	 * @param array $keyphrase_data  The keyphrase data.
	 * @param array $used_keyphrases The used keyphrases.
	 *
	 * @return array The filtered keyphrase data.
	 */
	protected function match_chart_data( $keyphrase_data, $used_keyphrases ) {
		$chart_data            = $this->get_keyphrase_chart_data( $used_keyphrases );
		$usable_keyphrase_data = [];

		foreach ( $keyphrase_data as $keyphrase_entry ) {
			$keyphrase_entry['position']  = null;
			$keyphrase_entry['chartData'] = [];

			foreach ( $chart_data->results['keywords'] as $chart_data_item ) {
				if ( $keyphrase_entry['keyword'] !== $chart_data_item['keyword'] ) {
					continue;
				}

				$keyphrase_entry['position']  = $chart_data_item['position']['value'];
				$keyphrase_entry['chartData'] = $this->backfill_history( $chart_data_item['position']['history'] );
			}

			$usable_keyphrase_data[ $keyphrase_entry['keyword'] ] = $keyphrase_entry;
		}

		return $usable_keyphrase_data;
	}

	/**
	 * Filters the results based on the passed keyphrases.
	 *
	 * @param array $results         The results to filter.
	 * @param array $used_keyphrases The used keyphrases.
	 *
	 * @return array The filtered results.
	 */
	protected function filter_results_by_used_keyphrases( $results, $used_keyphrases ) {
		return \array_filter(
			$results,
			function( $result ) use ( $used_keyphrases ) {
				return \in_array( $result['keyword'], \array_map( 'strtolower', $used_keyphrases ), true );
			}
		);
	}

	/**
	 * Backfills the historical data.
	 *
	 * @param array $history_data The history data.
	 *
	 * @return array The history data including the backfills.
	 */
	protected function backfill_history( $history_data ) {
		$exisiting_items = \count( $history_data );
		$backfilled      = \array_fill(
			0,
			( 90 - $exisiting_items ),
			[
				'datetime' => '',
				'value'    => 101,
			]
		);

		return \array_merge( $backfilled, \array_values( $history_data ) );
	}

	/**
	 * Converts the passed dataset to an object.
	 *
	 * @param array $result The result dataset to convert to an object.
	 *
	 * @return object The result object.
	 */
	protected function to_result_object( $result ) {
		return (object) [
			'results' => $result['data'],
			'status'  => $result['status'],
		];
	}
}

