export interface ILarkMessage {
  post: {
    en_us: {
      title: string;
      content: { tag: string; text: string }[][];
    };
  };
}
