A Stepper guides a user through a sequence of steps in a process.

This is a controlled component that takes the `currentStep` prop to determine which step is active.

The `Stepper` includes the `Stepper.Context` that provides the `addStepRef` function. This collects the step elements to calculate the size of the progress bar. It also provides the currentStep.

The `Stepper` component can be used in two ways:
1. Render the steps yourself as children of the `Stepper` component using the `Step` component.
   - The `Step` component takes the props `index`, `id` and `children`.
   - The `id` is used to track changes in the number of steps.
   - Internally the `addStepRef` from the `Stepper.Context` is used to provide the `ref` to the Stepper to calculate the progress bar.
   - Internally the `currentStep` from the `Stepper.Context` is used to determine if the step is active or complete. A step is complete when the `index` is less than the `currentStep` and active when the `index` is equal to the `currentStep`.
   - You can also create your own custom step component, as long as you provide the `ref` to the `addStepRef` function.
2. Use the `steps` prop to pass an array of steps.
   - Where each step should be the `children` of the single step component.