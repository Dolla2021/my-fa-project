import React, { useState } from 'react';

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

const TestDeterministic = () => {
  const [fa, setFa] = useState({
    states: '',
    alphabet: '',
    transitionFunction: '',
    startState: '',
    acceptStates: '',
  });
  const [isDeterministicResult, setIsDeterministicResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFa({ ...fa, [name]: value });
  };

  const handleSubmit = (e) => {
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
    setIsDeterministicResult(result);
  };

  return (
    <div>
      <h2>Test if FA is Deterministic or Non-Deterministic</h2>
      <form onSubmit={handleSubmit}>
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
      {isDeterministicResult !== null && (
        <div>
          <strong>Is the FA Deterministic?</strong> {isDeterministicResult ? 'Yes' : 'No'}
        </div>
      )}
    </div>
  );
};

export default TestDeterministic;
