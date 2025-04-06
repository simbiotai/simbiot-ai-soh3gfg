import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TicketState, Ticket, TicketStatus, TicketMessage } from '@/types';
import { useAuthStore } from './auth-store';

export const useTicketStore = create<TicketState>()(
  persist(
    (set, get) => ({
      tickets: [],
      activeTicket: null,
      isLoading: false,
      error: null,
      hasUnreadMessages: false,
      
      createTicket: async (subject: string, message: string, imageUrl?: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const user = useAuthStore.getState().user;
          if (!user) {
            throw new Error('User not authenticated');
          }
          
          // Create a new ticket
          const ticketId = Date.now().toString();
          const messageId = `${ticketId}-1`;
          const now = new Date().toISOString();
          
          const newMessage: TicketMessage = {
            id: messageId,
            ticketId,
            senderId: user.id,
            senderType: 'user',
            content: message,
            imageUrl,
            createdAt: now,
          };
          
          const newTicket: Ticket = {
            id: ticketId,
            userId: user.id,
            userEmail: user.email,
            subject,
            status: 'active',
            createdAt: now,
            updatedAt: now,
            lastMessageAt: now,
            messages: [newMessage],
            unreadCount: 0,
          };
          
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Add to the local state
          set({ 
            tickets: [newTicket, ...get().tickets],
            activeTicket: newTicket,
            isLoading: false 
          });
          
          return newTicket;
        } catch (error) {
          set({ 
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to create ticket'
          });
          throw error;
        }
      },
      
      sendMessage: async (ticketId: string, content: string, imageUrl?: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const user = useAuthStore.getState().user;
          if (!user) {
            throw new Error('User not authenticated');
          }
          
          const ticket = get().tickets.find(t => t.id === ticketId);
          if (!ticket) {
            throw new Error('Ticket not found');
          }
          
          // Create a new message
          const messageId = `${ticketId}-${ticket.messages.length + 1}`;
          const now = new Date().toISOString();
          
          const newMessage: TicketMessage = {
            id: messageId,
            ticketId,
            senderId: user.id,
            senderType: user.role === 'admin' ? 'admin' : 'user',
            content,
            imageUrl,
            createdAt: now,
          };
          
          // Update the ticket
          const updatedTicket: Ticket = {
            ...ticket,
            status: 'active',
            updatedAt: now,
            lastMessageAt: now,
            messages: [...ticket.messages, newMessage],
          };
          
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Update the local state
          const updatedTickets = get().tickets.map(t => 
            t.id === ticketId ? updatedTicket : t
          );
          
          set({ 
            tickets: updatedTickets,
            activeTicket: updatedTicket,
            isLoading: false 
          });
          
          return updatedTicket;
        } catch (error) {
          set({ 
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to send message'
          });
          throw error;
        }
      },
      
      fetchTickets: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const user = useAuthStore.getState().user;
          if (!user) {
            throw new Error('User not authenticated');
          }
          
          // In a real app, you would fetch tickets from an API
          // For now, we'll just use the local state
          
          // Check for unread messages
          const hasUnread = get().tickets.some(ticket => 
            ticket.status === 'active' && 
            ticket.messages.some(msg => 
              msg.senderType === (user.role === 'admin' ? 'user' : 'admin')
            )
          );
          
          set({ 
            isLoading: false,
            hasUnreadMessages: hasUnread
          });
        } catch (error) {
          set({ 
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch tickets'
          });
        }
      },
      
      fetchTicket: async (ticketId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const ticket = get().tickets.find(t => t.id === ticketId);
          if (!ticket) {
            throw new Error('Ticket not found');
          }
          
          set({ 
            activeTicket: ticket,
            isLoading: false 
          });
          
          return ticket;
        } catch (error) {
          set({ 
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch ticket'
          });
          throw error;
        }
      },
      
      setActiveTicket: (ticket: Ticket | null) => {
        set({ activeTicket: ticket });
      },
      
      updateTicketStatus: async (ticketId: string, status: TicketStatus) => {
        set({ isLoading: true, error: null });
        
        try {
          const user = useAuthStore.getState().user;
          if (!user) {
            throw new Error('User not authenticated');
          }
          
          const ticket = get().tickets.find(t => t.id === ticketId);
          if (!ticket) {
            throw new Error('Ticket not found');
          }
          
          // Update the ticket
          const updatedTicket: Ticket = {
            ...ticket,
            status,
            updatedAt: new Date().toISOString(),
          };
          
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Update the local state
          const updatedTickets = get().tickets.map(t => 
            t.id === ticketId ? updatedTicket : t
          );
          
          set({ 
            tickets: updatedTickets,
            activeTicket: updatedTicket,
            isLoading: false 
          });
          
          // Check for unread messages
          const hasUnread = updatedTickets.some(ticket => 
            ticket.status === 'active' && 
            ticket.messages.some(msg => 
              msg.senderType === (user.role === 'admin' ? 'user' : 'admin')
            )
          );
          
          set({ hasUnreadMessages: hasUnread });
          
          return updatedTicket;
        } catch (error) {
          set({ 
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to update ticket status'
          });
          throw error;
        }
      },
      
      markTicketAsRead: async (ticketId: string) => {
        try {
          const user = useAuthStore.getState().user;
          if (!user) {
            throw new Error('User not authenticated');
          }
          
          const ticket = get().tickets.find(t => t.id === ticketId);
          if (!ticket) {
            throw new Error('Ticket not found');
          }
          
          // If the ticket is already viewed or closed, do nothing
          if (ticket.status !== 'active') {
            return ticket;
          }
          
          // Update the ticket status to viewed
          return await get().updateTicketStatus(ticketId, 'viewed');
        } catch (error) {
          console.error('Failed to mark ticket as read:', error);
          throw error;
        }
      },
      
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'ticket-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        tickets: state.tickets,
        hasUnreadMessages: state.hasUnreadMessages,
      }),
    }
  )
);