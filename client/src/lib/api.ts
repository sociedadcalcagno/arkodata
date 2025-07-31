import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from './queryClient';
import { Lead, InsertLead, ChatSession, InsertChatSession } from '@shared/schema';

// Lead API hooks
export const useLeads = () => {
  return useQuery<Lead[]>({
    queryKey: ['/api/leads'],
  });
};

export const useLead = (id: number) => {
  return useQuery<Lead>({
    queryKey: ['/api/leads', id],
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (lead: InsertLead) => 
      apiRequest('/api/leads', {
        method: 'POST',
        body: JSON.stringify(lead),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
    },
  });
};

// Chat session API hooks
export const useChatSessions = () => {
  return useQuery<ChatSession[]>({
    queryKey: ['/api/chat-sessions'],
  });
};

export const useCreateChatSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (session: InsertChatSession) => 
      apiRequest('/api/chat-sessions', {
        method: 'POST',
        body: JSON.stringify(session),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat-sessions'] });
    },
  });
};