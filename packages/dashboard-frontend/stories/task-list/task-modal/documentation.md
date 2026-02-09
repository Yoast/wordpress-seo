
The task modal is a component that displays detailed information about a specific task in the task list. It provides users with an overview of the task, its priority, its duration, and a call to action to complete the task.

The prop `isCompleted` will disable the call to action button when set to true, indicating that the task has already been completed.

## Usage

This component should be used with:
- **TaskListProvider**: A context provider that accepts the `locale` prop for formatting duration values.

## ChildTasks Component

The `ChildTasks` component can be passed as children to the TaskModal to display a list of child tasks associated with the parent task. This component provides:

- **Progress tracking**: Displays a progress bar showing the completion status of all child tasks
- **Paginated list**: Shows child tasks in a paginated format (4 items per page)
- **Task details**: Each child task displays its title, priority level, estimated duration, and completion status
- **Interactive navigation**: Click on any child task to open its detailed view
- **Pagination controls**: Navigate between pages with Previous/Next buttons and page indicators

### Props

- `tasks`: An array of child task objects, each containing:
  - `taskId`: Unique identifier for the child task
  - `title`: Title of the child task
  - `duration`: Estimated duration in minutes
  - `priority`: Priority level ('low', 'medium', 'high')
  - `isCompleted`: Boolean indicating completion status
- `singleTaskOnClick`: Callback function that receives the task ID when a child task is clicked