import type { KeyBinding, TextareaRenderable } from "@opentui/core";
import { EmptyBorder } from "./border";
import { StatusBar } from "./status-bar";
import { CommandMenu } from "./command-menu";
import { useRef } from "react";
import { useRenderer } from "@opentui/react";
import { useEffect } from "react";
import { useCommandMenu } from "./command-menu/use-command-menu";
import { useCallback } from "react";
import type { Command } from "./command-menu/types";

type Props = {
  onSubmit: (text: string) => void;
  disabled?: boolean;
}

export const TEXTAREA_KEY_BINDINGS: KeyBinding[] = [
  {
    name: 'return', action: 'submit',
  },
  {
    name: "enter", action: 'submit'
  },
  {
    name: 'return', shift: true, action: 'newline',
  },
  {
    name: "enter", shift: true, action: 'newline'
  }
]


export function InputBar({ onSubmit, disabled = false }: Props) {
  const textareaRef = useRef<TextareaRenderable>(null);
  const onSubmitRef = useRef<() => void>(() => { });
  const renderer = useRenderer();
  const {
    showCommandMenu,
    commandQuery,
    selectedIndex,
    scrollRef,
    handleContentChange,
    resolveCommand,
    setSelectedIndex,
  } = useCommandMenu()
  const handleTextareaContentChange = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return

    handleContentChange(textarea.plainText)

  }, [])

  const handleCommand = useCallback((command: Command | undefined) => {
    const textarea = textareaRef.current;
    if (!textarea || !command) return
    textarea.setText('')
    if (command.action) {
      command.action({
        exit: () => renderer.destroy()
      })
    }
    else {
      textarea.insertText(command.value + " ")
    }
  }, [renderer])
  const handleCommandExecute = useCallback((index: number) => {
    const command = resolveCommand(index);
    handleCommand(command)

  }, [resolveCommand, handleCommand])


  const handleSubmit = useCallback(() => {
    if (disabled) return;
    const textarea = textareaRef.current;
    if (!textarea) return;

    const text = textarea.plainText.trim();
    if (text.length === 0) return;

    onSubmit(text);
    // clear text after submit
    textarea.setText('')
  }, [disabled, onSubmit])

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.onSubmit = () => {
      onSubmitRef.current();
    }
  }, [])

  onSubmitRef.current = () => {
    if (disabled) return;
    if (showCommandMenu) {
      const command = resolveCommand(selectedIndex);
      handleCommand(command);
      return
    }
    handleSubmit();
  }

  return (
    <box width={'100%'} alignItems="center">
      <box
        border={["left"]}
         borderColor={'cyan'}
        // left border
        customBorderChars={{
          ...EmptyBorder,
          vertical: "┃",
          bottomLeft: "╹",
        }}
        width={'100%'}
      >
        <box position="relative" justifyContent="center" paddingX={2} paddingY={1} backgroundColor={'#1A1A24'} width={'100%'} gap={1}>
          {showCommandMenu && (
            <box
              position="absolute"
              bottom={'100%'}
              left={0}
              width={'100%'}
              backgroundColor={"#1A1A24"}
              zIndex={10}
            >
              <CommandMenu query={commandQuery} selectedIndex={selectedIndex} onSelect={setSelectedIndex} scrollRef={scrollRef} onExecute={handleCommandExecute}/>
            </box>
          )}
          <textarea
          ref={textareaRef}
          onContentChange={handleTextareaContentChange}
          keyBindings={TEXTAREA_KEY_BINDINGS}
            focused={!disabled} placeholder={'Ask anything... "Fix a bug in the server"'} />
          <StatusBar />
        </box>

      </box>
    </box>
  );

}
