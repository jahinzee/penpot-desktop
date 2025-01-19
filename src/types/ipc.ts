import type { NativeTheme } from "electron";
import { Instance } from "../process/settings.js";

export type Api = {
	send: (channel: string, data?: unknown) => void;
	setTheme: (themeId: NativeTheme["themeSource"]) => void;
	getInstances: () => Promise<Instance[]>;
	onOpenTab: (callback: (href: string) => void) => void;
	onTabMenuAction: (
		callback: ({ command, tabId }: TabContextMenuAction) => void,
	) => void;
};

type TabContextMenuAction = { command: string; tabId: number };
