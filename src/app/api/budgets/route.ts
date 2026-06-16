import { budgetsMock, emptyBudgets } from "@/lib/mock-data";

export async function GET(request: Request) {
  const url = new URL(request.url);
  await new Promise((r) => setTimeout(r, 450 + Math.random() * 350));

  if (url.searchParams.get("fail") === "1") {
    return Response.json({ error: "Upstream budgets service unavailable." }, { status: 500 });
  }
  if (url.searchParams.get("empty") === "1") {
    return Response.json(emptyBudgets);
  }
  return Response.json(budgetsMock);
}
