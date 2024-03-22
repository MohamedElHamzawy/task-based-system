export function getRowClass(statusname) {
  switch (statusname) {
    case "pending":
      return "bg-yellow-100";
    case "waiting offer":
      return "bg-blue-100";
    case "approved":
      return "bg-sky-100";
    case "working on":
      return "bg-purple-100";
    case "assigned":
      return "bg-green-100";
    case "done":
      return "bg-green-100";
    case "delivered":
      return "bg-gray-100";
    case "rejected":
      return "bg-red-100";
    case "not available":
      return "bg-slate-100";
    case "on going":
      return "bg-teal-100";
    case "offer submitted":
      return "bg-orange-100";
    case "edit":
      return "bg-indigo-100";
    case "cancel":
      return "bg-pink-100";
    default:
      return "";
  }
}

export function getStatusClass(statusname) {
  switch (statusname) {
    case "pending":
      return "text-yellow-400";
    case "waiting offer":
      return "text-blue-400";
    case "approved":
      return "text-sky-400";
    case "working on":
      return "text-purple-400";
    case "assigned":
      return "text-green-400";
    case "done":
      return "text-green-400";
    case "delivered":
      return "text-gray-400";
    case "rejected":
      return "text-red-400";
    case "not available":
      return "text-slate-400";
    case "on going":
      return "text-teal-400";
    case "offer submitted":
      return "text-orange-400";
    case "edit":
      return "text-indigo-400";
    case "cancel":
      return "text-pink-400";
    default:
      return "";
  }
}
