import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network';

const DfaGraph = ({ dfa }) => {
  const containerRef = useRef(null);
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
  useEffect(() => {
    const nodes = [];
    const edges = [];

    dfa.states.forEach(state => {
      nodes.push({ id: state, label: state, shape:'cycle', color: dfa.acceptStates.includes(state) ? 'blue' : 'yellow' });
    });

    for (const [from, transitions] of Object.entries(dfa.transitionFunction)) {
      for (const [symbol, to] of Object.entries(transitions)) {
        edges.push({ from, to, label: symbol, arrows: 'to' });
      }
    }

    const data = { nodes, edges };
    const options = {
      physics: { enabled: false },
      edges: { smooth: { type: 'cubicBezier', roundness: 0.4 } },
    };

    const network = new Network(containerRef.current, data, options);

    return () => network.destroy();
  }, [dfa]);

  return <div ref={containerRef} style={{ height: '500px', width:'400px' }} />;
};

export default DfaGraph;
