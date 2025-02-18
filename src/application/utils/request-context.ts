import { Injectable } from '@nestjs/common';

@Injectable()
export class RequestContext {
  private context: Record<string, any> = {};

  set(key: string, value: any) {
    this.context[key] = value;
  }

  get(key: string) {
    return this.context[key];
  }

  clear() {
    this.context = {};
  }
}
