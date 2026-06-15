const usd0 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const usd2 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatUsd = (n: number, decimals = false) =>
  (decimals ? usd2 : usd0).format(n);

export const formatTxDate = (iso: string) => {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${date} • ${time}`;
};

export const formatSignedUsd = (n: number) =>
  `${n >= 0 ? "+" : "-"}${usd2.format(Math.abs(n))}`;
