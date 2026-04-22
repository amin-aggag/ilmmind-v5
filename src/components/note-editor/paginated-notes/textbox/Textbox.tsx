import { PartialBlock } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";

export const TextboxComponent = ({
  textData,
}: {
  textData: PartialBlock[] | undefined;
}) => {
  const editor = useCreateBlockNote({ initialContent: textData });

  return <BlockNoteView editor={editor} />;
};
