import ErrorBoundary from ".";
import { Alert, Button } from "../../";
import { useToggleState } from "../../hooks";

export default {
	title: "1. Elements/Error Boundary",
	component: ErrorBoundary,
	argTypes: {
		children: { control: "text" },
	},
	parameters: {
		docs: {
			description: {
				component: "An error boundary. See: https://github.com/bvaughn/react-error-boundary",
			},
		},
	},
};

const ShowError = ( { error, resetErrorBoundary } ) => (
	<Alert variant="error">
		<p>Something went wrong:</p>
		<pre>{ error.message }</pre>
		<Button className="yst-mt-2" onClick={ resetErrorBoundary }>Try again</Button>
	</Alert>
);

const Bomb = () => {
	throw new Error( "💥 KABOOM 💥" );
};

const Template = args => {
	const [ hasError, , , setErrored, setNotErrored ] = useToggleState( false );
	return (
		<div>
			<Button className="yst-mb-2" onClick={ setErrored }>Cause error</Button>
			<ErrorBoundary
				FallbackComponent={ ShowError }
				onReset={ setNotErrored }
			>
				{ hasError ? <Bomb /> : <p>{ args?.children }</p> }
			</ErrorBoundary>
		</div>
	);
};

export const Factory = Template.bind( {} );
Factory.parameters = {
	controls: { disable: false },
};
Factory.args = {
	children: "Everything is fine!",
};
