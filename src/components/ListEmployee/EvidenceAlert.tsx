import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { MessageSquareWarning } from "lucide-react";

type EvidenceAlertProps = {
  title: string;
  description: string;
};

export default function EvidenceAlert({
  title,
  description,
}: EvidenceAlertProps) {
  return (
    <Alert className="mt-5 mx-auto w-[500px]">
      <MessageSquareWarning className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
