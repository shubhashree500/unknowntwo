import React from 'react';

type Props = {
  data: {
    title: string;
  };
};

export default function CommonCards({ data }: Props) {
  return (
    <div
      className={` flex w-72 h-56 justify-center items-center rounded-lg bg-[#3730a3] p-5 transition relative duration-300 cursor-pointer hover:translate-y-[3px] hover:shadow-[0_-8px_0px_0px_#2196f3]`}>
      <p className="text-white text-2xl ">{data.title}</p>
    </div>
  );
}
