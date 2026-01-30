The **Tasks Progress Badge** component visually displays the progress of completed tasks out of a total number of tasks in the form of a badge. It is useful for indicating task completion status in dashboards or task lists. It includes an optional label.

The `completedTasks` prop should be less than or equal to the `totalTasks` prop to ensure accurate representation of progress.

When there are no tasks or `completedTasks` exceeds `totalTasks`, and the loading is complete, an error progress bar is displayed to indicate that there are no tasks available.