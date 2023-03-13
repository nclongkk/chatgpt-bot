type ReceiveIdType = 'open_id' | 'user_id' | 'chat_id' | 'union_id' | 'email';
export class LarkMessage {
  msg_type: string;
  content: string;
  receive_id: string;
  root_id: string;
  message_id: string;
  receive_id_type: ReceiveIdType;
  constructor(
    content: string,
    receive_id: string,
    msg_type = 'interactive',
    receive_id_type: ReceiveIdType = 'open_id',
  ) {
    this.msg_type = msg_type;
    this.content = content;
    this.receive_id = receive_id;
    this.receive_id_type = receive_id_type;
  }

  export() {
    return {
      receive_id: this.receive_id,
      msg_type: 'text',
      content: JSON.stringify({
        text: this.content,
      }),
    };
  }
}
