import { Replace } from "@application/helpers/replace";
import { randomUUID } from "crypto";

export interface ChatRoomProps {
    content: string 
    createdAt: Date
    senderId: string
    chatRoomId: string
}

export class ChatRoom {
     private props: ChatRoomProps;
         private _id: string;
       
         constructor(
           props: Replace<ChatRoomProps, { occuredAt?: Date }>,
           id?: string,
         ) {
           this._id = id ?? randomUUID();
           this.props = {
             ...props,
             createdAt: props.createdAt ?? new Date(),
           };
         }
       
         public get id(): string {
           return this._id;
         }
       
         public get content(): string {
            return this.content;
          }
    
          public set content(content: string) {
             this.props.content = content;
          }
    
          public get senderId(): string {
            return this.senderId;
          }
    
          public set senderId(senderId: string) {
             this.props.senderId = senderId;
          }
    
          public get chatRoomId(): string {
            return this.chatRoomId;
          }
    
          public set chatRoomId(chatRoomId: string) {
             this.props.chatRoomId = chatRoomId;
          }
    
          public get createdAt(): Date {
            return this.createdAt;
          }
}