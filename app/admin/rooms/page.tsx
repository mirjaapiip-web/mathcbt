import { AdminShell } from "@/components/admin/admin-shell";
import { RoomManagement } from "@/components/admin/room-management";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Manajemen Room",
};

export default function AdminRoomsPage() {
  return (
    <AdminShell active="rooms">
      <div className="space-y-6">
        <div>
          <Badge variant="default">Manajemen Room</Badge>
          <h1 className="mt-3 text-3xl font-black tracking-normal md:text-4xl">
            Kelola room battle
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Buat kode unik, atur timer, pilih paket soal, mulai room, dan pantau peserta.
          </p>
        </div>
        <RoomManagement />
      </div>
    </AdminShell>
  );
}
