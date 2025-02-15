import { cn } from '@renderer/lib/utils';
import { Board, BoardStatus } from '@renderer/types/board';

type Props = {
  className?: string;
};

const boardStatus = [
  {
    name: 'Real Time Video Board',
    status: BoardStatus.START,
    board: Board.VIDEO,
  },
  {
    name: 'Communication Board',
    status: BoardStatus.START,
    board: Board.COMMUNICATION,
  },
  {
    name: 'Parachute Board',
    status: BoardStatus.START,
    board: Board.PARA,
  },
  {
    name: 'Battery Board',
    status: BoardStatus.START,
    board: Board.BATTERY,
  },
  {
    name: 'Gimbal Board',
    status: BoardStatus.START,
    board: Board.GIMBAL,
  },
  {
    name: 'Gimbal Camera Board',
    status: BoardStatus.START,
    board: Board.GIMBAL_CAMERA,
  },
];

export default function Status({ className }: Props) {
  return (
    <div className={cn('w-full', className)}>
      {boardStatus.map((board) => (
        <div key={board.name} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex size-3">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
            </span>
            <p>{board.name}</p>
          </div>
          <p className="text-sm text-muted-foreground">{board.status}</p>
        </div>
      ))}
    </div>
  );
}
