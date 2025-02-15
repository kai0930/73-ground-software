import Terminal from './terminal';

export default function CommandsPage() {
  return (
    <div className="grid h-[calc(100vh-var(--header-height))] max-h-[calc(100vh-var(--header-height))] grid-cols-2 gap-4 py-4">
      <Terminal type="uplink" title="Uplink Terminal" />
      <Terminal type="downlink" title="Downlink Terminal" />
    </div>
  );
}
