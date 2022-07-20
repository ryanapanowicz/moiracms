import ImageResize from "quill-image-resize-module-react";
import React, { useContext, useMemo } from "react";
import ReactQuill, { Quill } from "react-quill";
import { AssetModalContext } from "..";

// Add image resize module
Quill.register("modules/imageResize", ImageResize);

declare global {
    interface Window { Quill: any; }
}

window.Quill = window.Quill || Quill;

// Add undo/redo icons to Quill
let icons = ReactQuill.Quill.import("ui/icons");
icons["undo"] =
    '<svg viewbox="0 0 18 18"><polygon class="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10"></polygon><path class="ql-stroke" d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"></path></svg>';
icons["redo"] =
    '<svg viewbox="0 0 18 18"><polygon class="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10"></polygon><path class="ql-stroke" d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"></path></svg>';

const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "align",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "width",
    "video",
];

export interface OnChangeHandler {
    (e: any): void;
}

export interface ContentEditorProps {
    value?: string;
    placeholder?: string;
    onChange?: OnChangeHandler;
}

const ContentEditor: React.FC<ContentEditorProps> = ({
    value = "",
    onChange = () => {},
    placeholder,
}) => {
    const { showModal, hideModal } = useContext(AssetModalContext);

    // Configure Quill options
    const modules = useMemo(
        () => ({
            toolbar: {
                container: [
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    ["bold", "italic", "underline", "strike", "blockquote"],
                    [
                        { align: [] },
                        { list: "ordered" },
                        { list: "bullet" },
                        { indent: "+1" },
                        { indent: "-1" },
                    ],
                    [{ image: "image" }, { video: "video" }, { link: "link" }],
                    ["undo", "redo"],
                ],
                handlers: {
                    undo: function (this: any) {
                        return this.quill.history.undo();
                    },
                    redo: function (this: any) {
                        return this.quill.history.redo();
                    },
                    image: function (this: any) {
                        const range = this.quill.getSelection();

                        showModal({
                            type: "view",
                            onSubmit: (selected) => {
                                if (
                                    selected.length &&
                                    selected instanceof Array
                                ) {
                                    selected.forEach((asset) => {
                                        this.quill.insertEmbed(
                                            range.index,
                                            "image",
                                            asset.url
                                        );
                                    });

                                    hideModal();
                                }
                            },
                        });
                    },
                },
            },
            imageResize: {
                overlayStyles: {
                    padding: "3px",
                    outline: "1px dashed rgba(58, 57, 153, 0.6)",
                    border: "none",
                },
                handleStyles: {
                    displaySize: true,
                    backgroundColor: "#373999",
                    border: "none",
                    opacity: "1",
                    boxShadow: "0 2px 0 rgb(0 0 0 / 5%)",
                },
                displayStyles: {
                    position: "absolute",
                    font: "14px/1.0 'Inter', -apple-system, sans-serif",
                    padding: "4px 8px",
                    textAlign: "center",
                    backgroundColor: "rgba(255, 255, 255, 255.85)",
                    color: "rgba(0, 0, 0, 0.85)",
                    border: "none",
                    borderRadius: "2px",
                    opacity: "1",
                },
                modules: ["Resize", "DisplaySize"],
                checkImage: (evt: any) => {
                    console.log(evt);
                },
            },
            history: {
                delay: 2000,
                maxStack: 500,
            },
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    return (
        <ReactQuill
            theme="snow"
            value={value}
            modules={modules}
            formats={formats}
            onChange={onChange}
            placeholder={placeholder}
        />
    );
};

export default ContentEditor;
