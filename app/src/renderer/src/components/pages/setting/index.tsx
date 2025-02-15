import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@renderer/components/ui/card';
import SerialCommunication from './serial-communication';

export default function SettingPage() {
  return (
    <div className="grid grid-cols-2 gap-4 pt-4">
      <SerialCommunication />
      <Card>
        <CardHeader>
          <CardTitle>Downlink Data Format</CardTitle>
          <CardDescription>Input the data format you want to use.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>now making...</p>
        </CardContent>
      </Card>
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Uplink Command Mapping</CardTitle>
          <CardDescription>Input the command mapping you want to use.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>now making...</p>
        </CardContent>
      </Card>
    </div>
  );
}
