import { Title } from "@yoast/ui-library";
import { ClipboardCheckIcon } from "@heroicons/react/outline";

const Welcome = () => (
	<div className="yst-mt-8 yst-text-center">
		<ClipboardCheckIcon className="yst-mb-2 yst-inline-block yst-h-12 yst-w-12 yst-text-green-400" />
		<Title>Welcome!</Title>
		<p className="">Welcome to the Yoast writing guide. We'll help you setup the best starting point for your post.</p>
	</div>
);

export default Welcome;
