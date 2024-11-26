declare var api: {
  send: (channel: string, data: unknown) => void;
  onOpenTab: (callback: (href: string) => void) => void;
};

declare var mainWindow: import("electron").BrowserWindow;

declare var transparent: boolean;
declare var AppIcon: string;
