import React, {useMemo} from "react";

export const Tree = ({fontSize, top, left, treeRef}) => useMemo(() => {
  let tree_styles = {fontSize};
  if (top !== undefined)
    tree_styles.top = top;
  if (left !== undefined)
    tree_styles.left = left;

  const props = {};
  if (treeRef)
    props.ref = treeRef;

  return (
    <div
      className='tree_container'
      style={tree_styles}
      {...props}
    >
      <div
        className="tree"
      >
        <div className="trunk"/>
        <div className="branches top">
          <div className="band"/>
        </div>
        <div className="branches middle">
          <div className="band"/>
        </div>
        <div className="branches bottom">
          <div className="band"/>
        </div>
      </div>
    </div>
  )
}, [fontSize, top, left]);
