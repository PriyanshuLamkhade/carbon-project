interface CardProps {
    title:string,
    subtext:string,
    icon:any,
    number:number,
    body:string
}
const Cards = (props: CardProps) => {
  return (
    <div className="w-80 h-80 bg-white rounded-xl shadow-[0px_0px_15px_rgba(0,0,0,0.09)] p-9 space-y-3 relative overflow-hidden">
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
