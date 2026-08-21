"use client";
import { Kbd } from "@projectx/ui";

export default function Demo() {
  return (
    <>
      <Kbd keys={["⌘", "K"]} />
      <Kbd keys={["Ctrl", "Shift", "P"]} />
      <Kbd>Esc</Kbd>
    </>
  );
}
