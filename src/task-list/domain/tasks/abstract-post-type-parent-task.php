<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Domain\Tasks;

/**
 * Abstract class for a post type parent task.
 * Use this when you need a parent task that is ALSO a post type task.
 * For parent tasks that are not post type tasks, use Abstract_Parent_Task instead.
 */
abstract class Abstract_Post_Type_Parent_Task extends Abstract_Post_Type_Task implements Post_Type_Task_Interface, Parent_Task_Interface {

	use Parent_Task_Trait;
}
