import React, { useState } from 'react';
import DfaGraph from './components/DfaGraph';
const convertNFAtoDFA = (nfa) => {
  const dfaStates = [];
  const dfaTransitions = {};
  const dfaAcceptStates = new Set();

  const startState = new Set([nfa.startState]);
  const unprocessedStates = [startState];
  const processedStates = new Set();

  while (unprocessedStates.length > 0) {
    const currentState = unprocessedStates.pop();
    const currentStateKey = Array.from(currentState).sort().join(',');

    if (processedStates.has(currentStateKey)) continue;

    processedStates.add(currentStateKey);
    dfaStates.push(currentState);

    if ([...currentState].some(state => nfa.acceptStates.has(state))) {
      dfaAcceptStates.add(currentStateKey);
    }

    dfaTransitions[currentStateKey] = {};

    for (const symbol of nfa.alphabet) {
      const nextState = new Set();
      for (const state of currentState) {
        if (nfa.transitionFunction[state] && nfa.transitionFunction[state][symbol]) {
          for (const nextStateElement of nfa.transitionFunction[state][symbol]) {
            nextState.add(nextStateElement);
          }
        }
      }
      if (nextState.size > 0) {
        const nextStateKey = Array.from(nextState).sort().join(',');
        dfaTransitions[currentStateKey][symbol] = nextStateKey;

        if (!processedStates.has(nextStateKey)) {
          unprocessedStates.push(nextState);
        }
      }
    }
  }
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

  return {
    states: dfaStates.map(state => Array.from(state).sort().join(',')),
    alphabet: nfa.alphabet,
    transitionFunction: dfaTransitions,
    startState: Array.from(startState).sort().join(','),
    acceptStates: Array.from(dfaAcceptStates),
  };
};

const isDeterministic = (fa) => {
  for (const state in fa.transitionFunction) {
    const transitions = fa.transitionFunction[state];
    for (const symbol in transitions) {
      if (transitions[symbol].length > 1) {
        return false;
      }
    }
  }
  return true;
};

const isStringAccepted = (fa, inputString) => {
  let currentState = fa.startState;

  for (const symbol of inputString) {
    if (!fa.transitionFunction[currentState] || !fa.transitionFunction[currentState][symbol]) {
      return false;
    }
    currentState = fa.transitionFunction[currentState][symbol][0];
  }

  return fa.acceptStates.has(currentState);
};

function App() {
  const [fa, setFa] = useState({
    states: '',
    alphabet: '',
    transitionFunction: '',
    startState: '',
    acceptStates: '',
  });
  const [dfa, setDfa] = useState(null);
  const [isFaDeterministic, setIsFaDeterministic] = useState(null);
  const [isDfaDeterministic, setIsDfaDeterministic] = useState(null);
  const [inputString, setInputString] = useState('');
  const [isStringAcceptedResult, setIsStringAcceptedResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFa({ ...fa, [name]: value });
  };

  const handleStringChange = (e) => {
    setInputString(e.target.value);
  };

  const handleTestSubmit = (e) => {
    e.preventDefault();
    const faStates = fa.states.split(',').map(s => s.trim());
    const faAlphabet = fa.alphabet.split(',').map(s => s.trim());
    const faTransitionFunction = JSON.parse(fa.transitionFunction);
    const faStartState = fa.startState.trim();
    const faAcceptStates = new Set(fa.acceptStates.split(',').map(s => s.trim()));

    const faObject = {
      states: faStates,
      alphabet: faAlphabet,
      transitionFunction: faTransitionFunction,
      startState: faStartState,
      acceptStates: faAcceptStates,
    };

    const result = isDeterministic(faObject);
    setIsFaDeterministic(result);
  };

  const handleConvertSubmit = (e) => {
    e.preventDefault();
    const nfaStates = fa.states.split(',').map(s => s.trim());
    const nfaAlphabet = fa.alphabet.split(',').map(s => s.trim());
    const nfaTransitionFunction = JSON.parse(fa.transitionFunction);
    const nfaStartState = fa.startState.trim();
    const nfaAcceptStates = new Set(fa.acceptStates.split(',').map(s => s.trim()));

    const nfaObject = {
      states: nfaStates,
      alphabet: nfaAlphabet,
      transitionFunction: nfaTransitionFunction,
      startState: nfaStartState,
      acceptStates: nfaAcceptStates,
    };

    const dfaResult = convertNFAtoDFA(nfaObject);
    setDfa(dfaResult);
    setIsDfaDeterministic(isDeterministic(dfaResult));
  };

  const handleStringTestSubmit = (e) => {
    e.preventDefault();
    const faStates = fa.states.split(',').map(s => s.trim());
    const faAlphabet = fa.alphabet.split(',').map(s => s.trim());
    const faTransitionFunction = JSON.parse(fa.transitionFunction);
    const faStartState = fa.startState.trim();
    const faAcceptStates = new Set(fa.acceptStates.split(',').map(s => s.trim()));

    const faObject = {
      states: faStates,
      alphabet: faAlphabet,
      transitionFunction: faTransitionFunction,
      startState: faStartState,
      acceptStates: faAcceptStates,
    };

    const result = isStringAccepted(faObject, inputString);
    setIsStringAcceptedResult(result);
  };

  return (
    <div className="App">
      <h1>finite automata </h1>
      <form onSubmit={handleTestSubmit}>
        <h2>Create finite Automaton</h2>
        <div>
          <label>States (comma-separated):</label>
          <input type="text" name="states" value={fa.states} onChange={handleChange} />
        </div>
        <div>
          <label>Alphabet (comma-separated):</label>
          <input type="text" name="alphabet" value={fa.alphabet} onChange={handleChange} />
        </div>
        <div>
          <label>Transition Function (JSON format):</label>
          <textarea name="transitionFunction" value={fa.transitionFunction} onChange={handleChange} />
        </div>
        <div>
          <label>Start State:</label>
          <input type="text" name="startState" value={fa.startState} onChange={handleChange} />
        </div>
        <div>
          <label>Accept States (comma-separated):</label>
          <input type="text" name="acceptStates" value={fa.acceptStates} onChange={handleChange} />
        </div>
        <button type="submit">Test FA</button>
      </form>
      {isFaDeterministic !== null && (
        <div>
         
          <strong>Is the FA Deterministic?</strong> {isFaDeterministic ? 'Yes it is deterministic' : 'No it is not deterministic'}
        
        </div>
        
      )}
      <form onSubmit={handleConvertSubmit}>
        <h2>Convert NFA to DFA</h2>
        <button type="submit">Convert to DFA</button>
      </form>
      {dfa && (
        <div>
          <h2>DFA Result</h2>
          <div><strong>States:</strong> {dfa.states.join(', ')}</div>
          <div><strong>Start State:</strong> {dfa.startState}</div>
          <div><strong>Accept States:</strong> {dfa.acceptStates.join(', ')}</div>
          <div>
            <strong>Transition Function:</strong>
            <pre>{JSON.stringify(dfa.transitionFunction, null, 2)}</pre>
          </div>
          <DfaGraph dfa={dfa} />
          
         
        </div>
      )}
      <form onSubmit={handleStringTestSubmit}>
        <h2>Test if String is Accepted by FA</h2>
        <div>
          <label>Input String:</label>
          <input type="text" value={inputString} onChange={handleStringChange} />
        </div>
        <button type="submit">Test String</button>
      </form>
      {isStringAcceptedResult !== null && (
        <div>
          <strong>Is the string accepted?</strong> 
          {isStringAcceptedResult ? 'Yes it string that accepts by FA ' : 'No it not accept by'}
        </div>
      )}
    </div>
  );
}

export default App;
