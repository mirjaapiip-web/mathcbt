import { AdminShell } from "@/components/admin/admin-shell";
import { AiGeneratorPanel } from "@/components/admin/ai-generator-panel";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Generate Soal AI",
};

export default function AdminAiPage() {
  return (
    <AdminShell active="ai">
      <div className="space-y-6">
        <div>
          <Badge variant="default">Generator Soal AI</Badge>
          <h1 className="mt-3 text-3xl font-black tracking-normal md:text-4xl">
            Buat soal matematika dengan AI
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Hasil berisi soal, jawaban, pembahasan, topik, dan tingkat kesulitan.
          </p>
        </div>
        <AiGeneratorPanel />
      </div>
    </AdminShell>
  );
}
