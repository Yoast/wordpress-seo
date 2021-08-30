<?php

namespace Yoast\WP\SEO\Actions\Wincher;

use Exception;
use WP_Post;
use WP_Query;
use WPSEO_Meta;
use Yoast\WP\SEO\Config\Wincher_Client;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Class Wincher_Keyphrases_Action
 */
class Wincher_Keyphrases_Action {

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
	 * The Indexable_Repository instance.
	 *
	 * @var Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * Wincher_Keyphrases_Action constructor.
	 *
	 * @param Wincher_Client       $client         The API client.
	 * @param Options_Helper       $options_helper The options helper.
	 * @param Indexable_Repository $indexable_repository The indexables repository.
	 */
	public function __construct(
		Wincher_Client $client,
		Options_Helper $options_helper,
		Indexable_Repository $indexable_repository
	) {
		$this->client         = $client;
		$this->options_helper = $options_helper;
		$this->indexable_repository = $indexable_repository;
	}

	/**
	 * Sends the tracking API request for one or more keyphrases.
	 *
	 * @param string|array $keyphrases One or more keyphrases that should be tracked.
	 * @param Object       $limits     The limits API call response data.
	 *
	 * @return object The reponse object.
	 */
	public function track_keyphrases( $keyphrases, $limits ) {
		try {
			$endpoint = \sprintf(
				self::KEYPHRASES_ADD_URL,
				$this->options_helper->get( 'wincher_website_id' )
			);

			// Enforce arrrays to ensure a consistent way of preparing the request.
			if ( ! is_array( $keyphrases ) ) {
				$keyphrases = [ $keyphrases ];
			}

			// Calculate if the user would exceed their limit.
			if ( ! $limits->canTrack || $this->would_exceed_limits( $keyphrases, $limits ) ) {
				$response = [
					'data'   => [
						'limit'    => $limits->limit,
						'canTrack' => $limits->canTrack,
					],
					'error'  => 'Account limit exceeded',
					'status' => 400,
				];

				return $this->to_result_object( $response );
			}

			$formatted_keyphrases = \array_values(
				\array_map(
					function ( $keyphrase ) {
						return [
							'keyword' => $keyphrase,
							'groups'  => [],
						];
					},
					$keyphrases
				)
			);

			$results = $this->client->post( $endpoint, \WPSEO_Utils::format_json_encode( $formatted_keyphrases ) );

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

			// Get current site URL as Wincher can track multiple websites for a single account.
			$current_site_url = \get_site_url();

			// Filter correct site data.
			$site_chart = \array_filter(
				$results['data'],
				function( $entry ) use ( $current_site_url ) {
					return $entry['url'] === $current_site_url;
				}
			);

			$results['data'] = [];

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
	 * Collects the keyphrases associated with the post.
	 *
	 * @param WP_Post $post The post object.
	 *
	 * @return array The keyphrases.
	 */
	public function collect_keyphrases_from_post( $post ) {
		$keyphrases   = [];
		$primary_keyphrase = $this->indexable_repository
			->query()
			->select( 'primary_focus_keyword' )
			->where( 'object_id', $post->ID )
			->find_one();

		$keyphrases[] = $primary_keyphrase->primary_focus_keyword;

		if ( YoastSEO()->helpers->product->is_premium() ) {
			$additional_keywords = \json_decode( WPSEO_Meta::get_value( 'focuskeywords', $post->ID ), true );

			$keyphrases = \array_merge( $keyphrases, $additional_keywords );
		}

		return $keyphrases;
	}

	/**
	 * @param $limits
	 *
	 * @return array|object
	 */
	public function trackAll( $limits ) {
		// Collect primary keyphrases first.
		$keyphrases = \array_column(
			$this->indexable_repository
			->query()
			->select( 'primary_focus_keyword' )
			->where_not_null( 'primary_focus_keyword')
			->find_array(),
			'primary_focus_keyword'
		);

		if ( YoastSEO()->helpers->product->is_premium() ) {
			// Collect all related keyphrases.
			$query_posts = new WP_Query( 'post_type=any&nopaging=true' );

			foreach ( $query_posts->posts as $post ) {
				$additional_keywords = \json_decode( WPSEO_Meta::get_value( 'focuskeywords', $post->ID ), true );
				$keyphrases = \array_merge( $keyphrases, $additional_keywords );
			}
		}

		// Filter out empty entries.
		$keyphrases = \array_filter( $keyphrases );

		if ( empty( $keyphrases ) ) {
			return [
				'data'   => [],
				'status' => 200,
			];
		}

		return $this->track_keyphrases( $keyphrases, $limits );
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

	protected function would_exceed_limits( $keyphrases, $limits ) {
		if ( ! is_array( $keyphrases ) ) {
			$keyphrases = [ $keyphrases ];
		}

		return count( $keyphrases ) + $limits->usage > $limits->limit;
	}

	/**
	 * Converts the passed dataset to an object.
	 *
	 * @param array $result The result dataset to convert to an object.
	 *
	 * @return object The result object.
	 */
	protected function to_result_object( $result ) {
		if ( \array_key_exists( 'data', $result ) ) {
			$result['results'] = $result['data'];

			unset( $result['data'] );
		}

		return (object) $result;
	}
}

