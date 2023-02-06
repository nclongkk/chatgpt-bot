export class LarkMessage {
  msg_type: string;
  content: string;
  chat_id: string;
  root_id: string;
  message_id: string;
  constructor(content: string, chat_id: string, msg_type = 'interactive') {
    this.msg_type = msg_type;
    this.content = content;
    this.chat_id = chat_id;
  }

  export() {
    return {
      msg_type: 'text',
      content: JSON.stringify({
        text: this.content,
      }),
    };
  }
}
