import { AdminShell } from "@/components/admin/admin-shell";
import { QuestionManagement } from "@/components/admin/question-management";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Daftar Soal",
};

export default function AdminQuestionsPage() {
  return (
    <AdminShell active="questions">
      <div className="space-y-6">
        <div>
          <Badge variant="default">Manajemen Soal</Badge>
          <h1 className="mt-3 text-3xl font-black tracking-normal md:text-4xl">
            Kelola daftar soal
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Tambah manual, import file, filter, edit, dan hapus soal matematika SMA.
          </p>
        </div>
        <QuestionManagement />
      </div>
    </AdminShell>
  );
}
