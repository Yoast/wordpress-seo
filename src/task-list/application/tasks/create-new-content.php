<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Application\Tasks;

use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Task_List\Domain\Components\Call_To_Action_Entry;
use Yoast\WP\SEO\Task_List\Domain\Components\Copy_Set;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Abstract_Task;

/**
 * Represents the task for creating new content.
 */
class Create_New_Content extends Abstract_Task {

	/**
	 * Holds the id.
	 *
	 * @var string
	 */
	protected $id = 'create-new-content';

	/**
	 * Holds the priority.
	 *
	 * @var string
	 */
	protected $priority = 'medium';

	/**
	 * Holds the duration.
	 *
	 * @var int
	 */
	protected $duration = 90;

	/**
	 * Holds the post type helper.
	 *
	 * @var Post_Type_Helper
	 */
	private $post_type_helper;

	/**
	 * Constructs the task.
	 *
	 * @param Post_Type_Helper $post_type_helper The post type helper.
	 */
	public function __construct( Post_Type_Helper $post_type_helper ) {
		$this->post_type_helper = $post_type_helper;
	}

	/**
	 * Returns whether this task is completed.
	 *
	 * @return bool Whether this task is completed.
	 */
	public function get_is_completed(): bool {
		if ( ! \in_array( 'post', $this->post_type_helper->get_public_post_types(), true ) ) {
			return true;
		}

		$recent_posts = \get_posts(
			[
				'post_type'      => 'post',
				'post_status'    => 'publish',
				'numberposts'    => 1,
				'date_query'     => [
					[
						'after' => '30 days ago',
					],
				],
			]
		);

		return ! empty( $recent_posts );
	}

	/**
	 * Returns the task's link.
	 *
	 * @return string|null
	 */
	public function get_link(): ?string {
		return \self_admin_url( 'post-new.php' );
	}

	/**
	 * Returns the task's call to action entry.
	 *
	 * @return string|null
	 */
	public function get_call_to_action(): Call_To_Action_Entry {
		return new Call_To_Action_Entry(
			\__( 'Create new post', 'wordpress-seo' ),
			'add',
			$this->get_link()
		);
	}

	/**
	 * Returns the task's copy set.
	 *
	 * @return string|null
	 */
	public function get_copy_set(): Copy_Set {
		return new Copy_Set(
			\__( 'Create new content', 'wordpress-seo' ),
			\__( 'Long gaps without new content slow down your traffic growth. Publishing regularly gives search engines and visitors a reason to return.', 'wordpress-seo' ),
			\__( 'Plan a topic, write your post, and use the SEO and Readability Analyses to refine it before publishing.', 'wordpress-seo' )
		);
	}
}
