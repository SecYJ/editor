import { createFileRoute } from "@tanstack/react-router";
import Bold from "@tiptap/extension-bold";
import HardBreak from "@tiptap/extension-hard-break";
import Italic from "@tiptap/extension-italic";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export const Route = createFileRoute("/editor")({
    component: EditorComponent,
});

function convertToSpan(html: string): string {
    return html
        .replace(
            /<strong>(.*?)<\/strong>|<em>(.*?)<\/em>|<u>(.*?)<\/u>/g,
            (match, p1, p2, p3) => {
                let content = p1 || p2 || p3;
                let styles = [];

                if (match.includes("<strong>"))
                    styles.push("font-weight: bold");
                if (match.includes("<em>")) styles.push("font-style: italic");
                if (match.includes("<u>"))
                    styles.push("text-decoration: underline");

                return `<span style="${styles.join("; ")}">${content}</span>`;
            },
        )
        .replace(/<\/?em>|<\/?u>/g, "");
}

function EditorComponent() {
    const editor = useEditor({
        extensions: [
            StarterKit,
            HardBreak.extend({
                addKeyboardShortcuts() {
                    return {
                        Enter: () => {
                            return this.editor.commands.setHardBreak();
                        },
                    };
                },
            }),
            Bold,
            Italic,
            Underline,
            TextStyle,
        ],
        autofocus: true,
    });

    console.log("content", convertToSpan(editor?.getHTML() ?? ""));

    return (
        <div className="ml-10">
            <div className="border border-green-500">
                <EditorContent editor={editor} />
            </div>
            {/* <FloatingMenu editor={editor}>
                This is the floating menu
            </FloatingMenu>
            <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu> */}

            <div className="mt-10 flex gap-8 *:border *:border-white *:px-4 *:py-2">
                <button
                    type="button"
                    onClick={() => {
                        editor?.commands.toggleBold();
                        editor?.commands.focus();
                    }}
                >
                    Bold
                </button>
                <button
                    type="button"
                    onClick={() => {
                        editor?.commands.toggleItalic();
                        editor?.commands.focus();
                    }}
                >
                    Italic
                </button>
                <button
                    type="button"
                    onClick={() => {
                        editor?.commands.toggleUnderline();
                        editor?.commands.focus();
                    }}
                >
                    Undelrine
                </button>
                <button
                    type="button"
                    onClick={() => {
                        editor?.commands.clearContent();
                        editor?.commands.focus();
                    }}
                >
                    clear content
                </button>
                <button
                    type="button"
                    onClick={() => {
                        editor?.commands.unsetBold();
                        editor?.commands.unsetUnderline();
                        editor?.commands.unsetItalic();
                        editor?.commands.focus();
                    }}
                >
                    unset
                </button>
            </div>
        </div>
    );
}
