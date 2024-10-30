import React, { useState, useEffect } from "react";
import { noop } from "lodash";
import { useToggleState } from "@yoast/ui-library";
import { TableButton } from ".";
import { component } from "./docs";

export const Factory = {
	parameters: {
		controls: { disable: false },
	},
	args: {
		variant: "add",
	},
	argTypes: {
		variant: {
			description: "The keyphrase table button variant.",
		},
	},
	render: ( { disabled } ) => {
		const [ isAdd, toggleIsAdd ] = useToggleState( true );
		const [ isSuccess, toggleIsSuccess ] = useToggleState( false );

		useEffect( () => {
			if ( isSuccess ) {
				const timerRestore = setTimeout( () => {
					toggleIsAdd();
					toggleIsSuccess();
				}, 1000 );

				return () => {
					clearTimeout( timerRestore );
				};
			}
		}, [ toggleIsAdd, toggleIsSuccess, isSuccess ] );

		return <>
			{ isSuccess ? <TableButton.SuccessMessage variant={ isAdd ? "add" : "remove" } />
				: <TableButton variant={ isAdd ? "add" : "remove" } onClick={ toggleIsSuccess } disabled={ disabled } /> }

		</>;
	},
};

export const Variants = () =>
	<>
		<TableButton variant="add" onClick={ noop } />
		<TableButton variant="remove" onClick={ noop } />
	</>;

export const SuccessMessage = () =>
	<>
		<TableButton.SuccessMessage variant="add" />
		<TableButton.SuccessMessage variant="remove" />
	</>;

export default {
	title: "2) Elements/TableButton",
	component: TableButton,
	parameters: {
		docs: {
			description: { component },
		},
	},
	decorators: [
		( Story ) => (
			<div className="yst-flex yst-gap-2">
				<Story />
			</div>
		),
	],
};
