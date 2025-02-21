<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\Domain\Search_Rankings;

use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Data_Interface;

/**
 * Domain object that represents a Comparison Search Ranking record.
 */
class Comparison_Search_Ranking_Data implements Data_Interface {

	/**
	 * The current search ranking data.
	 *
	 * @var Search_Ranking_Data[] $current_search_ranking_data
	 */
	private $current_search_ranking_data = [];

	/**
	 * The previous search ranking data.
	 *
	 * @var Search_Ranking_Data[] $previous_search_ranking_data
	 */
	private $previous_search_ranking_data = [];

	/**
	 * Sets the current search ranking data.
	 *
	 * @param Search_Ranking_Data $current_search_ranking_data The current search ranking data.
	 *
	 * @return void
	 */
	public function add_current_traffic_data( Search_Ranking_Data $search_ranking_data ): void {
		array_push( $this->current_search_ranking_data, $search_ranking_data );
	}

	/**
	 * Sets the previous search ranking data.
	 *
	 * @param Search_Ranking_Data $current_search_ranking_data The previous search ranking data.
	 *
	 * @return void
	 */
	public function add_previous_traffic_data( Search_Ranking_Data $search_ranking_data ): void {
		array_push( $this->previous_search_ranking_data, $search_ranking_data );
	}

	/**
	 * The array representation of this domain object.
	 *
	 * @return array<string|float|int|string[]>
	 */
	public function to_array(): array {
		$current_data  = [
			'total_clicks'      => 0,
			'total_impressions' => 0,
			'average_ctr'       => 0,
			'average_position'  => 0,
		];
		$previous_data = [
			'total_clicks'      => 0,
			'total_impressions' => 0,
			'average_ctr'       => 0,
			'average_position'  => 0,
		];
		$weighted_postion = 0;

		foreach ( $this->current_search_ranking_data as $search_ranking_data ) {
			$current_data['total_clicks']      += $search_ranking_data->get_clicks();
			$current_data['total_impressions'] += $search_ranking_data->get_impressions();
			$current_data['average_position']  += ( $search_ranking_data->get_position() / count( $this->current_search_ranking_data ) );
			$weighted_postion                  += $search_ranking_data->get_position() * $search_ranking_data->get_impressions();
		}
		$current_data['average_ctr'] = ( $current_data['total_impressions'] !== 0 ) ? $current_data['total_clicks'] / $current_data['total_impressions'] : 0;
		$current_data['average_position'] = ( $current_data['total_impressions'] !== 0 ) ? $weighted_postion / $current_data['total_impressions'] : 0;

		$weighted_postion = 0;
		foreach ( $this->previous_search_ranking_data as $search_ranking_data ) {
			$previous_data['total_clicks']      += $search_ranking_data->get_clicks();
			$previous_data['total_impressions'] += $search_ranking_data->get_impressions();
			$previous_data['average_position']  += ( $search_ranking_data->get_position() / count( $this->previous_search_ranking_data ) );
			$weighted_postion                   += $search_ranking_data->get_position() * $search_ranking_data->get_impressions();
		}
		$previous_data['average_ctr'] = ( $previous_data['total_impressions'] !== 0 ) ? $previous_data['total_clicks'] / $previous_data['total_impressions'] : 0;
		$previous_data['average_position'] = ( $previous_data['total_impressions'] !== 0 ) ? $weighted_postion / $previous_data['total_impressions'] : 0;

		return [
			'current'  => $current_data,
			'previous' => $previous_data,
		];
	}
}
