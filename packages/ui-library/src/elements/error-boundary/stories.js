import React from "react";
import ErrorBoundary from ".";
import { Alert, Button } from "../../";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import { useToggleState } from "../../hooks";
import { component } from "./docs";

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

const Template = ( args ) => {
	const [ hasError, , , setErrored, setNotErrored ] = useToggleState( false );
	return (
		<>
			<Button className="yst-mb-2" onClick={ setErrored }>Cause error</Button>
			<ErrorBoundary
				FallbackComponent={ ShowError }
				onReset={ setNotErrored }
			>
				{ hasError ? <Bomb /> : <p>{ args?.children }</p> }
			</ErrorBoundary>
		</>
	);
};

export const Factory = {
	render: Template.bind( {} ),
	parameters: {
		controls: { disable: false },
	},
	args: {
		children: "Everything is fine!",
	},
};

export default {
	title: "1) Elements/Error boundary",
	component: ErrorBoundary,
	argTypes: {
		children: { control: "text" },
	},
	parameters: {
		docs: {
			description: { component },
			page: InteractiveDocsPage,
		},
	},
};
