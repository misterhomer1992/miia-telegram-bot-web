import { icons, type IconName } from "./icons";

export function Icon({ name }: { name: IconName }) {
  return icons[name] ?? null;
}
