import type { FaqAnswerBlock } from "@/lib/site-data";

type Props = {
  blocks: FaqAnswerBlock[];
  className?: string;
};

export function FaqAnswer({ blocks, className = "" }: Props) {
  return (
    <div className={`space-y-3 text-body text-muted-foreground ${className}`}>
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          return (
            <p key={index} className="pt-1 font-semibold text-foreground">
              {block.text}
            </p>
          );
        }

        if (block.type === "list") {
          return (
            <ul key={index} className="list-disc space-y-1 pl-5">
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }

        return <p key={index}>{block.text}</p>;
      })}
    </div>
  );
}
