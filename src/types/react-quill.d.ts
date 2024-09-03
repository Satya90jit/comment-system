declare module "react-quill" {
  import { Component } from "react";

  export interface Quill {
    Delta: any;
    Sources: any;
    UnprivilegedEditor: any;
  }

  export interface ReactQuillProps {
    value?: string;
    onChange?: (content: string, delta: any, source: any, editor: any) => void;
    modules?: any;
    placeholder?: string;
    ref?: any;
    className?: string;
  }

  export default class ReactQuill extends Component<ReactQuillProps> {}
}
