export const TopBar = () => {
  return (
    <section className="overflow-hidden rounded-3xl border bg-card shadow-sm">
      <div className="grid gap-8 p-6 lg:grid-cols-[1fr_auto] lg:p-8">
        <div className="max-w-3xl space-y-4">
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Paris 2024 Football Endpoint Builder</h1>
            <p className="text-base text-muted-foreground sm:text-lg">
              App that helps QA engineers generate and review the expected API endpoint for every football
              match played during the Paris 2024 Olympic Games.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
