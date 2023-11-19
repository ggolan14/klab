import React, {useEffect, useMemo, useRef, useState} from "react";
import './trees.css';
import {Tree} from "./tree";
import ReactDOM from "react-dom";
import {getGameSet} from "../../Start";

export const AllTrees = ({}) => {
  const [gridTemplateColumns, setGridTemplateColumns] = useState('');
  const [treesCount, setTreesCount] = useState(1);

  let containerRef = useRef();
  let treeRef = useRef();

  useEffect(() => {
    if (!(containerRef && containerRef.current)) return;
    if (!(treeRef && treeRef.current)) return;

    const handleResize = () => {
      try {
        const {width: containerWidth, height: containerHeight} = containerRef.current.getBoundingClientRect();
        const {width: treeWidth, height: treeHeight} = treeRef.current.getBoundingClientRect();
        let items_in_line = Math.floor(0.6*window.innerWidth/treeWidth);
        const rows_number = Math.floor(containerHeight/ treeHeight);
        setGridTemplateColumns(`repeat(${items_in_line}, max-content)`);
        setTreesCount(rows_number*items_in_line);
      }
      catch (e) {

      }
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, [containerRef, treeRef]);

  return (
    useMemo(() => {
      const {RoadOnHover} = getGameSet();
      return (
        <div
          style={{gridTemplateColumns}}
          className={'All-trees ' + (RoadOnHover.includes('Road')? 'prevent-events' : '')}
          ref={containerRef}
        >
          {
            (new Array(treesCount)).fill('').map(
              (aaa, aaa_i) => (
                <Tree
                  treeRef={aaa_i === 0?treeRef:null}
                  fontSize={7}
                  key={aaa_i}
                />
              )
            )
          }
        </div>
      )
    }, [gridTemplateColumns, containerRef, treesCount])
  )
};
