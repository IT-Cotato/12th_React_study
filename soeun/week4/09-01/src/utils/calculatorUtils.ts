export const performCalculation = (
  prev: number,
  current: number,
  operation: string
) => {
  switch (operation) {
    case "+":
      return prev + current;
    case "-":
      return prev - current;
    case "*":
      return prev * current;
    case "/":
      return prev / current;
    default:
      return current;
  }
};

export const initialData: CalculatorState = {
  currentNumber: "0",
  previousNumber: "",
  operation: null,
  isNewNumber: true,
};
