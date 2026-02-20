"use client";

interface ExportButtonProps {
  subscriptions: { email: string; created_at: string }[];
}

export default function ExportButton({ subscriptions }: ExportButtonProps) {
  const handleExport = () => {
    const csv = [
      "email,subscribed_date",
      ...subscriptions.map(
        (s) =>
          `${s.email},${new Date(s.created_at).toISOString().split("T")[0]}`
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscriptions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700"
    >
      Export CSV
    </button>
  );
}
