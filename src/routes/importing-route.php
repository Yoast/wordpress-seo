<?php

namespace Yoast\WP\SEO\Routes;

use Exception;
use WP_Error;
use WP_REST_Response;
use Yoast\WP\SEO\Actions\Importing\Abstract_Importing_Action;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Main;

/**
 * Importing_Route class.
 *
 * Importing route for importing from other SEO plugins.
 */
class Importing_Route extends Abstract_Action_Route {

	use No_Conditionals;

	/**
	 * The import route constant.
	 *
	 * @var string
	 */
	const ROUTE = '/import/(?P<plugin>\w+)/(?P<type>\w+)';

	/**
	 * List of available importers.
	 *
	 * @var Abstract_Importing_Action[]
	 */
	protected $importers;

	/**
	 * Importing_Route constructor.
	 *
	 * @param Abstract_Importing_Action[] $importers All available importers.
	 */
	public function __construct( Abstract_Importing_Action ...$importers ) {
		$this->$importers = $importers;
	}

	/**
	 * Registers routes with WordPress.
	 *
	 * @return void
	 */
	public function register_routes() {
		register_rest_route(
			Main::API_V1_NAMESPACE,
			self::ROUTE,
			[
				'callback'            => [ $this, 'execute' ],
				'permission_callback' => [ $this, 'can_import' ],
				'methods'             => [ 'POST' ],
			]
		);
	}

	/**
	 * Executes the rest request.
	 *
	 * @param mixed $data The request parameters.
	 *
	 * @return WP_REST_Response|false Response or false on non-existent route.
	 */
	public function execute( $data ) {
		$plugin = (string) $data['plugin'];
		$type   = (string) $data['type'];

		$next_url = "import/{$plugin}/{$type}";

		try {
			$importer = $this->get_importer( $plugin, $type );

			if ( $importer === false ) {
				return new WP_Error(
					'rest_no_route',
					'Requested importer not found',
					[
						'status' => 404,
					]
				);
			}

			$result = $importer->index();

			if ( count( $result ) === 0 ) {
				$next_url = false;
			}

			return $this->respond_with(
				$result,
				$next_url
			);
		} catch ( \Exception $exception ) {
			return new WP_Error(
				'wpseo_error_indexing',
				$exception->getMessage(),
				[ 'stackTrace' => $exception->getTraceAsString() ]
			);
		}
	}

	/**
	 * Gets the right importer for the given arguments.
	 *
	 * @param string $plugin The plugin to import from.
	 * @param string $type   The type of entity to import.
	 *
	 * @return Abstract_Importing_Action|false The importer, or false if no importer was found.
	 */
	protected function get_importer( $plugin, $type ) {
		foreach ( $this->importers as $importer ) {
			if ( $importer::PLUGIN === $plugin && $importer::TYPE === $type ) {
				return $importer;
			}
		}
		return false;
	}

	/**
	 * Whether or not the current user is allowed to import.
	 *
	 * @return bool Whether or not the current user is allowed to import.
	 */
	public function can_import() {
		return \current_user_can( 'edit_posts' );
	}
}
