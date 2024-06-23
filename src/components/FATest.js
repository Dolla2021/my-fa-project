
import React, { useState } from 'react';

const FATest = ({ fa }) => {
  const [testString, setTestString] = useState('');
  const [result, setResult] = useState(null);

  const handleTest = () => {
    if (!fa) {
      setResult('No finite automaton provided.');
      return;
    }

    if (!testString) {
      setResult('Please provide a test string.');
      return;
    }

    const currentState = fa.startState;
    let currentStateSet = [currentState];

    for (let i = 0; i < testString.length; i++) {
      const inputSymbol = testString[i];
      const nextStateSet = [];

      currentStateSet.forEach(state => {
        if (fa.transitions[state] && fa.transitions[state][inputSymbol]) {
          nextStateSet.push(...fa.transitions[state][inputSymbol]);
        }
      });

      if (nextStateSet.length === 0) {
        setResult('String rejected.');
        return;
      }

      currentStateSet = nextStateSet;
    }

    if (currentStateSet.some(state => fa.acceptStates.includes(state))) {
      setResult('String accepted.');
    } else {
      setResult('String rejected.');
    }
  };

  const checkDeterministic = () => {
    if (!fa) {
      setResult('No finite automaton provided.');
      return;
    }

    for (const state in fa.transitions) {
      for (const symbol in fa.transitions[state]) {
        if (symbol === '') {
          setResult('The finite automaton is not deterministic.');
          return;
        }

        const nextStateSet = fa.transitions[state][symbol];
        if (nextStateSet.length !== 1) {
          setResult('The finite automaton is not deterministic.');
          return;
        }
      }
    }

    setResult('The finite automaton is deterministic.');
  };

  return (
    <div>
      <label>Test String:</label>
      <input type="text" value={testString} onChange={(e) => setTestString(e.target.value)} />
      <button onClick={handleTest}>Test String</button>
      <button onClick={checkDeterministic}>Check Deterministic</button>
      {result && <div>{result}</div>}
    </div>
  );
};

export default FATest;
