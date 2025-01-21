<?php

namespace Yoast\WP\SEO\Dashboard\Application\Sessions;

use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Data_Container;
use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Data_Provider_Interface;
use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Parameters;
use Yoast\WP\SEO\Dashboard\Infrastructure\Google_Analytics\Site_Kit_Google_Analytics_Adapter;
use Yoast\WP\SEO\Dashboard\Infrastructure\Search_Rankings\Organic_Sessions_Parser;

class Organic_Sessions_Data_Provider implements Data_Provider_Interface  {

	/**
	 * The adapter.
	 *
	 * @var Site_Kit_Google_Analytics_Adapter $site_kit_google_analytics_adapter
	 */
	private $site_kit_google_analytics_adapter;

	/**
	 * The parser.
	 * @var Organic_Sessions_Parser $organic_sessions_parser
	 */
	private $organic_sessions_parser;


	/**
	 * The constructor.
	 *
	 * @param Site_Kit_Google_Analytics_Adapter $site_kit_google_analytics_adapter The adapter.
	 * @param Organic_Sessions_Parser           $organic_sessions_parser           The parser.
	 */
	public function __construct( Site_Kit_Google_Analytics_Adapter $site_kit_google_analytics_adapter,Organic_Sessions_Parser $organic_sessions_parser ) {
		$this->site_kit_google_analytics_adapter = $site_kit_google_analytics_adapter;
		$this->organic_sessions_parser = $organic_sessions_parser;
	}

	/**
	 * Method to get search related data from a provider.
	 *
	 * @param Parameters $parameters The parameter to get the search data for.
	 *
	 * @return Data_Container
	 */
	public function get_data( Parameters $parameters ): Data_Container {

		$results = $this->site_kit_google_analytics_adapter->get_data( $parameters );
		return $this->organic_sessions_parser->parse( $results );
	}
}
