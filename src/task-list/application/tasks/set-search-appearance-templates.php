<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Application\Tasks;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Route_Helper;
use Yoast\WP\SEO\Task_List\Domain\Components\Call_To_Action_Entry;
use Yoast\WP\SEO\Task_List\Domain\Components\Copy_Set;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Abstract_Post_Type_Task;

/**
 * Represents the task for setting search appearance templates.
 */
class Set_Search_Appearance_Templates extends Abstract_Post_Type_Task {

	/**
	 * Holds the id.
	 *
	 * @var string
	 */
	protected $id = 'set-search-appearance-templates';

	/**
	 * Holds the priority.
	 *
	 * @var string
	 */
	protected $priority = 'high';

	/**
	 * Holds the duration.
	 *
	 * @var int
	 */
	protected $duration = 10;

	/**
	 * Holds the post type.
	 *
	 * @var string
	 */
	protected $post_type;

	/**
	 * Holds the options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Holds the route helper.
	 *
	 * @var Route_Helper
	 */
	private $route_helper;

	/**
	 * Constructs the task.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 * @param Route_Helper   $route_helper   The route helper.
	 */
	public function __construct(
		Options_Helper $options_helper,
		Route_Helper $route_helper
	) {
		$this->options_helper = $options_helper;
		$this->route_helper   = $route_helper;
	}

	/**
	 * Returns whether this task is completed.
	 *
	 * @return bool Whether this task is completed.
	 */
	public function get_is_completed(): bool {
		$post_type = \get_post_type_object( $this->get_post_type() );

		// First check if the SEO title has been customized.
		if ( $this->options_helper->get_title_default( 'title-' . $post_type->name ) !== $this->options_helper->get( 'title-' . $post_type->name ) ) {
			return true;
		}

		// Then check if the meta description has been customized.
		if ( $this->options_helper->get_title_default( 'metadesc-' . $post_type->name ) !== $this->options_helper->get( 'metadesc-' . $post_type->name ) ) {
			return true;
		}

		return false;
	}

	/**
	 * Returns the task's link.
	 *
	 * @return string|null
	 */
	public function get_link(): ?string {
		$post_type = \get_post_type_object( $this->get_post_type() );
		$link      = \sprintf(
			'admin.php?page=wpseo_page_settings#/post-type/%s',
			$this->route_helper->get_route( $post_type->name, $post_type->rewrite, $post_type->rest_base )
		);

		return \self_admin_url( $link );
	}

	/**
	 * Returns the task's call to action entry.
	 *
	 * @return string|null
	 */
	public function get_call_to_action(): Call_To_Action_Entry {
		return new Call_To_Action_Entry(
			\__( 'Set search templates', 'wordpress-seo' ),
			'link',
			$this->get_link()
		);
	}

	/**
	 * Returns the task's copy set.
	 *
	 * @return string|null
	 */
	public function get_copy_set(): Copy_Set {
		$post_type = \get_post_type_object( $this->get_post_type() );

		return new Copy_Set(
			/* translators: %1$s expands to the post type label this task is about */
			\sprintf( \__( 'Set search appearance templates for your %1$s', 'wordpress-seo' ), \strtolower( $post_type->label ) ),
			/* translators: %1$s expands to the post type name this task is about */
			\sprintf( \__( 'Generic titles and descriptions make your results unclear in search. Templates ensure every %1$s has a clear, click-worthy snippet automatically.', 'wordpress-seo' ), $post_type->name ),
			\__( 'Go to Search appearance, choose your post type, and set default title and meta description patterns.', 'wordpress-seo' )
		);
	}
}
