export interface IPromtOptions {
  temperature: number
  top_p: number
  frequency_penalty: number
  presence_penalty: number
  max_tokens: number
}

export interface IMessage {
  id?: string
  role: string
  content: string
  type?: string
  date?: string
}

export interface ISession {
  id: string
  created_at: string
  messages: IMessage[]
}
