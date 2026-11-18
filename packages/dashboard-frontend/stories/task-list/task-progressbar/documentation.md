The **Tasks Progress Bar** component visually displays the progress of completed tasks out of a total number of tasks. It is useful for indicating task completion status in dashboards or task lists. It includes a label for the progress bar.

When loading, skeleton loaders are shown in place of the progress bar and task count. When not loading, the progress bar and the completed/total task count are displayed.

The `completedTasks` prop should be less than or equal to the `totalTasks` prop to ensure accurate representation of progress.

When there are no tasks or `completedTasks` exceeds `totalTasks`, and the loading is complete, an error progress bar is displayed to indicate that there are no tasks available.

The component also has size variants (small and medium) that adjust the font sizes of the label and count for better readability in different contexts. The small size is suitable for compact spaces, while the medium size is ideal for more prominent displays.The default size is medium.