import React from 'react';

export default function LiveCard() {
  return (
    <div className="box-border h-32 w-32 p-2 leading-none shadow flex flex-col justify-between bg-gradient-to-b to-gray-400 via-transparent from-transparent">
      <div className="h-4 w-min px-2 text-xs flex justify-center items-center rounded bg-gray-300 text-white">606</div>
      <div className="w-full">
        <div className="h-4 w-min px-2 text-xs rounded bg-red-300 text-white">16:02~</div>
        <h3 className="w-full pt-1 text-base font-bold leading-none text-white whitespace-nowrap overflow-ellipsis overflow-hidden block">testtesttesttesttesttesttesttesttest</h3>
      </div>
    </div>
  );
}
