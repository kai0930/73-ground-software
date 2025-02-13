import { Separator } from '@renderer/components/ui/separator';
import { SidebarTrigger } from '@renderer/components/ui/sidebar';

export default function Header() {
  return (
    <div className="flex h-[var(--header-height)] w-full items-center justify-between border border-solid border-border px-6">
      <div className="flex h-full items-center gap-6">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-3/5" />
        <ParameterDisplay title="Active Mode" value="Start" />
      </div>
      <ParameterDisplay title="Time" value="2025.01.01 12:00:00" />
      <div className="grid grid-cols-3 gap-8">
        <ParameterDisplay title="Latitude" value="38.123456" />
        <ParameterDisplay title="Longitude" value="114.123456" />
        <ParameterDisplay title="Attitude" value="100km" />
      </div>
    </div>
  );
}

type ParameterDisplayProps = {
  title: string;
  value: string;
};

function ParameterDisplay(props: ParameterDisplayProps) {
  const { title, value } = props;

  return (
    <div className="flex flex-col">
      <p className="text-xs text-muted-foreground">{title}</p>
      <p className="text-base font-bold">{value}</p>
    </div>
  );
}
