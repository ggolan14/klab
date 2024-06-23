import React, {useMemo} from "react";

export const Tree = ({top, left, tree_style = {}, class_name = ''}) => useMemo(() => {
  let tree_styles = {...tree_style};
  if (top !== undefined)
    tree_styles.top = top;
  if (left !== undefined)
    tree_styles.left = left;

  return (
    <div
      className={class_name || 'tree_container'}
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
}, [top, left, tree_style, class_name]);
