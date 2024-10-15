import React, {useEffect, useState} from "react";
import './index.css';
import {Tree} from "../game_board/tree/tree";
import GardenWagon from "../game_board/wagon/wagon";

export const QueenGardenGameLoading = ({loading}) => {
  const [treeDim, setTreeDim] = useState(null);
  useEffect(() => {
    if (!loading) return ;

    const handleResize = () => {
      try {

        const tree_width = Math.floor(Math.min(0.1*window.innerWidth, 100));
        const tree_height = tree_width * 2;
        const SCREEN_HEIGHT = window.innerHeight; // because 2% padding .qg_game_load index.css
        const SCREEN_WIDTH = window.innerWidth;

        const MAX_COLS = Math.floor(SCREEN_WIDTH / tree_width);
        const MAX_ROWS = Math.floor(SCREEN_HEIGHT / tree_height);

        let MaxNumberOfTrees = MAX_COLS * MAX_ROWS;

        setTreeDim(() => ({
          tree_width, tree_height, MaxNumberOfTrees
        }));
      }
      catch (e) {}
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    }

  }, [loading]);

  if (!treeDim || !loading) return <></>;

  return (
    <div className='qg_game_load'>
      <div>
        <GardenWagon
          wagon_place={'game_load'}
          move_direction={'forward'}
          flower_color={null}
        />
      </div>
      <div>
        {Array.from({length: treeDim.MaxNumberOfTrees}, (_,i) => i).map(
          tree => (
            <Tree
              key={tree}
              class_name='qg_game_load_trees_container'
              tree_style={{
                width: treeDim.tree_width,
                height: treeDim.tree_height
              }}
              // top={tree_h_i * numOfTrees.tree_height }
              // left={tree_w_i * numOfTrees.tree_width}
            />
          )
        )}
      </div>
    </div>
  )
}
