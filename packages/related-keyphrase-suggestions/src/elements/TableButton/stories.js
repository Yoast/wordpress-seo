import React, { useEffect, useRef } from "react";
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
		const buttonRef = useRef();

		useEffect( () => {
			if ( isSuccess ) {
				const timerRestore = setTimeout( () => {
					toggleIsAdd();
					toggleIsSuccess();
					buttonRef?.current?.focus();
				}, 1000 );

				return () => {
					clearTimeout( timerRestore );
				};
			}
		}, [ toggleIsAdd, toggleIsSuccess, isSuccess ] );

		return <div className="yst-flex yst-justify-end yst-relative">
			<TableButton
				variant={ isAdd ? "add" : "remove" }
				onClick={ toggleIsSuccess }
				disabled={ disabled }
				ref={ buttonRef }
				className={ isSuccess ? "yst-opacity-0" : "" }
			/>
			{ isSuccess && <TableButton.SuccessMessage variant={ isAdd ? "add" : "remove" } className="yst-absolute yst-top-0 yst-right-0" /> }
		</div>;
	},
};

export const Variants = () =>
	<>
		<TableButton variant="add" onClick={ noop } />
		<TableButton variant="remove" onClick={ noop } />
	</>;

export const SuccessMessage = () =>
	<>
		<TableButton.SuccessMessage variant="add" className="yst-opacity-100" />
		<TableButton.SuccessMessage variant="remove" className="yst-opacity-100" />
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
