import React, { useState } from 'react';

const FAConversion = () => {
  const [nfa, setNfa] = useState(null); // Assume NFA is an object
  const [dfa, setDfa] = useState(null);
 const convertNfaToDfa = (nfa) => {

  // Helper function to get the epsilon closure of a set of states
  const epsilonClosure = (states) => {
    const stack = [...states];
    const closure = new Set(states);

    while (stack.length > 0) {
      const state = stack.pop();
      if (nfa.transitions[state] && nfa.transitions[state]['']) {
        nfa.transitions[state][''].forEach(epsState => {
          if (!closure.has(epsState)) {
            closure.add(epsState);
            stack.push(epsState);
          }
        });
      }
    }
    return Array.from(closure);
  };

  // Helper function to move from a set of states on a given input
  const move = (states, input) => {
    const result = new Set();
    states.forEach(state => {
      if (nfa.transitions[state] && nfa.transitions[state][input]) {
        nfa.transitions[state][input].forEach(nextState => {
          result.add(nextState);
        });
      }
    });
    return Array.from(result);
  };
  

  const dfa = {
    states: [],
    alphabet: nfa.alphabet,
    transitions: {},
    startState: '',
    acceptStates: []
  };

  const startState = epsilonClosure([nfa.startState]);
  const stateQueue = [startState];
  const dfaStates = { [startState.sort().join(',')]: startState };

  dfa.startState = startState.sort().join(',');

  while (stateQueue.length > 0) {
    const currentState = stateQueue.shift();
    const stateName = currentState.sort().join(',');

    if (!dfa.transitions[stateName]) {
      dfa.transitions[stateName] = {};
    }

    nfa.alphabet.forEach(symbol => {
      const newState = epsilonClosure(move(currentState, symbol));
      const newStateName = newState.sort().join(',');

      if (newState.length > 0) {
        dfa.transitions[stateName][symbol] = newStateName;

        if (!dfaStates[newStateName]) {
          stateQueue.push(newState);
          dfaStates[newStateName] = newState;
        }
      }
    });
  }

  dfa.states = Object.keys(dfaStates);

  dfa.acceptStates = dfa.states.filter(state => {
    const nfaStateSet = state.split(',');
    return nfaStateSet.some(nfaState => nfa.acceptStates.includes(nfaState));
  });

  return dfa;
};

  return (
    <div>
      <button onClick={convertNfaToDfa}>Convert NFA to DFA</button>
      {dfa && <div>{JSON.stringify(dfa)}</div>}
    </div>
  );
};

export default FAConversion;
