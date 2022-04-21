import { Title } from "@yoast/ui-library";
import { ClipboardCheckIcon } from "@heroicons/react/outline";

const Welcome = () => (
	<div className="yst-mt-16 yst-text-center">
		<img src="https://yoast.com/app/uploads/2021/07/mission_bubble.png" className="yst-mb-4 yst-w-32 yst-inline-block" />
		<Title className="yst-mb-4 yst-text-2xl">Welcome!</Title>
		<p className="yst-text-lg">Welcome to the Yoast writing guide. We'll help you setup the best starting point for your post.</p>
	</div>
);

export default Welcome;
