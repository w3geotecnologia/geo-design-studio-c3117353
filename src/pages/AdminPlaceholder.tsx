import AdminLayout from "@/components/AdminLayout";

const AdminPlaceholder = ({ title }: { title: string }) => (
  <AdminLayout title={title}>
    <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <p className="text-muted-foreground">Área administrativa pronta para receber os dados de {title.toLowerCase()}.</p>
    </section>
  </AdminLayout>
);

export default AdminPlaceholder;