import { StatItemProps } from "@/constant";
import { useCountUp } from "@/hooks";

const StatItem = ({ value, label, visible }: StatItemProps) => {
    const display = useCountUp({
        target: value,
        visible
    })
  return (
    <div className="px-6 py-7">
      <p className="text-2xl font-extrabold text-white tracking-tight tabular-nums">
        {display}
      </p>
      <p className="text-slate-500 text-xs font-medium mt-1">{label}</p>
    </div>
  );
};

export default StatItem;
