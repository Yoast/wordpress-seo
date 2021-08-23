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

			$keyphrases = array_map(
				function( $keyphrase ) {
					return [
						'keyword' => $keyphrase,
						'groups'  => [],
					];
				},
				$keyphrases
			);

			$results = $this->client->post( $endpoint, \WPSEO_Utils::format_json_encode( $keyphrases ) );

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
	 * @return object The response object.
	 */
	public function get_tracked_keyphrases( $keyphrases, $post_id ) {
		try {
			$transient_key = \sprintf( static::TRANSIENT_CACHE_KEY, $post_id );
			$transient     = \get_transient( $transient_key );

			 if ( $this->should_use_transient( $transient, $keyphrases ) ) {
//			 	return $this->to_result_object( $transient );
			 }

			$results = $this->client->get(
				\sprintf(
					self::KEYPHRASES_URL,
					$this->options_helper->get( 'wincher_website_id' )
				)
			);

			// Map chart data with the keyphrases and filter out non-tracked keyphrases.
			$results['data'] = $this->collect_keyphrase_data( $results['data'], $keyphrases );

			 \set_transient( $transient_key, $results, 12 * \HOUR_IN_SECONDS );
			return $this->to_result_object( $results );
		} catch ( Exception $e ) {
			return (object) [
				'error'  => $e->getMessage(),
				'status' => $e->getCode(),
			];
		}
	}

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

	public function get_keyphrase_chart_data() {
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

			$current_site_url = ( get_site_url() !== 'http://localhost' ) ? get_site_url() : 'https://www.wincher.com/';

			// Filter correct site data.
			$site_chart = \array_filter(
				$results['data'],
				function( $entry ) use ( $current_site_url ) {
					return $entry['url'] === $current_site_url;
				}
			);

			if ( ! empty( $site_chart ) ) {
				$results['data'] = \reset( $site_chart );
			}

			return $this->to_result_object( $results );
		} catch ( Exception $e ) {
			return (object) [
				'error'  => $e->getMessage(),
				'status' => $e->getCode(),
			];
		}
	}

	/**
	 * Checks whether the transient values should be used instead of calling the API.
	 *
	 * @param array $current_transient The current transient array.
	 * @param array $keyphrases        The used keyphrases.
	 *
	 * @return bool Whether to use the transient values.
	 */
	protected function should_use_transient( $current_transient, $keyphrases ) {
		if ( empty( $current_transient ) ) {
			return false;
		}

		$keyphrases_in_transient = \sort( \array_column( $current_transient['data'], 'keyword') );
		$keyphrases = \sort( $keyphrases );

		return $keyphrases_in_transient == $keyphrases;
	}

	/**
	 * Filters the result data to only extract the used keyphrases' information.
	 *
	 * @param array $used_keyphrases The used keyphrases.
	 * @param array $results The API result data.
	 *
	 * @return array The filtered out keyphrases.
	 */
	protected function filter_used_keyphrases_from_results( $used_keyphrases, $results ) {
		if ( empty( $used_keyphrases ) || empty( $results ) ) {
			return $results;
		}

		// Ensure to reset the keys otherwise it'll be seen as an object.
		return array_values(
			array_filter(
				$results,
				function( $entry ) use ( $used_keyphrases ) {

					// Set all keyphrases to lowercase to ensure a proper match.
					return in_array( $entry['keyword'], array_map( 'strtolower', $used_keyphrases ), true );
				}
			)
		);
	}

	/**
	 * Collects the keyphrase and chart data and matches them.
	 * Finally, it filters out to only contain the used keyphrases' data.
	 *
	 * @param array $keyphrase_data  The keyphrase data.
	 * @param array $used_keyphrases The used keyphrases.
	 *
	 * @return array The filtered keyphrase data.
	 */
	protected function collect_keyphrase_data( $keyphrase_data, $used_keyphrases ) {
		$chart_data = $this->get_keyphrase_chart_data();
		$usable_keyphrase_data = [];

		foreach ( $keyphrase_data as $keyphrase_entry) {
			$keyphrase_entry['chart_data'] = [];

			if ( ! \in_array( $keyphrase_entry['keyword'], \array_map( 'strtolower', $used_keyphrases ) ) ) {
				continue;
			}

			foreach ( $chart_data->results['keywords'] as $chart_data_item ) {
				if ( $keyphrase_entry['keyword'] !== $chart_data_item['keyword'] ) {
					continue;
				}

				$keyphrase_entry['position']  = $chart_data_item['position']['value'];
				$keyphrase_entry['chartData'] = $this->backfill_history( $chart_data_item['position']['history'] );
			}

			$usable_keyphrase_data[] = $keyphrase_entry;
		}

		return $usable_keyphrase_data;
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

