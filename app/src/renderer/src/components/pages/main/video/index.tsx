import { cn } from '@renderer/lib/utils';
import { Loader2 } from 'lucide-react';
type Props = {
  className?: string;
};

export default function Video({ className }: Props) {
  const isLoading = true;
  return (
    <div className={cn('aspect-[4/3] w-full border', className)}>
      {isLoading ? (
        <div className="flex size-full items-center justify-center">
          <Loader2 className="size-10 animate-spin" />
        </div>
      ) : null}
    </div>
  );
}
