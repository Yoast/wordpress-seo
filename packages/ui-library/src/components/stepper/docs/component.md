A Stepper guides a user through a sequence of steps in a process.

This is a controlled component that takes the `currentStep` prop to determine which step is active.

The `Stepper` includes the `Stepper.Context` that provides the `addStepRef` function. This collects the step elements to calculate the size of the progress bar.

The `Stepper` component can be used in two ways:
1. Render the steps yourself as children of the `Stepper` component using the `Step` component.
   - The `Step` component takes the props `isActive`, `isComplete` and `children`.
   - Internally the `addStepRef` from the `Stepper.Context` is used to provide the `ref` to the Stepper.
   - You can also create your own custom step component, as long as you provide the `ref` to the `addStepRef` function.
2. Use the `steps` prop to pass an array of step objects.
   - Where each step object should have the properties `isActive`, `isComplete` and `children`.