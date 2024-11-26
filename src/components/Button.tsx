import { ReactNode } from "react";
import { cn } from "~/utils";

export default function Button<C extends React.ElementType>({
  as,
  className,
  children,
  ...props
}: {
  className?: string;
  as?: C;
  children: ReactNode;
} & React.ComponentPropsWithoutRef<C>) {
  const Component = as || "button";

  return (
    <Component
      {...props}
      className={cn(
        className,
        "w-full flex items-center space-x-4 shadow-md border rounded-3xl p-4 justify-center hover:border-[#ff3d9a] dark:border-0 bg-white dark:bg-zinc-900/40 hover:bg-[#ff3d9a]/5 dark:hover:bg-zinc-900/60 text-gray-500 dark:text-white font-medium transition-colors",
      )}
    >
      {children}
    </Component>
  );
}
