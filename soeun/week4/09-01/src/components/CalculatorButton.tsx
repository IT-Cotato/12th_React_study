export default function CalculatorButton({
  value,
  className,
  onClick,
}: ButtonConfigs) {
  return (
    <>
      <input
        type="button"
        className={className}
        value={value}
        onClick={onClick}
      />
    </>
  );
}
