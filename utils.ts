type ClassValue = string | false | null | undefined;

/** Joins truthy class names: cn("a", isActive && "b"). */
export function cn(...classes: ClassValue[]) {
  return classes.filter(Boolean).join(" ");
}
