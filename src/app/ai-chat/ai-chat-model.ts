export interface AiGenerateResponseForm {
  userId: string;
  conversationId?: string;
  prompt: string;
}

export interface AiResponseDto {
  conversationId: string;
  content: string;
  sources: AiResponseSourceDto[];
}

export interface  AiResponseSourceDto {
  score: number;
  text: string;
  fileName: string;
}
