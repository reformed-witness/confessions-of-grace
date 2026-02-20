import { createClient } from "@/utils/supabase/server";
import { deleteSubscription } from "./actions";
import ExportButton from "./ExportButton";

export default async function AdminSubscriptionsPage() {
  const supabase = await createClient();

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("id, email, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Subscriptions</h1>
        <ExportButton subscriptions={subscriptions || []} />
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subscribed
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {subscriptions?.map((sub) => (
              <tr key={sub.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{sub.email}</td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(sub.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <form
                    action={deleteSubscription.bind(null, sub.id)}
                    className="inline"
                  >
                    <button
                      type="submit"
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!subscriptions || subscriptions.length === 0) && (
          <p className="text-gray-500 text-center py-8">
            No subscriptions found.
          </p>
        )}
      </div>
    </div>
  );
}
