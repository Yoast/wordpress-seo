<?php

namespace Yoast\WP\SEO\Routes;

use Exception;
use WP_REST_Response;
use Yoast\WP\SEO\Actions\Indexation\Indexation_Action_Interface;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Admin\Indexing_Notification_Integration;

/**
 * Abstract_Indexation_Route class.
 *
 * Reindexation route for indexables.
 */
abstract class Abstract_Indexation_Route implements Route_Interface {

	/**
	 * Represents the options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * Abstract_Indexation_Route constructor.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct(
		Options_Helper $options_helper
	) {
		$this->options_helper = $options_helper;
	}

	/**
	 * Responds to an indexation request.
	 *
	 * @param array  $objects  The objects that have been indexed.
	 * @param string $next_url The url that should be called to continue reindexing. False if done.
	 *
	 * @return WP_REST_Response The response.
	 */
	protected function respond_with( $objects, $next_url ) {
		return new WP_REST_Response(
			[
				'objects'  => $objects,
				'next_url' => $next_url,
			]
		);
	}

	/**
	 * Runs an indexation action and returns the response.
	 *
	 * @param Indexation_Action_Interface $indexation_action The indexation action.
	 * @param string                      $url               The url of the indexation route.
	 *
	 * @return WP_REST_Response The response.
	 *
	 * @throws Exception If the indexation action fails.
	 */
	protected function run_indexation_action( Indexation_Action_Interface $indexation_action, $url ) {
		try {
			$indexables = $indexation_action->index();

			$next_url = false;
			if ( \count( $indexables ) >= $indexation_action->get_limit() ) {
				$next_url = \rest_url( $url );
			}

			return $this->respond_with( $indexables, $next_url );
		}
		catch ( Exception $exception ) {
			$this->options_helper->set( 'indexables_indexation_reason', Indexing_Notification_Integration::REASON_INDEXING_FAILED );

			throw $exception;
		}
	}
}
