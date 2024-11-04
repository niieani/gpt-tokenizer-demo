import { Fragment } from "react/jsx-runtime";
import { Encoding } from "./App";
import { modelsByEncoding } from "./pricing";

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
  const cents = Math.round(input * 100);
  return cents === 0 ? "< 0.01¢" : `${input.toFixed(2)}¢`;
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
  const models = modelsByEncoding[encoding] ?? {};

  return (
    <>
      {Object.entries(models).map(
        ([model, { humanName: humanReadableName, cost }]) => (
          <Fragment key={model}>
            {cost?.input ? (
              <Stat
                key={`${model}-input`}
                displayValue={displayPrice((cost.input * tokens) / 1_000_000)}
                label={`${humanReadableName} Input`}
              />
            ) : undefined}
            {cost?.output ? (
              <Stat
                key={`${model}-output`}
                displayValue={displayPrice((cost.output * tokens) / 1_000_000)}
                label={`${humanReadableName} Output`}
              />
            ) : undefined}
            {cost?.batchInput ? (
              <Stat
                key={`${model}-batch-input`}
                displayValue={displayPrice(
                  (cost.batchInput * tokens) / 1_000_000,
                )}
                label={`${humanReadableName} Batch Input`}
              />
            ) : undefined}
            {cost?.batchOutput ? (
              <Stat
                key={`${model}-batch-output`}
                displayValue={displayPrice(
                  (cost.batchOutput * tokens) / 1_000_000,
                )}
                label={`${humanReadableName} Batch Output`}
              />
            ) : undefined}
          </Fragment>
        ),
      )}
    </>
  );
}
