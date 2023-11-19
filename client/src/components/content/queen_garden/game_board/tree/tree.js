import React, {useMemo} from "react";

export const Tree = ({fontSize, top, left, treeRef}) => useMemo(() => {
  let tree_styles = {};
  if (top !== undefined)
    tree_styles.top = top;
  if (left !== undefined)
    tree_styles.left = left;

  return (
    <div
      className='tree_container'
      style={tree_styles}
    >
      <div
        className="tree"
      >
        <div className="trunk"/>
        <div className="branches top"/>
        <div className="branches middle"/>
        <div className="branches bottom"/>
      </div>
    </div>
  )
}, [fontSize, top, left]);
