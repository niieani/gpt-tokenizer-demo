import { Encoding } from "./App";
import { pricingByEncoding } from "./pricing";

interface StatProps {
  label: string;
  displayValue: string | number;
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function Stat({ label, displayValue }: StatProps) {
  return (
    <div className="stat">
      <div className="stat-value">
        {typeof displayValue === "number"
          ? displayValue.toLocaleString()
          : displayValue}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function displayAsCents(input: number) {
  if (input < 0.0001) {
    return "< 0.01¢";
  }
  return `${Math.round(input * 1000) / 10}¢`;
}

function displayAsDollars(input: number) {
  return formatter.format(input);
}

function displayPrice(input: number) {
  if (input < 1) {
    return displayAsCents(input);
  }
  return displayAsDollars(input);
}

export function PriceStats({
  tokens,
  encoding,
}: {
  tokens: number;
  encoding: Encoding;
}) {
  const models = pricingByEncoding[encoding] ?? {};

  return (
    <>
      {Object.entries(models).map(
        ([model, { humanName: humanReadableName, regular, batchApi }]) => (
          <>
            <Stat
              key={`${model}-regular-input`}
              displayValue={displayPrice((regular.input * tokens) / 1_000_000)}
              label={`${humanReadableName} Regular Input`}
            />
            <Stat
              key={`${model}-regular-output`}
              displayValue={displayPrice((regular.output * tokens) / 1_000_000)}
              label={`${humanReadableName} Regular Output`}
            />
            {batchApi.input !== null && (
              <Stat
                key={`${model}-batch-input`}
                displayValue={displayPrice(
                  (batchApi.input * tokens) / 1_000_000,
                )}
                label={`${humanReadableName} Batch Input`}
              />
            )}
            {batchApi.output !== null && (
              <Stat
                key={`${model}-batch-output`}
                displayValue={displayPrice(
                  (batchApi.output * tokens) / 1_000_000,
                )}
                label={`${humanReadableName} Batch Output`}
              />
            )}
          </>
        ),
      )}
    </>
  );
}
