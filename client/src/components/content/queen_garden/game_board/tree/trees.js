import React, {useEffect, useMemo, useState, useLayoutEffect} from "react";
import './trees.css';
import {Tree} from "./tree";
import {TREE_HEIGHT, TREE_WIDTH, TREES_ROADS_HEIGHT, TREES_ROADS_WIDTH} from "../constants";

export const AllTrees = ({}) => {
  const [numOfTrees, setNumOfTrees] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      try {

        const forest_width = TREES_ROADS_WIDTH;
        const forest_height = TREES_ROADS_HEIGHT;

        const trees_w = Math.floor(forest_width/TREE_WIDTH);
        const trees_h = Math.floor(forest_height/TREE_HEIGHT);

        setNumOfTrees(() => ({
          w: trees_w,
          h: trees_h,
          tree_width: TREE_WIDTH,
          tree_height: TREE_HEIGHT
        }));
      }
      catch (e) {}
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    }

  }, []);

  const Trees = useMemo(() => {
    if (!numOfTrees) return <></>;

    return (
      Array.from({length: numOfTrees.h}, (_,i) => i).map(
        tree_h_i => (
          Array.from({length: numOfTrees.w}, (_,i) => i).map(
            tree_w_i => (
              <Tree
                key={tree_w_i}
                fontSize={7}
                top={tree_h_i * numOfTrees.tree_height }
                left={tree_w_i * numOfTrees.tree_width}
              />
            )
          )
        )
      )

    )
  }, [numOfTrees]);

  return (
    <div
      className='All-trees'
    >
      {Trees}

    </div>
  )
};
