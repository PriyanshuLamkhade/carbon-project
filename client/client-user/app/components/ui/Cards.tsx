import { ReactElement } from "react";

interface CardProps {
    title?:string | ReactElement,
    subtext?:string | ReactElement,
    icon?:any,
    number?:number,
    body?:string | ReactElement,
    className?:string
}
const Cards = (props: CardProps) => {
   const hasCustomHeight = props.className?.includes('h-');
    const hasCustomWidth = props.className?.includes('w-');
  return (
    <div className={`transition-all duration-500 delay-75  bg-white rounded-xl
    shadow-[0px_0px_15px_rgba(0,0,0,0.09)] p-9 space-y-3 relative overflow-hidden hover:-translate-2 
     ${hasCustomHeight ? '' : 'h-80'} ${hasCustomWidth ? '' : 'w-80'} ${props.className ?? ''}`}>
      <div className="w-24 h-32 bg-violet-500 rounded-full absolute -right-6 -top-8">
        <p className="absolute bottom-10 left-7 text-white text-2xl">{props.number}</p>
      </div>
      <div className="fill-violet-500 w-12">
        {props.icon}
      </div>    
      <h1 className="text-2xl font-extrabold">{props.title}</h1>
      <h2 className="text-zinc-800 text-xl">{props.subtext}</h2>
      <p className="text-md text-zinc-500 leading-6">
        {props.body}
      </p>
    </div>
  );
};

export default Cards;
