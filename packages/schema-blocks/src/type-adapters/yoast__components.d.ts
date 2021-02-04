declare module "@yoast/components" {
	import { ReactElement } from "react";

	type SvgIconProps = {icon: string; color: string; size: string; className?: string }
	export function SvgIcon( props: SvgIconProps ): ReactElement
}
