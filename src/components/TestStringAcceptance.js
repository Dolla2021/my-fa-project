const isStringAccepted = (fa, inputString) => {
  let currentState = fa.startState;

  for (const symbol of inputString) {
    if (!fa.transitionFunction[currentState] || !fa.transitionFunction[currentState][symbol]) {
      return false; // No transition defined for current state and symbol
    }
    currentState = fa.transitionFunction[currentState][symbol];
  }

  return fa.acceptStates.has(currentState);
};
  