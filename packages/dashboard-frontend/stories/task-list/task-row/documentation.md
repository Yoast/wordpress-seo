The `TaskRow` component displays a single task as a row in a table, providing a clear overview of task details and status within a task list. It is designed for use in the tasks list table where users need to view and interact with multiple tasks.

## Features

- Shows task title, estimated duration, priority, and an optional badge (e.g., `premium`, `woo`, `ai`).
- Indicates completion status with an icon (checkmark for completed, ellipse for incomplete).
- Supports loading state with `TaskRow.Loading`. It accepts the prop `titleClassName` to customize the title's loading skeleton appearance. It is used to add different widths to the title skeleton based on the expected title length. The default height is 18px.
- Allows for additional content for the last cell through children props, which can be used to add the task modal.
