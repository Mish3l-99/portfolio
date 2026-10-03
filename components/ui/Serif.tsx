/** Inline accent in the italic display serif. */
export default function Serif({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-serif font-normal tracking-normal italic">
      {children}
    </span>
  );
}
