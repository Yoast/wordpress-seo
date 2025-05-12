The custom progress bar allows you to override the default progress bar with your own implementation, providing flexibility in styling and behavior.

#### Key Features

- **Customizable Appearance**: The custom progress bar can have its own styles, colors, and animations.
- **Dynamic Positioning**: The progress bar dynamically adjusts its position based on the steps in the `Stepper`.
- **Smooth Transitions**: Includes smooth width transitions for a polished user experience.

#### Usage

The custom progress bar is passed to the `Stepper` component via the `ProgressBar` prop. The `ProgressBar` component receives the following props:

- `style`: An object containing the `left` and `right` positions for start and end points of the progress bar based on the center point of the frst and last step.
- `progress`: A number representing the progress percentage (0-100).

Without `ProgressBar`, the `Stepper` will default to its own progress bar.