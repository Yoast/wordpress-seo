The `Stepper` component takes the `currentStep` prop and has `Step` component to render steps as children. The `Stepper.Step` component takes the props `isActive`, `isComplete` and `children` as the label. 

The `Stepper` can also accept `steps` as a prop, list of step objects with the properties `isActive`, `isComplete` and `children`.

The `Stepper` has `Stepper.Context` to get the `addStepRef` function to add the to custom step to calculate the progress bar length. 