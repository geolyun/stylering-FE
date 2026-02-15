import { ProtectedRoute } from "@/components/protected-route";
import { ProfileView } from "@/components/profile-view";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileView />
    </ProtectedRoute>
  );
}
