<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Llms_Txt\Application\Available_Posts;

use Yoast\WP\SEO\Llms_Txt\Domain\Available_Posts\Data_Provider\Available_Posts_Data;
use Yoast\WP\SEO\Llms_Txt\Domain\Available_Posts\Data_Provider\Available_Posts_Repository_Interface;
use Yoast\WP\SEO\Llms_Txt\Domain\Available_Posts\Data_Provider\Data_Container;
use Yoast\WP\SEO\Llms_Txt\Domain\Available_Posts\Data_Provider\Parameters;
use Yoast\WP\SEO\Llms_Txt\Domain\Content_Types\Content_Type_Entry;
use Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services\Content_Types_Collector;

/**
 * The data provider for available posts.
 */
class Available_Posts_Repository implements Available_Posts_Repository_Interface {

	/**
	 * The content type collector.
	 *
	 * @var Content_Types_Collector $content_types_collector
	 */
	private $content_types_collector;

	/**
	 * The constructor.
	 *
	 * @param Content_Types_Collector $content_types_collector The content type collector.
	 */
	public function __construct(
		Content_Types_Collector $content_types_collector
	) {
		$this->content_types_collector = $content_types_collector;
	}

	/**
	 * Gets the top queries' data.
	 *
	 * @param Parameters $parameters The parameter to use for getting the top queries.
	 *
	 * @return Data_Container
	 */
	public function get_posts( Parameters $parameters ): Data_Container {
		$available_posts = $this->content_types_collector->get_recent_posts( $parameters->get_post_type(), 10, $parameters->get_search_filter(), true );

		$available_posts_data_container = new Data_Container();

		foreach ( $available_posts as $available_post ) {
			if ( ! \is_a( $available_post, Content_Type_Entry::class ) ) {
				throw new Unexpected_Response_Exception();
			}

			$available_posts_data_container->add_data( new Available_Posts_Data( $available_post ) );
		}

		return $available_posts_data_container;
	}
}
