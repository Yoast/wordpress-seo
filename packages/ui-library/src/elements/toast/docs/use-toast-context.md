The `useToastContext` hook returns the toast context. It provides an object with a `handleDismiss` callback, which can be used
to close the toast from other actions inside the modal. This is useful when you want to close the toast from a custom button or
a different kind of action.

With help of the `handleDismiss` callback, the `Toast.Close` subcomponent could be replaced with below `ConfirmButton`.

```jsx dark
import { Button, useToastContext } from "@yoast/ui-library";

const ConfirmButton = () => {
	const { handleDismiss } = useToastContext();
	return <Button size="small" onClick={ handleDismiss }>Confirm</Button>;
};
```
