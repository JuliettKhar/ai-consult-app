export interface IPromtOptions {
  temperature: number
  top_p: number
  frequency_penalty: number
  presence_penalty: number
  max_tokens: number
}

export interface IMessage {
  role: string
  content: string
}
