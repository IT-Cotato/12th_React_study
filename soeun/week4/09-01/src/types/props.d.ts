type ButtonConfigs = {
  value: string;
  className: string;
  onClick: (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => void;
};

type CalculatorState = {
  currentNumber: string;
  previousNumber: string;
  operation: null;
  isNewNumber: boolean;
};
