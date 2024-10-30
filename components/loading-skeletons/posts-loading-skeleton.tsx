import React from "react";

const PostsLoadingSkeleton = () => {
  return (
    <div className="space-y-2">
      <div className="w-11/12 max-w-xs h-40 bg-slate-200 animate-pulse mx-auto rounded-md"></div>
      <div className="w-11/12 max-w-xs h-40 bg-slate-200 animate-pulse mx-auto rounded-md"></div>
      <div className="w-11/12 max-w-xs h-40 bg-slate-200 animate-pulse mx-auto rounded-md"></div>
      <div className="w-11/12 max-w-xs h-40 bg-slate-200 animate-pulse mx-auto rounded-md"></div>
      <div className="w-11/12 max-w-xs h-40 bg-slate-200 animate-pulse mx-auto rounded-md"></div>
    </div>
  );
};

export default PostsLoadingSkeleton;
