import { Suspense } from "react";
import AdminDashboard from "../../components/admin-dashboard";
import { DashboardLayout } from "../../components/Layout";
import ErrorBoundary from "../../components/ErrorBoundary"; // import your ErrorBoundary

const AdminDashboardPage = () => {
  return (
    <ErrorBoundary
      fallback={
        <DashboardLayout>
          <div className="flex items-center justify-center h-screen text-red-600">
            <p>Something went wrong. Please try again later.</p>
          </div>
        </DashboardLayout>
      }
    >
      <Suspense
        fallback={
          <DashboardLayout>
            <div className="flex items-center justify-center h-screen">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </DashboardLayout>
        }
      >
        <AdminDashboard />
      </Suspense>
    </ErrorBoundary>
  );
};

export default AdminDashboardPage;
