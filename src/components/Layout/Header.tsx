import { format } from "date-fns";
import { useSettings } from "../../hooks/useSettings";
import { useWorkspaceContext } from "../../context/WorkspaceContext";

const Header = () => {
  const { selectedWorkspaceId } = useWorkspaceContext();
  const { settings } = useSettings(selectedWorkspaceId || "");
  const today = format(new Date(), "EEEE, MMMM d, yyyy");

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {settings?.name || "Organization"}'s Briefing Room
      </h1>
      <p className="mt-1 text-sm text-gray-500">{today}</p>
    </div>
  );
};

export default Header;
