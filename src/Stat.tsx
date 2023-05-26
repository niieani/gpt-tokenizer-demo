interface StatProps {
  label: string;
  displayValue: string | number;
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const pricePerToken = {
  'gpt-3.5-turbo': 0.006 / 1000,
  'gpt-4': {
    prompt: 0.03 / 1000,
    completion: 0.06 / 1000,
  },
  'gpt-4-32k': {
    prompt: 0.06 / 1000,
    completion: 0.12 / 1000,
  },
  'claude-v1': 32.68 / 1000000, // ($32.68/million tokens)
  'claude-instant-v1': 5.51 / 1000000, // ($5.51/million tokens)
};

export default function Stat({ label, displayValue }: StatProps) {
  return <div className="stat">
    <div className="stat-value">{typeof displayValue === 'number' ? displayValue.toLocaleString() : displayValue}</div>
    <div className="stat-label">{label}</div>
  </div>
}

function displayAsCents(input: number)  {
  if(input < 0.01) {
    return '< 1¢';
  }
  return `${Math.round(input * 1000) / 10}¢`;
}

function displayAsDollars(input: number)  {
  return formatter.format(input);
}

function displayPrice(input: number) {
  if(input < 1) {
    return displayAsCents(input);
  }
  return displayAsDollars(input);
}

export function PriceStats({ tokens }: { tokens: number }) {
  return <>
    {Object.entries(pricePerToken).map(([model, price]) => {
      if(typeof price === 'object') {
        return <>
          <Stat key={`${model}-prompt`} displayValue={displayPrice(price.prompt * tokens)} label={`${model} prompt`} />
          <Stat key={`${model}-completion`} displayValue={displayPrice(price.completion * tokens)} label={`${model} completion`} />
        </>
      }
      return <Stat key={model} displayValue={displayPrice(price * tokens)} label={model} />
    })}
  </>
}
